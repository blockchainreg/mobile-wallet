import mobx from "mobx";
import BN from "bn.js";
import solanaWeb3 from '@velas/solana-web3';
import bs58 from 'bs58';
import { ValidatorModel } from './validator-model.js';
import { StakingAccountModel } from './staking-account-model.js';

const SOL = new BN('1000000000', 10);
const PRESERVE_BALANCE = new BN('1000000000', 10);
const { decorate, observable, action } = mobx;


class StakingStore {
  validators = null;
  accounts = null;
  vlxEvmBalance = null;
  vlxNativeBalance = null;
  isRefreshing = false;
  rent = null;
  seedUsed = Object.create(null);

  constructor(API_HOST, secretKey, publicKey) {
    this.secretKey = secretKey;
    this.publicKeyBuffer = bs58.decode(publicKey);
    this.publicKey58 = publicKey;
    this.publicKey = new solanaWeb3.PublicKey(publicKey);
    this.connection = new solanaWeb3.Connection(API_HOST, 'singleGossip');

    decorate(this, {
      validators: observable,
      vlxEvmBalance: observable,
      vlxNativeBalance: observable,
      isRefreshing: observable,
      accounts: observable,
    });

    this.reloadWithRetry();
  }

  async reloadWithRetry() {
    let tries = 0;
    this.isRefreshing = true;
    while(true) {
      try {
        await this.reload();
        break;
      } catch(e) {
        tries++;
        console.error(e);
        await new Promise(resolve => setTimeout(resolve, 1000*tries));
      }
    }
  }

  async reload() {
    const { current, delinquent } = await this.connection.getVoteAccounts();
    const stakingAccounts = (await this.connection.getParsedProgramAccounts(solanaWeb3.StakeProgram.programId, {
      filters:
        [{memcmp: {
          offset: 0xc,
          bytes: this.publicKey58,
        }}]
    })).map(account => new StakingAccountModel(account));
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
    this.isRefreshing = false;
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

  getValidatorDetails(validatorAddress) {
    if (typeof address !== 'string') {
      throw new Error('Address string expected');
    }
    return this.validators.find(({address}) => address === validatorAddress);
  }

  getBalance() {
    return {
      vlxEvmBalance, vlxNativeBalance,
    };
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
        if (result && !result.error) {
          //TODO: add account
        }
        this.reloadWithRetry();
        return result;
  }

  getSwapAmountByStakeAmount(amount) {
    if (!this.vlxNativeBalance) {
      return null;
    }
    if (this.vlxNativeBalance.gte(amount.plus(PRESERVE_BALANCE))) {
      return new BN('0', 10);
    }
    if (!this.vlxEvmBalance) {
      return null;
    }
    if (this.vlxNativeBalance.plus(this.vlxEvmBalance).lt(amount)) {
      return null;
    }

    if (this.vlxNativeBalance.plus(this.vlxEvmBalance).lte(amount.plus(PRESERVE_BALANCE))) {
      return this.vlxEvmBalance;
    }

    return amount.plus(PRESERVE_BALANCE).sub(this.vlxNativeBalance);
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

  async undelegate(account) {

      const transaction = new Transaction();

      try {
          const authorizedPubkey = this.getAccountPublicKey();
          const stakePubkey      = new PublicKey(account);

          transaction.add(StakeProgram.deactivate({
              authorizedPubkey,
              stakePubkey,
          }));
      } catch(e) {
          return {
              error: "prepare_transaction_error",
              description: e.message,
          };
      };

      return this.sendTransaction(transaction);
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
      const currAmount = BN.min(amount, account.myStake);
      amount = amount.sub(currAmount);

    }
  }

  async withdrawRequested(address) {

  }
}


export { StakingStore };
