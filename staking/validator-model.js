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
    return new BN(this.solanaValidator.activatedStake+'', 10);
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
    const rewards = this.rewards;
    if (!rewards || !rewards.length) {
      return null;
    }
    return rewards[0].apr;
  }

  get totalStakers() {
    return 200;
  }

  get commission() {
    return this.solanaValidator.commission;
  }

  get rewards() {
    let rewards = new Map();
    for (let acc of this.stakingAccounts) {
      if (acc.rewards === null) {
        return null;
      }
      for (const reward of acc.rewards) {
        if (!rewards.has(reward.epoch)) {
          rewards.set(reward.epoch, {
            epoch: reward.epoch,
            amount: reward.amount,
            apr: reward.apr || 0,
            postBalance: reward.apr ? reward.solanaReward.postBalance: 0
          });
          continue;
        }
        const prev = rewards.get(reward.epoch);
        if (reward.apr) {
          const postBalance = reward.solanaReward.postBalance + prev.postBalance;
          rewards.set(reward.epoch, {
            epoch: reward.epoch,
            amount: prev.amount.add(reward.amount),
            apr: (prev.apr * prev.postBalance + reward.apr * reward.solanaReward.postBalance) / postBalance,
            postBalance
          });
          continue;
        }
        rewards.set(reward.epoch, {
          epoch: reward.epoch,
          amount: prev.amount.add(reward.amount),
          apr: prev.apr,
          postBalance: prev.postBalance
        });
      }
    }
    return Array.from(rewards.values()).sort((a, b) => b.epoch - a.epoch);
  }

  get isRewardsLoading() {
    for (let acc of this.stakingAccounts) {
      if (acc.isRewardsLoading) {
        return true;
      }
    }
    return false;
  }

  loadMoreRewards() {
    return Promise.all(
      this.stakingAccounts.map(acc => acc.loadMoreRewards())
    );
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
    // console.log(solanaValidator);
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
