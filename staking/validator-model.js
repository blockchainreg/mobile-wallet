import { decorate, observable, action } from "mobx";
import BN from "bn.js";
import { StakingAccountModel } from './staking-account-model.js';
import { cachedCallWithRetries } from './utils';
import { rewardsStore } from './rewards-store';
const solanaWeb3 = require('./index.cjs.js');

class ValidatorModel {
  status = 'active';
  solanaValidator = null;
  stakingAccounts = [];
  totalStakers = null;

  get address() {
    return this.solanaValidator.votePubkey;
  }

  get lastBlock() {
    return this.solanaValidator.lastVote;
  }

  get activeStake() {
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
  
  loadApr() {
      setTimeout(()=>{
		  let rewards = rewardsStore.getLatestRewardsOfVaildator(this.address);
		  if (!rewards) { //Loading
			  return this.apr = null;
		  }
		  if (rewards.length === 0) {
			  return this.apr = 0;
		  }
		  this.apr = rewards[0].apr;	
	  },1);					      
  }

  get apr() {
  	return "..";
    // let rewards = rewardsStore.getLatestRewardsOfVaildator(this.address);
    // if (!rewards) { //Loading
    //   return null;
    // }
    // if (rewards.length === 0) {
    //   return 0;
    // }
    // return rewards[0].apr;
    // if (this.stakingAccounts.length === 0) {
    //
    // }
    // if (this.stakingAccounts.find(acc => acc.latestReward === undefined)) {
    //   return null;
    // }
    // const acc = this.stakingAccounts.find(acc => acc.latestReward !== null);
    // if (!acc) return 0;
    // return acc.latestReward.apr;
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
        if (!reward.amount) continue;
        if (!rewards.has(reward.epoch)) {
          rewards.set(reward.epoch, {
            epoch: reward.epoch,
            amount: reward.amount,
            apr: reward.apr || 0,
            postBalance: reward.solanaReward ? reward.solanaReward.postBalance: 0
          });
          continue;
        }
        const prev = rewards.get(reward.epoch);
        if (reward.apr && reward.solanaReward) {
          const postBalance = reward.solanaReward.postBalance + prev.postBalance;
          rewards.set(reward.epoch, {
            epoch: reward.epoch,
            amount: prev.amount.add(reward.amount),
            apr: (prev.apr * prev.postBalance + reward.apr * reward.solanaReward.postBalance) / postBalance,
            postBalance
          });
          continue;
        }
        if (prev) {
          rewards.set(reward.epoch, {
            epoch: reward.epoch,
            amount: prev.amount.add(reward.amount),
            apr: prev.apr,
            postBalance: prev.postBalance
          });
        }
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

  get totalActiveStake() {
    let total = new BN(0);

    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      if (acc.state !== 'activating' && acc.state !== 'active') {
        continue;
      }
      total = total.add(acc.activeStake);
    }
    return total;
  }

  get totalAvailableForWithdrawRequestStake() {
    let total = new BN(0);

    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      if (acc.state !== 'activating' && acc.state !== 'active') {
        continue;
      }
      total = total.add(acc.activeStake).add(acc.inactiveStake);
    }
    return total;
  }

  get totalInactiveStake() {
    let total = new BN(0);

    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      total = total.add(acc.inactiveStake);
    }
    return total;
  }

  get totalActivatingStake() {
    let total = new BN(0);

    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      if (acc.state !== 'activating') {
        continue;
      }
      if (!acc.activeStake) {
        return null;
      }
      total = total.add(acc.activeStake);
    }
    return total;
  }

  get totalDeactivatingStake() {
    let total = new BN(0);

    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      if (acc.state !== 'deactivating') {
        continue;
      }
      if (acc.activeStake === null) {
        return null;
      }
      total = total.add(acc.activeStake);
    }
    return total;
  }

  get totalWithdrawRequested() {
    let total = new BN(0);

    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      if (acc.state !== 'deactivating') {
        continue;
      }
      if (!acc.activeStake) {
        return null;
      }
      total = total.add(acc.activeStake);
    }
    return total;
  }

  get availableWithdrawRequested() {
    let totalInactive = new BN(0);
    for (let acc of this.stakingAccounts) {
      if (!acc.state) {
        return null;
      }
      if (acc.state !== 'inactive' && acc.state !== 'deactivating') {
        continue;
      }
      if (!acc.inactiveStake) {
        return null;
      }
      totalInactive = totalInactive.add(acc.inactiveStake);
    }
    return totalInactive;
  }

  loadMoreRewards() {
    return Promise.all(
      this.stakingAccounts.map(acc => acc.loadMoreRewards())
    );
  }

  constructor(solanaValidator, isDelinquent, connection) {
    if (!solanaValidator || !solanaValidator.votePubkey) {
      throw new Error('solanaValidator invalid');
    }
    if (typeof isDelinquent !== 'boolean') {
      throw new Error('isDelinquent bool required');
    }
    if (isDelinquent) {
      this.status = 'inactive';
    }
    this.connection = connection;
    this.solanaValidator = solanaValidator;
    decorate(this, {
      solanaValidator: observable,
      status: observable,
      totalStakers: observable,
	  apr: observable	
    });
    this.loadAccountStats();
    this.loadApr();
  }

  async loadAccountStats() {
    const nativeAccounts = await cachedCallWithRetries(
      ['getParsedProgramAccounts', this.connection, solanaWeb3.StakeProgram.programId.toString()],
      () => this.connection.getParsedProgramAccounts(
          solanaWeb3.StakeProgram.programId
        )
    );
    this.totalStakers = nativeAccounts.filter(({account}) =>{
      if (!account || !account.data.parsed.info || !account.data.parsed.info.stake) {
        return false;
      }
      const {voter} = account.data.parsed.info.stake.delegation;
      return voter === this.address;
    }).length;
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
