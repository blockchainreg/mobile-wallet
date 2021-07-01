import { decorate, observable } from 'mobx';
import { cachedCallWithRetries } from './utils';
import { RewardModel } from "./reward-model";
const solanaWeb3 = require('./index.cjs.js');

class RewardsStore {
  connection = null;
  latestRewardsPerValidator = null;

  constructor() {
    decorate(this, {
      isLatestRewardsLoading: observable
    });
  }

  setConnection(connection) {
    this.connection = connection;
    this.loadLatestRewards();
  }

  getLatestRewardsOfVaildator(address) {
    if (this.isLatestRewardsLoading || !this.latestRewardsPerValidator) {
      return null;
    }
    return this.latestRewardsPerValidator.get(address) || [];
  }

  async loadLatestRewards() {
    if (this.isLatestRewardsLoading) {
      return;
    }
    this.isLatestRewardsLoading = true;
    const accounts = await this.getAccounts();
    const accountMap = new Map();
    debugger;
    for (let account of accounts) {
      accountMap.set(account.pubkey.toBase58(), account);
    }
    const { firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset,
      slotsPerEpoch, warmup } = await this.getEpochSchedule();
    const { epoch } = await this.getEpochInfo();
    const firstSlotInEpoch = (epoch - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
    const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
    const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
    this.latestRewardsPerValidator = new observable.map();
    debugger;
    for (let reward of blockResult.rewards) {
      let account = accountMap.get(reward.pubkey);
      if (!account) continue;
      const { voter } = account.account.data.parsed.info.stake.delegation;
      if (this.latestRewardsPerValidator.has(voter)) {
        continue;
      }
      this.latestRewardsPerValidator.set(voter, [new RewardModel(reward, epoch - 1, this.connection)]);
    }
    this.isLatestRewardsLoading = false;
  }

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
    if (!firstSlotInEpoch) {
      debugger;
    }
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

  async getAccounts() {
    return await cachedCallWithRetries(
      ['getParsedProgramAccounts', this.connection, solanaWeb3.StakeProgram.programId.toString()],
      () => this.connection.getParsedProgramAccounts(
          solanaWeb3.StakeProgram.programId
        )
    );
  }
}

export const rewardsStore = new RewardsStore();
