import { decorate, observable, action, when } from 'mobx';
import BN from 'bn.js';
import fetch from 'cross-fetch';
import bs58 from 'bs58';
import crypto from 'isomorphic-webcrypto';
import Web3 from 'web3';

import { ValidatorModel } from './validator-model.js';
import { ValidatorModelBacked } from './validator-model-backed.js';
import { StakingAccountModel } from './staking-account-model.js';
const solanaWeb3 = require('./index.cjs.js');
import {
  callWithRetries,
  invalidateCache,
  transformNodeRpcGetParsedProgramAccountsToBackendFormat,
  cachedCallWithRetries,
} from './utils';
import { rewardsStore } from './rewards-store';
import * as api from './api';
import { formatToFixed } from '../utils/format-value';

const PRESERVE_BALANCE = new BN('1000000000', 10);
import { abi as EvmToNativeBridgeAbi } from './EvmToNativeBridge.json';
import * as ethereum from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
// import Store from "../wallet/data-scheme.js";

// const  = mobx;
async function tryFixCrypto() {
  try {
    if (global.globalThis && global.globalThis.crypto === crypto) return;
    await crypto.ensureSecure();
    if (global.globalThis && global.globalThis.crypto === crypto) return;
    const originalDigest = crypto.subtle.digest.bind(crypto.subtle);
    crypto.subtle.digest = (algorithm, buffer) => {
      if (typeof algorithm === 'string') {
        algorithm = { name: algorithm };
      }
      return originalDigest(algorithm, buffer);
    };
    if (!global.globalThis) {
      global.globalThis = {};
    }
    global.globalThis.crypto = crypto;
  } catch (e) {
    console.log('Cannot fix crypto', e.message);
  }
}

tryFixCrypto();

const MIN_VALIDATOR_STAKE = new BN('1000000000000000', 10);
class StakingStore {
  validators = null;
  accounts = null;
  vlxEvmBalance = null;
  vlxNativeBalance = null;
  isRefreshing = false;
  rent = null;
  seedUsed = Object.create(null);
  connection = null;
  openedValidatorAddress = null;
  evmAddress = null;
  currentEpoch = null;
  currentBlock = null;
  slotIndex = null;
  slotsInEpoch = null;
  epochTime = null;
  // currentTime = null;
  network = null;
  evmAPI = '';
  _currentSort = null;

  constructor(
    API_HOST,
    evmAPI,
    validatorsBackend,
    secretKey,
    publicKey,
    evmAddress,
    evmPrivateKey,
    network
  ) {
    if (typeof secretKey === 'string') {
      secretKey = bs58.decode(secretKey);
    }
    this.secretKey = secretKey;
    this.publicKeyBuffer = Buffer.from(bs58.decode(publicKey));
    this.publicKey58 = publicKey;
    this.publicKey = new solanaWeb3.PublicKey(publicKey);
    this.connection = new solanaWeb3.Connection(evmAPI, 'singleGossip');
    this.evmAddress = evmAddress;
    this.evmPrivateKey = evmPrivateKey;
    this.network = network;
    this.evmAPI = evmAPI;
    this.validatorsBackend = validatorsBackend;
    this.web3 = new Web3(new Web3.providers.HttpProvider(evmAPI));
    decorate(this, {
      connection: observable,
      validators: observable,
      vlxEvmBalance: observable,
      vlxNativeBalance: observable,
      isRefreshing: observable,
      accounts: observable,
      openedValidatorAddress: observable,
      currentEpoch: observable,
      currentBlock: observable,
      epochTime: observable,
      slotsInEpoch: observable,
      slotIndex: observable,
      _currentSort: observable,
    });
    this.startRefresh = action(this.startRefresh);
    this.endRefresh = action(this.endRefresh);

    invalidateCache();
    this.init();
  }

  async init() {
    await tryFixCrypto();
    await this.reloadWithRetry();
  }

  async reloadWithRetryAndCleanCache() {
    invalidateCache();
    await this.reloadWithRetry();
  }

