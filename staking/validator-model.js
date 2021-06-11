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
    return solanaValidator.activatedStake;
  }

  get myStake() {
    let myStake = new BN(0);
    for (let i = 0; i < this.stakingAccounts.length; i++) {
      const account = this.stakingAccounts[i];
      myStake = myStake.add(account.myStake);
    }
    return myStake;
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
  }

  updateValidator(solanaValidator) {
    this.solanaValidator = solanaValidator;
  }

  addStakingAccount(stakingAccount) {
    if (!stakingAccount || !(stakingAccount instanceof StakingAccountModel)) {
      throw new Error('stakingAccount invalid');
    }
    this.stakingAccounts.push(stakingAccount);
  }
}

export { ValidatorModel };
