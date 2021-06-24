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

  get apr() {
    return 10.2;
  }

  get activatedStake() {
    return 10.2;
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
    if (this.rewards.length === 0) {
      this.rewardsStatus = "LoadedAll";
      return;
    }
    this.rewardsStatus = "LoadingMore";
    for (let i = 1; i < 10; i++) {
      const {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = await this.getEpochSchedule();
      const info = await this.getEpochInfo();
      const { epoch, blockHeight, slotIndex, slotsInEpoch, transactionCount } = info;
      const firstSlotInEpoch = (epoch - i - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
      const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
      const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
      const address = this.address;
      const rewards = (
        blockResult.rewards
          .filter(r => r.pubkey === address)
          .map(reward => new RewardModel(reward, epoch ))
      );
      if (rewards.length === 0) {
        break;
      }
      for (let reward of rewards) {
        this.rewards.push(reward);
      }
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
      // loadMoreRewards: observable
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
  //     { epoch, blockHeight, slotIndex, slotsInEpoch, transactionCount } = epochInfo
  //     # make loop here!
  //     err, rewards <- query-rewards-loop(address, activationEpoch, firstNormalSlot, slotsPerEpoch, slotsInEpoch, firstAvailableBlock, firstNormalEpoch, epoch)
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
      if (this.myStake.lt(new BN('1200000000', 10))) {
        this.rewards = [];
        return;
      }
      const { account } = this.parsedAccoount;
      if (!account.data.parsed.info.stake) {
        this.rewards = [];
        return;
      }

      // const { activationEpoch } = account.data.parsed.info.stake.delegation;
      const {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = await this.getEpochSchedule();
      const info = await this.getEpochInfo();
      const { epoch, blockHeight, slotIndex, slotsInEpoch, transactionCount } = info;
      const firstSlotInEpoch = (epoch - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
      const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
      const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
      const address = this.address;
      this.rewards = (
        blockResult.rewards
          .filter(r => r.pubkey === address)
          .map(reward => new RewardModel(reward, epoch ))
      );
      this.rewardsStatus = '1Loaded';
      if (this.rewards.length === 0) {
        return;
      }
      // debugger;
      // fetchEpochRewards(account.address, activationEpoch)
    } catch(e) {
      console.error(e);
    }
  }
}
export { StakingAccountModel };