  async reloadWithRetry() {
    if (this.isRefreshing) {
      return await when(() => !this.isRefreshing);
    }
    this.isRefreshing = true;
    try {
      await callWithRetries(
        async () => {
          await this.reloadFromBackend();
        },
        ['reloadFromBackend'],
        3
      );
    } catch (e) {
      console.warn('[reloadFromBackend] error, will load from node rpc: ', e);
      // Cannot load from backend. Use slower method.
      await rewardsStore.setConnection({
        connection: this.connection,
        network: this.network,
        validatorsBackend: this.validatorsBackend,
      });
      await this.reloadFromNodeRpc();
    }
    await when(() => this.validators && this.validators.length > 0);
    this.sort === 'total_staked'
      ? this.validators.replace(
          this.validators
            .slice()
            .sort((v1, v2) => v2.activeStake - v1.activeStake)
        )
      : this.validators.replace(
          this.validators
            .slice()
            .sort(
              (v1, v2) =>
                v2.apr -
                v1.apr -
                (v1.activeStake && v1.activeStake.gte(MIN_VALIDATOR_STAKE)
                  ? 1000
                  : 0) +
                (v2.activeStake && v2.activeStake.gte(MIN_VALIDATOR_STAKE)
                  ? 1000
                  : 0) -
                (v1.status === 'active' ? 2000 : 0) +
                (v2.status === 'active' ? 2000 : 0)
            )
        );
    //}
    this.isRefreshing = false;
  }

  async sortActiveStake() {
    if (this.validators.length > 0) {
      await when(
        () =>
          this.validators &&
          this.validators.length &&
          this.validators[0].activeStake !== null
      );
      this.validators.replace(
        this.validators
          .slice()
          .sort((v1, v2) => v2.activeStake - v1.activeStake)
      );
    }
  }

  async sortApr() {
    if (this.validators.length > 0) {
      await when(
        () =>
          this.validators &&
          this.validators.length &&
          this.validators[0].apr !== null
      );
      this.validators.replace(
        this.validators.slice().sort((v1, v2) => v2.apr - v1.apr)
      );
    }
  }

  async getEpochInfo() {
    return await cachedCallWithRetries(
      this.network,
      ['getEpochInfo', this.connection],
      () => this.connection.getEpochInfo(),
      3
    );
  }

  loadEpochInfo = async () => {
    const info = await this.getEpochInfo();
    const { epoch, blockHeight, slotIndex, slotsInEpoch } = info;
    this.currentEpoch = epoch;
    this.currentBlock = blockHeight;
    this.slotIndex = slotIndex;
    this.slotsInEpoch = slotsInEpoch;
    this.epochTime = ((slotsInEpoch - slotIndex) * 0.4) / 3600;
    // this.currentTime = currentTime;
  };

  async getConfigsMap() {
    const configs = await this.connection.getParsedProgramAccounts(
      new solanaWeb3.PublicKey('Config1111111111111111111111111111111111111')
    );
    const configPerValidator = new Map();
    for (let config of configs) {
      if (Buffer.isBuffer(config.account)) continue;
      const keys = config?.account?.data?.parsed?.info?.keys;
      if (!keys || keys.length < 2) continue;
      const signer = keys[1];
      if (!signer.signer) continue;

      configPerValidator.set(signer.pubkey, config);
    }
    return configPerValidator;
  }

  async reloadFromBackend() {
    // massive method
    this.startRefresh();

    const [, balanceRes, balanceEvmRes, validatorsFromBackendResult] =
      await Promise.all([
        this.loadEpochInfo(),
        this.connection.getBalance(this.publicKey),
        fetch(this.evmAPI, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: `{"jsonrpc":"2.0","id":${Date.now()},"method":"eth_getBalance","params":["${
            this.evmAddress
          }","latest"]}`,
        }),
        fetch(`${this.validatorsBackend}/v1/validators`),
      ]);
    const balanceEvmJson = await balanceEvmRes.json();
    const validatorsFromBackend = await validatorsFromBackendResult.json();

    if (!validatorsFromBackend.validators && !validatorsFromBackend.length) {
      throw new Error('No validators loaded');
    }

    let nativeCurrentUserAccounts = [];

    try {
      nativeCurrentUserAccounts =
        await api.getStakingAccountsFromBackendCachedWithRetries({
          network: this.network,
          validatorsBackend: this.validatorsBackend,
          params: { staker: this.publicKey58 },
        });
    } catch (error) {
      throw new Error(error);
    }

    const stakingAccounts = nativeCurrentUserAccounts.map(
      (account) =>
        new StakingAccountModel(
          account,
          this.connection,
          this.network,
          this.validatorsBackend
        )
    );

    const tmp = validatorsFromBackend.validators || validatorsFromBackend;
    const validators = tmp.map(
      (validator) =>
        new ValidatorModelBacked(validator, this.connection, this.network)
    );

