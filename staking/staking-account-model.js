import BN from "bn.js";
import { when, decorate, observable } from "mobx";
import { RewardModel } from "./reward-model";
import { cachedCallWithRetries } from './utils';

class StakingAccountModel {
  parsedAccoount = null;
  myStake = null;
  isActivated = null;
  connection = null;
  rewards = null;
  rewardsStatus = 'NotLoaded';
  isActivationRequested = false;
  _activeStake = null;
  _inactiveStake = null;
  _state = null;
  latestReward = undefined;

  get address() {
    return this.parsedAccoount.pubkey.toBase58();
  }

  get publicKey() {
    return this.parsedAccoount.pubkey;
  }

  get validatorAddress() {
    const { account } = this.parsedAccoount;
    if (!account.data.parsed.info.stake) {
      return null;
    }
    const { voter } = account.data.parsed.info.stake.delegation;
    return voter;
  }

  get activeStake() {
    this.requestActivation();
    return this._activeStake;
  }

  get inactiveStake() {
    this.requestActivation();
    return this._inactiveStake;
  }

  get state() {
    this.requestActivation();
    return this._state;
  }

  get isRewardsLoading() {
    switch (this.rewardsStatus) {
      case "NotLoaded":
        return true;
      case "1Loaded":
        return false;
      case "LoadingMore":
        return true;
      case "LoadedAll":
        return false;
    }
    console.error('Invalid rewardsStatus', this.rewardsStatus);
    return false;
  }

  async requestActivation() {
    if (this.isActivationRequested) {
      return;
    }
    this.isActivationRequested = true;

    const activationRes = await cachedCallWithRetries(
      ['getStakeActivation', this.connection, this.parsedAccoount.pubkey.toString()],
      async () => {
        try {
          return await this.connection.getStakeActivation(this.parsedAccoount.pubkey);
        } catch(e) {
          if (!e.message || !e.message.includes('failed to get Stake Activation')) {
            throw e;
          }
          console.warn(e);
          return null;
        }
      }
    );
    if (!activationRes) {
      console.warn('Invalid activation response');
      this._activeStake = new BN(0);
      this._inactiveStake = new BN(0);
      this._state = 'inactive';
      return;
    }
    const { active, inactive, state } = activationRes;
    this._activeStake = new BN(active + '', 10);
    this._inactiveStake = new BN(inactive + '', 10);
    this._state = state;
  }

  async loadMoreRewards() {
    switch (this.rewardsStatus) {
      case "NotLoaded":
        await when(() => this.rewardsStatus === '1Loaded');
        if (this.rewardsStatus !== '1Loaded') {
          return;
        }
        break;
      case "1Loaded":
        break;
      case "LoadingMore":
        return;
      case "LoadedAll":
        return;
    }
    this.rewards = [];
    this.rewardsStatus = "LoadingMore";
    for (let i = 0; i < 10; i++) {
      const {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = await this.getEpochSchedule();
      const epoch = await this.getLastEpoch();
      const firstSlotInEpoch = (epoch - i - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
      const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
      const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
      const address = this.address;
      const rewards = (
        blockResult.rewards
          .filter(r => r.pubkey === address)
          .map(reward => new RewardModel(reward, epoch - i - 1, this.connection))
      );
      if (rewards.length === 0) {
        break;
      }
      this.rewards = this.rewards.concat(rewards);
      // for (let reward of rewards) {
      //   this.rewards.push(reward);
      // }
    }
    this.rewardsStatus = "LoadedAll";
  }

  constructor(parsedAccoount, connection) {
    this.parsedAccoount = parsedAccoount;
    this.connection = connection;
    const { account } = parsedAccoount;
    const { lamports } = account;
    if (account.data.parsed.info.stake) {
      const { deactivationEpoch } = account.data.parsed.info.stake.delegation;
      this.isActivated = deactivationEpoch === '18446744073709551615';
    } else {
      this.isActivated = false;
    }
    // console.log(this.parsedAccoount.pubkey.toBase58())
    this.myStake = new BN(lamports+'', 10);
    this.loadRewards();

    decorate(this, {
      rewardsStatus: observable,
      rewards: observable,
      _activeStake: observable,
      _inactiveStake: observable,
      _state: observable,
      latestReward: observable
    });
  }
  // fetchEpochRewards = (address, activationEpoch, cb)->
  //     return cb null, [] if (not store.staking.chosenAccount.validator? or store.staking.chosenAccount.validator.toString!.length is 0)
  //     err, epochSchedule <- as-callback(web3t.velas.NativeStaking.getEpochSchedule!)
  //     console.error err if err?
  //     {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = epochSchedule
  //     err, slot <- as-callback(web3t.velas.NativeStaking.getSlot!)
  //     console.error err if err?
  //     err, firstAvailableBlock <- as-callback(web3t.velas.NativeStaking.getFirstAvailableBlock!)
  //     console.error err if err?
  //     err, epochInfo <- as-callback web3t.velas.NativeStaking.getCurrentEpochInfo()
  //     console.error err if err?
  //     return cb null if err?
  //     { epoch } = epochInfo
  //     # make loop here!
  //     err, rewards <- query-rewards-loop(address, activationEpoch, firstNormalSlot, slotsPerEpoch, firstAvailableBlock, firstNormalEpoch, epoch)
  //     cb null, rewards

  async getEpochSchedule() {
    return await cachedCallWithRetries(
      ['getEpochSchedule', this.connection],
      () => this.connection.getEpochSchedule(),
    );
  }

  async getEpochInfo() {
    return await cachedCallWithRetries(
      ['getEpochInfo', this.connection],
      () => this.connection.getEpochInfo(),
    );
  }

  async getConfirmedBlocksWithLimit(firstSlotInEpoch) {
    return await cachedCallWithRetries(
      ['getConfirmedBlocksWithLimit', this.connection, firstSlotInEpoch, 1],
      () => this.connection.getConfirmedBlocksWithLimit(firstSlotInEpoch, 1),
    );
  }

  async getConfirmedBlock(blockNumber) {
    return await cachedCallWithRetries(
      ['getConfirmedBlock', this.connection, blockNumber],
      () => this.connection.getConfirmedBlock(blockNumber, 1),
    );
  }

  async loadRewards() {
    try {
      // if (this.myStake.lt(new BN('1200000000', 10))) {
      //   this.rewards = [];
      //   return;
      // }
      const { account } = this.parsedAccoount;
      if (!account.data.parsed.info.stake) {
        this.latestReward = null;
        return;
      }

      // const { activationEpoch } = account.data.parsed.info.stake.delegation;
      const {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = await this.getEpochSchedule();
      const { epoch } = await this.getEpochInfo();
      const firstSlotInEpoch = (epoch - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
      const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
      const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
      const address = this.address;
      this.latestReward = (
        blockResult.rewards
          .filter(r => r.pubkey === address)
          .slice(0, 1)
          .map(reward => new RewardModel(reward, epoch - 1, this.connection))
      )[0] || null;
      this.rewardsStatus = '1Loaded';
    } catch(e) {
      console.error(e);
    }
  }

  async getLastEpoch() {
    const info = await this.getEpochInfo();
    const { epoch } = info;

    if (this.isActivated) {
      return epoch;
    }
    const { account } = this.parsedAccoount;
    const { deactivationEpoch } = account.data.parsed.info.stake.delegation;
    return Math.min(parseInt(deactivationEpoch) + 1, epoch);
  }
}
export { StakingAccountModel };
