import { decorate, observable, action } from "mobx";
import BN from "bn.js";
// import * as solanaWeb3 from ;
import bs58 from 'bs58';
import { ValidatorModel } from './validator-model.js';
import { StakingAccountModel } from './staking-account-model.js';
import fetch from 'cross-fetch';
const solanaWeb3 = require('./index.cjs.js');
import { callWithRetries } from './utils';
import crypto from 'isomorphic-webcrypto';

const SOL = new BN('1000000000', 10);
const PRESERVE_BALANCE = new BN('1000000000', 10);
// const  = mobx;


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

  constructor(API_HOST, secretKey, publicKey, evmAddress) {
    if (typeof secretKey === 'string') {
      secretKey = bs58.decode(secretKey);
    }
    this.secretKey = secretKey;
    this.publicKeyBuffer = bs58.decode(publicKey);
    this.publicKey58 = publicKey;
    this.publicKey = new solanaWeb3.PublicKey(publicKey);
    this.connection = new solanaWeb3.Connection(API_HOST, 'singleGossip');
    this.evmAddress = evmAddress;

    decorate(this, {
      validators: observable,
      vlxEvmBalance: observable,
      vlxNativeBalance: observable,
      isRefreshing: observable,
      accounts: observable,
      openedValidatorAddress: observable,
    });

    this.reloadWithRetry();
  }

  async reloadWithRetry() {
    this.isRefreshing = true;
    await callWithRetries(
      () => this.reload()
    );
    this.isRefreshing = false;
  }

  async reload() {
    await crypto.ensureSecure();
    const originalDigest = crypto.subtle.digest.bind(crypto.subtle);
    crypto.subtle.digest = (algorithm, buffer) => {
      if (typeof algorithm === 'string') {
        algorithm = { name: algorithm };
      }
      return originalDigest(algorithm, buffer);
    };
    global.globalThis.crypto = crypto;
    const balanceRes = await this.connection.getBalance(this.publicKey);
    this.vlxNativeBalance = new BN(balanceRes + '', 10);
    const balanceEvmRes = await fetch('https://explorer.velas.com/rpc', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: `{"jsonrpc":"2.0","id":${Date.now()},"method":"eth_getBalance","params":["${this.evmAddress}","latest"]}`
    });
    const balanceEvmJson = await balanceEvmRes.json();
    this.vlxEvmBalance = new BN(balanceEvmJson.result.substr(2), 16).div(new BN(1e9));
    // debugger;
    // console.log(this.balanceEvmRes.toString(10));
    const { current, delinquent } = await this.connection.getVoteAccounts();
    const filter = {memcmp: {
      offset: 0xc,
      bytes: this.publicKey58,
    }};
    const nativeAccounts = await this.connection.getParsedProgramAccounts(
      solanaWeb3.StakeProgram.programId,
      { filters: [filter] }
    );
    const filteredAccounts = nativeAccounts.filter(({ account }) => {
      const { authorized } = account.data.parsed.info.meta;
      return authorized && authorized.staker === this.publicKey58;
    });
    const stakingAccounts = filteredAccounts.map(account =>
      new StakingAccountModel(account, this.connection)
    );
    const validators = (
      current.map((validator) => new ValidatorModel(validator, false))
      .concat(delinquent.map((validator) => new ValidatorModel(validator, true)))
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
          console.warn('Validator for account not found', account.validatorAddress);
        }
        continue;
      }
      validator.addStakingAccount(account);
    }

    const rent = await this.connection.getMinimumBalanceForRentExemption(200);
    this.rent = new BN(rent);
    this.validators = validators;
    this.accounts = stakingAccounts;
  }

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
    return this.validators.filter(({myStake}) => myStake.isZero());
  }

  getValidatorDetails() {
    const validatorAddress = this.openedValidatorAddress;
    if (typeof validatorAddress !== 'string') {
      throw new Error('openedValidatorAddress need to be set');
    }
    const validator = this.validators.find(({address}) => address === validatorAddress);
    if (!validator) {
      throw new Error('Validator not found');
    }
    return {
      address: validatorAddress,
      dominance: this.getDominance(validator),
      quality: this.getQuality(validator),
      annualPercentageRate: this.getAnnualRate(validator),
      apr: validator.apr,
      commission: validator.commission,
      status: validator.status,
      myStake: validator.myStake,
      activatedStake: validator.activatedStake,
      available_balance: this.getBalance(),
      myActiveStake: this.getActiveStake(),
    };
  }

  getDominance(validator) {
    if (!this.validators) {
      return null;
    }
    const activeValidators = this.validators.filter(v => v.status === 'active');
    let totalStake = new BN(0);
    for (let i = 0; i < activeValidators.length; i++) {
      totalStake = totalStake.add(activeValidators[i].activatedStake);
    }
    let part = validator.activatedStake.mul(new BN(1000)).div(totalStake).toNumber() / 1000;

    return part - 1/activeValidators.length;
  }

  getQuality(validator) {
    if (!this.validators) {
      return null;
    }
    const activeValidators = this.validators.filter(v => v.status === 'active');
    let sumBlocks = 0;
    for (let i = 0; i < activeValidators.length; i++) {
      sumBlocks =+ activeValidators[i].lastBlock;
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
    return validator.apr;
  }
  getActiveStake () {
    return 33;
  }
  getNewAccountAddress() {
      return 'F3RZb2HFM6hs4yN9VQZckFdB';
  }
  async getNextSeed() {
      const fromPubkey = this.publicKey;
      const addressesHs = Object.create(null);
      for (let i = 0; i < this.accounts.length; i++) {
        addressesHs[this.accounts[i].address] = true;
      }

      let i = 0;
      while(true) {
          const stakePublilcKey = await solanaWeb3.PublicKey.createWithSeed(
            fromPubkey,
            i.toString(),
            solanaWeb3.StakeProgram.programId,
          );
          const toBase58 = stakePublilcKey.toBase58();
          if (!addressesHs[toBase58] && !this.seedUsed[i]) {
            break;
          }
          i++;
      }
      this.seedUsed[i] = true;
      return i.toString();
  };

  async sendTransaction(transaction) {
      try {
          const feePayer      = this.publicKey;
          const { blockhash } = await this.connection.getRecentBlockhash();

          transaction.recentBlockhash = blockhash;
          transaction.feePayer        = feePayer;

      } catch(e) {
          return {
              error: "cunstruct_transaction_error",
              description: e.message,
          };
      };

      const payAccount = new solanaWeb3.Account(this.secretKey);
      let result = await this.connection.sendTransaction(
          transaction,
          [payAccount]
      );
      console.log("result !", result);

      return result;

  };

  async stake(address, amount_sol) {
        // check balance and amount
        const transaction = new solanaWeb3.Transaction();

        try {
            const rent       = this.rent;
            const fromPubkey = this.publicKey;
            const authorized = new solanaWeb3.Authorized(fromPubkey, fromPubkey);
            const lamportsBN = new BN(amount_sol).add(rent);
            const seed       = await this.getNextSeed();
            const votePubkey = new solanaWeb3.PublicKey(address);

            const stakePubkey = await solanaWeb3.PublicKey.createWithSeed(
                fromPubkey,
                seed,
                solanaWeb3.StakeProgram.programId,
            );

            const lockup = new solanaWeb3.Lockup(0,0, fromPubkey);

            const config = {
                authorized,
                basePubkey: fromPubkey,
                fromPubkey,
                lamports: lamportsBN.toString(),
                lockup,
                seed,
                stakePubkey,
            };

            transaction.add(solanaWeb3.StakeProgram.createAccountWithSeed(config));
            transaction.add(solanaWeb3.StakeProgram.delegate({
                authorizedPubkey: fromPubkey,
                stakePubkey,
                votePubkey,
            }));
        } catch(e) {
            return {
                error: "prepare_transaction_error",
                description: e.message,
            };
        };

        const result = await this.sendTransaction(transaction);
        this.reloadWithRetry();
        return result;
  }


  getSwapAmountByStakeAmount(amountStr) {
    const amount = new BN(amountStr * 1e9 + '', 10);
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

    if (this.vlxNativeBalance.add(this.vlxEvmBalance).lte(amount.add(PRESERVE_BALANCE))) {
      return this.vlxEvmBalance;
    }

    return amount.add(PRESERVE_BALANCE).sub(this.vlxNativeBalance);
  }

  async splitStakeAccount(stakeAccount, lamports){
    if (typeof lamports === 'string') {
      lamports = new BN(lamports, 10);
    }
    let transaction   = null;
    const authorizedPubkey = this.publicKey;
    const stakePubkey = new solanaWeb3.PublicKey(stakeAccount.address);
    const rent        = this.rent;
    const seed        = await this.getNextSeed();
    const splitStakePubkey = await solanaWeb3.PublicKey.createWithSeed(
      authorizedPubkey,
      seed,
      solanaWeb3.StakeProgram.programId,
    );

    console.log('splitStakePubkey', splitStakePubkey);
    const params      = {
      stakePubkey,
      authorizedPubkey,
      splitStakePubkey,
      lamports: lamports.add(rent),
      seed,
      base: authorizedPubkey,
    };

    try {
      transaction = solanaWeb3.StakeProgram.split(params);
    } catch (e) {
      return {
        error: "split_stake_account_error",
        description: e.message,
      };
    }
    return await this.sendTransaction(transaction);
  }

  async undelegate(stakePubkey) {

      const transaction = new solanaWeb3.Transaction();

      try {
          const authorizedPubkey = this.publicKey;

          transaction.add(solanaWeb3.StakeProgram.deactivate({
              authorizedPubkey,
              stakePubkey,
          }));
      } catch(e) {
          return {
              error: "prepare_transaction_error",
              description: e.message,
          };
      };

      return await this.sendTransaction(transaction);
  };

  async requestWithdraw(address, amount) {
    const sortedAccounts = (
      this.accounts
        .filter(a => a.isActivated)
        .sort((a, b) => b.myStake.cmp(a.myStake))
    );
    const totalStake = new BN(0);
    if (typeof amount === 'string') {
      amount = new BN(amount, 10);
    }
    for (let i = 0; i < sortedAccounts.length; i++) {
      totalStake = totalStake.add(sortedAccounts[i].myStake);
    }
    if (totalStake.lt(amount)) {
      throw new Error('Too much amount');
    }
    while (!amount.isZero() && !amount.isNeg()) {
      const account = sortedAccounts.pop();
      if (amount.gte(account.myStake)) {
        await this.undelegate(account.publicKey);
        amount = amount.sub(account.myStake);
      } else {
        await this.splitStakeAccount(account, account.myStake.sub(amount));
        await this.undelegate(account.publicKey);
        break;
      }
    }
  }

  async withdrawRequested(address) {

  }
}


export { StakingStore };