    const validatorsMap = Object.create(null);
    for (var i = 0; i < validators.length; i++) {
      validatorsMap[validators[i].address] = validators[i];
    }
    for (var i = 0; i < stakingAccounts.length; i++) {
      const account = stakingAccounts[i];
      const validator = validatorsMap[account.validatorAddress];
      if (!validator) {
        if (account.isActivated) {
          console.warn(
            'Validator for account not found',
            account.validatorAddress
          );
        }
        continue;
      }
      validator.addStakingAccount(account);
    }
    const rent = await this.connection.getMinimumBalanceForRentExemption(200);

    this.endRefresh(
      balanceRes,
      balanceEvmJson,
      rent,
      validators,
      stakingAccounts
    );
  }

  async reloadFromNodeRpc() {
    this.startRefresh();
    await this.loadEpochInfo();
    const balanceRes = await this.connection.getBalance(this.publicKey);
    const balanceEvmRes = await fetch(this.evmAPI, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: `{"jsonrpc":"2.0","id":${Date.now()},"method":"eth_getBalance","params":["${
        this.evmAddress
      }","latest"]}`,
    });
    const balanceEvmJson = await balanceEvmRes.json();
    this.connection.getVoteAccounts().then(({ current, delinquent }) => {
      const filter = {
        memcmp: {
          offset: 0xc,
          bytes: this.publicKey58,
        },
      };
      this.connection
        .getParsedProgramAccounts(solanaWeb3.StakeProgram.programId, {
          filters: [filter],
          commitment: 'processed',
        })
        .then(async (nativeAccounts) => {
          const filteredAccounts = nativeAccounts.filter((account) => {
            return (
              account?.account?.data?.parsed?.info?.meta?.authorized?.staker ===
              this.publicKey58
            );
          });
          const stakingAccounts = filteredAccounts.map(
            (account) =>
              new StakingAccountModel(
                transformNodeRpcGetParsedProgramAccountsToBackendFormat(
                  account
                ),
                this.connection,
                this.network,
                null
              )
          );
          //console.log("waiting till isLatestRewardsLoading is false", rewardsStore.isLatestRewardsLoading);
          //await when( () =>{ rewardsStore.isLatestRewardsLoading === false });
          //console.log("Now isLatestRewardsLoading is false");
          const configPerValidator = await this.getConfigsMap();
          const validators = current
            .map((validator) => {
              console.log('validator: ', validator);
              return new ValidatorModel(
                validator,
                false,
                this.connection,
                this.network,
                configPerValidator.get(validator.nodePubkey)
              );
            })
            .concat(
              delinquent.map(
                (validator) =>
                  new ValidatorModel(
                    validator,
                    true,
                    this.connection,
                    this.network,
                    configPerValidator.get(validator.nodePubkey)
                  )
              )
            );
          const validatorsMap = Object.create(null);
          for (var i = 0; i < validators.length; i++) {
            validatorsMap[validators[i].address] = validators[i];
          }
          for (var i = 0; i < stakingAccounts.length; i++) {
            const account = stakingAccounts[i];
            const validator = validatorsMap[account.validatorAddress];
            if (!validator) {
              if (account.isActivated) {
                console.warn(
                  'Validator for account not found',
                  account.validatorAddress
                );
              }
              continue;
            }
            validator.addStakingAccount(account);
          }
          this.connection
            .getMinimumBalanceForRentExemption(200)
            .then((rent) => {
              this.endRefresh(
                balanceRes,
                balanceEvmJson,
                rent,
                validators,
                stakingAccounts
              );
            });
        });
    });
  }

  startRefresh = () => {
    // console.log('this.validators', this.validators)
    this.validators = null;
    this.accounts = null;
    this.rent = null;
    this.vlxNativeBalance = null;
    this.vlxEvmBalance = null;
  };

  endRefresh = (
    balanceRes,
    balanceEvmJson,
    rent,
    validators,
    stakingAccounts
  ) => {
    this.vlxNativeBalance = new BN(balanceRes + '', 10);
    this.vlxEvmBalance = new BN(balanceEvmJson.result.substr(2), 16).div(
      new BN(1e9)
    );
    this.rent = new BN(rent);
    this.validators = validators;
    this.accounts = stakingAccounts;
  };

  getStakedValidators() {
    if (!this.validators) {
      return null;
    }
    return this.validators.filter((validator) => !validator.myStake.isZero());
  }

  getNotStakedValidators() {
    if (!this.validators) {
      return null;
    }
    return this.validators.filter(({ myStake }) => myStake.isZero());
  }
  getAllValidators() {
    if (!this.validators) {
      return null;
    }
    return this.validators.filter((validator) => validator.myStake);
  }
  getValidatorDetails() {
    const validatorAddress = this.openedValidatorAddress;
    if (typeof validatorAddress !== 'string') {
      throw new Error('openedValidatorAddress need to be set');
    }
    const validator = this.validators.find(
      ({ address }) => address === validatorAddress
    );
    if (!validator) {
      throw new Error('Validator not found');
    }
    return {
      address: validatorAddress,
      identity: validator.identity,
      dominance: this.getDominance(validator),
      quality: this.getQuality(validator),
      annualPercentageRate: this.getAnnualRate(validator),
      apr: validator.apr,
      commission: validator.commission,
      status: validator.status,
      myStake: validator.myStake,
      activeStake: validator.activeStake,
      name: validator.name,
      available_balance: this.getBalance(),
      myActiveStake:
        validator.totalActiveStake &&
        validator.totalInactiveStake &&
        (!validator.totalActiveStake.isZero() ||
          !validator.totalInactiveStake.isZero() ||
          null) &&
        validator.totalActiveStake
          .mul(new BN(100))
          .div(validator.totalActiveStake.add(validator.totalInactiveStake))
          .toString(10),
      totalWithdrawRequested: validator.totalWithdrawRequested,
      availableWithdrawRequested: validator.availableWithdrawRequested,
      totalActiveStake: validator.totalActiveStake,
      totalActivatingStake: validator.totalActivatingStake,
      totalDeactivatingStake: validator.totalDeactivatingStake,
      totalInactiveStake: validator.totalInactiveStake,
      totalAvailableForWithdrawRequestStake:
        validator.totalAvailableForWithdrawRequestStake,
    };
  }
  getRewards() {
    const validatorAddress = this.openedValidatorAddress;
    if (typeof validatorAddress !== 'string') {
      throw new Error('openedValidatorAddress need to be set');
    }
    const validator = this.validators.find(
      ({ address }) => address === validatorAddress
    );
    if (!validator) {
      throw new Error('Validator not found');
    }
    return {
      rewards: validator.rewards || [],
      isLoading: validator.isRewardsLoading,
    };
  }

  async loadMoreRewards() {
    const validatorAddress = this.openedValidatorAddress;
    if (typeof validatorAddress !== 'string' || !this.validators) {
      return;
    }
    const validator = this.validators.find(
      ({ address }) => address === validatorAddress
    );
    if (!validator) {
      return;
    }
    await validator.loadMoreRewards();
  }

  getDominance(validator) {
    if (!this.validators) {
      return null;
    }
    const activeValidators = this.validators.filter(
      (v) => v.status === 'active'
    );
    let totalStake = new BN(0);
    for (let i = 0; i < activeValidators.length; i++) {
      totalStake = totalStake.add(activeValidators[i].activeStake);
    }
    let part =
      validator.activeStake.mul(new BN(1000)).div(totalStake).toNumber() / 1000;

    return part - 1 / activeValidators.length;
  }

  getQuality(validator) {
    if (!this.validators) {
      return null;
    }
    const activeValidators = this.validators.filter(
      (v) => v.status === 'active'
    );
    let sumBlocks = 0;
    for (let i = 0; i < activeValidators.length; i++) {
      sumBlocks = +activeValidators[i].lastBlock;
    }
    return validator.lastBlock - sumBlocks;
  }

  getBalance() {
    if (!this.vlxEvmBalance || !this.vlxNativeBalance) {
      return null;
    }
    return this.vlxEvmBalance.add(this.vlxNativeBalance);
  }

  getAnnualRate(validator) {
    return validator.apr ? formatToFixed(validator.apr * 100) : 0;
  }

  async getNextSeed() {
    const fromPubkey = this.publicKey;
    const addressesHs = Object.create(null);
    await when(() => !!this.accounts);
    for (let i = 0; i < this.accounts.length; i++) {
      addressesHs[this.accounts[i].address] = true;
    }

    let i = 0;
    while (true) {
      const stakePublilcKey = await solanaWeb3.PublicKey.createWithSeed(
        fromPubkey,
        i.toString(),
        solanaWeb3.StakeProgram.programId
      );
      const toBase58 = stakePublilcKey.toBase58();
      if (!addressesHs[toBase58] && !this.seedUsed[i]) {
        break;
      }
      i++;
    }
    this.seedUsed[i] = true;
    return i.toString();
  }

  async sendTransaction(transaction) {
    try {
      const feePayer = this.publicKey;
      const { blockhash } = await this.connection.getRecentBlockhash();

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = feePayer;
    } catch (e) {
      return {
        error: 'cunstruct_transaction_error',
        description: e.message,
      };
    }

    const payAccount = new solanaWeb3.Account(this.secretKey);
    let result = await this.connection.sendTransaction(transaction, [
      payAccount,
    ]);
    console.log('Transaction result', result);

    return result;
  }

  waitTransactionMined(txHash, interval, resolve, reject) {
    const self = this;
    const transactionReceiptAsync = () => {
      this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
          reject(error);
        } else if (receipt == null) {
          setTimeout(
            () => transactionReceiptAsync(),
            interval ? interval : 500
          );
        } else {
          resolve(receipt);
        }
      });
    };
    transactionReceiptAsync();
  }

  async swapEvmToNative(swapAmount) {
    const evmToNativeBridgeContract = this.web3.eth
      .contract(EvmToNativeBridgeAbi)
      .at('0x56454c41532d434841494e000000000053574150');

    const data = evmToNativeBridgeContract.transferToNative.getData(
      '0x' + this.publicKeyBuffer.toString('hex')
    );

    const privateKey = Buffer.from(this.evmPrivateKey.substr(2), 'hex');
    const nonce = await new Promise((resolve, reject) => {
      this.web3.eth.getTransactionCount(
        this.evmAddress,
        'pending',
        (err, value) => {
          if (err) return reject(err);
          resolve(value);
        }
      );
    });
    let chainId = this.network === 'mainnet' ? 106 : 111;
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'velas',
        networkId: chainId,
        chainId: chainId,
      },
      'istanbul'
    );

    var rawTx = {
      nonce,
      gasPrice: '0x' + (3000000000).toString(16),
      gasLimit: '0x' + (210000).toString(16),
      to: '0x56454c41532d434841494e000000000053574150',
      value: '0x' + swapAmount.mul(new BN(1e9)).toString(16),
      data,
    };

    var tx = new ethereum.Transaction(rawTx, { common: customCommon });
    tx.sign(privateKey);

    var serializedTx = tx.serialize();
    return await new Promise((resolve, reject) => {
      this.web3.eth.sendRawTransaction(
        '0x' + serializedTx.toString('hex'),
        (err, transactionHash) => {
          if (err) {
            return reject(err);
          }
          this.waitTransactionMined(transactionHash, 1000, resolve, reject);
        }
      );
    });
  }

  async stake(address, amount_sol) {
    const transaction = new solanaWeb3.Transaction();
    const swapAmount = this.getSwapAmountByStakeAmount(amount_sol);
    const rent = this.rent;
    const fromPubkey = this.publicKey;
    const authorized = new solanaWeb3.Authorized(fromPubkey, fromPubkey);
    const lamportsBN = new BN(amount_sol).add(rent);
    const seed = await this.getNextSeed();
    const votePubkey = new solanaWeb3.PublicKey(address);
    const stakePubkey = await solanaWeb3.PublicKey.createWithSeed(
      fromPubkey,
      seed,
      solanaWeb3.StakeProgram.programId
    );
    const lockup = new solanaWeb3.Lockup(0, 0, fromPubkey);

    const config = {
      authorized,
      basePubkey: fromPubkey,
      fromPubkey,
      lamports: lamportsBN.toString(),
      lockup,
      seed,
      stakePubkey,
    };
    if (!swapAmount.isZero()) {
      await this.swapEvmToNative(swapAmount);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    transaction.add(solanaWeb3.StakeProgram.createAccountWithSeed(config));
    transaction.add(
      solanaWeb3.StakeProgram.delegate({
        authorizedPubkey: fromPubkey,
        stakePubkey,
        votePubkey,
      })
    );

    const result = await this.sendTransaction(transaction);
    await this.reloadWithRetryAndCleanCache();
    return result;
  }

  getSwapAmountByStakeAmount(amountStr) {
    const amount =
      typeof amountStr === 'string' ? new BN(amountStr * 1e9) : amountStr;
    if (!this.vlxNativeBalance) {
      return null;
    }
    if (this.vlxNativeBalance.gte(amount.add(PRESERVE_BALANCE))) {
      return new BN(0);
    }
    if (!this.vlxEvmBalance) {
      return null;
    }
    if (this.vlxNativeBalance.add(this.vlxEvmBalance).lt(amount)) {
      return null;
    }

    if (
      this.vlxNativeBalance
        .add(this.vlxEvmBalance)
        .lte(amount.add(PRESERVE_BALANCE))
    ) {
      return this.vlxEvmBalance;
    }

    return amount.add(PRESERVE_BALANCE).sub(this.vlxNativeBalance);
  }

  async splitStakeAccountTransaction(stakeAccount, lamports) {
    if (typeof lamports === 'string') {
      lamports = new BN(lamports, 10);
    }
    let transaction = null;
    const authorizedPubkey = this.publicKey;
    const stakePubkey = new solanaWeb3.PublicKey(stakeAccount.address);
    const rent = this.rent;
    const seed = await this.getNextSeed();
    const splitStakePubkey = await solanaWeb3.PublicKey.createWithSeed(
      authorizedPubkey,
      seed,
      solanaWeb3.StakeProgram.programId
    );

    const params = {
      stakePubkey,
      authorizedPubkey,
      splitStakePubkey,
      lamports: lamports.add(rent),
      seed,
      base: authorizedPubkey,
    };

    return solanaWeb3.StakeProgram.split(params);
    // return await this.sendTransaction(transaction);
  }

  async undelegateTransaction(stakePubkey) {
    const transaction = new solanaWeb3.Transaction();
    const authorizedPubkey = this.publicKey;

    transaction.add(
      solanaWeb3.StakeProgram.deactivate({
        authorizedPubkey,
        stakePubkey,
      })
    );
    return transaction;
    // return await this.sendTransaction(transaction);
  }

  async requestWithdraw(address, amount) {
    if (!this.validators) {
      throw new Error('Not loaded');
    }
    const transaction = new solanaWeb3.Transaction();
    const validator = this.validators.find((v) => v.address === address);
    if (!validator) {
      throw new Error('Not found');
    }
    const sortedAccounts = validator.stakingAccounts
      .filter((a) => a.state === 'active' || a.state === 'activating')
      .filter((a) => {
        return (
          !a.unixTimestamp ||
          new BN(a.unixTimestamp).lt(new BN(Date.now() / 1000))
        );
      })
      .sort((a, b) => b.myStake.cmp(a.myStake));
    let totalStake = new BN(0);
    if (typeof amount === 'string') {
      amount = new BN(parseFloat(amount) * Math.pow(10, 9));
    }
    for (let i = 0; i < sortedAccounts.length; i++) {
      totalStake = totalStake.add(sortedAccounts[i].myStake);
    }
    if (totalStake.sub(new BN(10000000)).lt(amount)) {
      amount = totalStake;
    }
    while (!amount.isZero() && !amount.isNeg()) {
      const account = sortedAccounts.pop();
      if (amount.gte(account.myStake)) {
        transaction.add(await this.undelegateTransaction(account.publicKey));
        amount = amount.sub(account.myStake);
      } else {
        transaction.add(
          await this.splitStakeAccountTransaction(
            account,
            account.myStake.sub(amount)
          )
        );
        transaction.add(await this.undelegateTransaction(account.publicKey));
        break;
      }
    }

    await this.sendTransaction(transaction);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.reloadWithRetryAndCleanCache();
  }

  async withdrawRequested(address) {
    const transaction = new solanaWeb3.Transaction();
    const authorizedPubkey = this.publicKey;

    await when(() => !!this.accounts);
    for (let i = 0; i < this.accounts.length; i++) {
      const account = this.accounts[i];
      if (account.validatorAddress !== address) continue;
      if (account.unixTimestamp > Date.now() / 1000) continue;
      try {
        const { inactive, state } = await this.connection.getStakeActivation(
          new solanaWeb3.PublicKey(account.publicKey)
        );
        if (!inactive || (state !== 'inactive' && state !== 'deactivating')) {
          continue;
        }
        transaction.add(
          solanaWeb3.StakeProgram.withdraw({
            authorizedPubkey,
            stakePubkey: account.publicKey,
            lamports:
              state === 'inactive'
                ? parseFloat(account.myStake.toString(10))
                : inactive + this.rent.toNumber(),
            toPubkey: authorizedPubkey,
          })
        );
      } catch (e) {
        console.warn(e);
      }
    }
    const res = await this.sendTransaction(transaction);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.reloadWithRetryAndCleanCache();
    return res;
  }

  get sort() {
    return this._currentSort || localStorage.sort;
  }

  set sort(value) {
    localStorage.sort = value;
    this._currentSort = value;
  }
}

export { StakingStore };
