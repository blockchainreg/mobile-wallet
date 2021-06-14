import { decorate, observable, action } from "mobx";
import BN from "bn.js";
import { StakingAccountModel } from './staking-account-model.js';

class ValidatorModel {
  status = 'active';
  solanaValidator = null;
  stakingAccounts = [];

  get address() {
    return this.solanaValidator.votePubkey;
  }

  get lastBlock() {
    return this.solanaValidator.lastVote;
  }

  get activatedStake() {
    return this.solanaValidator.activatedStake;
  }

  get myStake() {
    let myStake = new BN(0);
    for (let i = 0; i < this.stakingAccounts.length; i++) {
      const account = this.stakingAccounts[i];
      myStake = myStake.add(account.myStake);
    }
    return myStake;
  }

  get apr() {
    let stake = new BN(0);
    let sum = new BN(0);

    for (let i = 0; i < this.stakingAccounts.length; i++) {
      const acc = this.stakingAccounts[i];
      if (!acc.apr || acc.apr.isZero()) {
        continue;
      }
      // stake = stake.add(acc.apr.mul(acc.));
    }
    return 12.2;
  }

  get totalStakers() {
    return 200;
  }

  get commission() {
    return this.solanaValidator.commission;
  }

  constructor(solanaValidator, isDelinquent) {
    if (!solanaValidator || !solanaValidator.votePubkey) {
      throw new Error('solanaValidator invalid');
    }
    if (typeof isDelinquent !== 'boolean') {
      throw new Error('isDelinquent bool required');
    }
    if (isDelinquent) {
      this.status = 'inactive';
    }
    this.solanaValidator = solanaValidator;
    decorate(this, {
      solanaValidator: observable,
      status: observable,
    });
  }

  updateValidator(solanaValidator, isDelinquent) {
    if (!solanaValidator || !solanaValidator.votePubkey) {
      throw new Error('solanaValidator invalid');
    }
    if (typeof isDelinquent !== 'boolean') {
      throw new Error('isDelinquent bool required');
    }
    this.solanaValidator = solanaValidator;
    if (isDelinquent) {
      this.status = 'inactive';
    } else {
      this.status = 'active';
    }
  }

  addStakingAccount(stakingAccount) {
    if (!stakingAccount || !(stakingAccount instanceof StakingAccountModel)) {
      throw new Error('stakingAccount invalid');
    }
    this.stakingAccounts.push(stakingAccount);
  }
}

export { ValidatorModel };
