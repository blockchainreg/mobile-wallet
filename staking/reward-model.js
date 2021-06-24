import BN from "bn.js";
import { decorate, observable, action } from "mobx";
import { cachedCallWithRetries } from './utils';

class RewardModel {
  solanaReward = null;
  epoch = null;
  apr = null;

  get amount() {
    return new BN(this.solanaReward.lamports+'', 10);
  }

  async getEpochSchedule() {
    return await cachedCallWithRetries(
      ['getEpochSchedule', this.connection],
      () => this.connection.getEpochSchedule(),
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

  constructor(solanaReward, epoch, connection) {
    this.solanaReward = solanaReward;
    this.connection = connection;
    this.epoch = epoch;
    decorate(this, {
      apr: observable
    });
    this.loadApr();
  }

  async getEpochTimeTs(epoch) {
    const {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = await this.getEpochSchedule();
    const firstSlotInEpoch = (epoch - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
    const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
    const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
    return blockResult.blockTime;
  }

  async loadApr() {
    const epochDuration = (
      (await this.getEpochTimeTs(this.epoch + 1)) -
      (await this.getEpochTimeTs(this.epoch))
    );
    const balance = this.solanaReward.postBalance;
    const epochsPerYear = 365.25 * 24 * 3600 / epochDuration
    const amountPerPerEpoch = this.solanaReward.lamports / (this.solanaReward.postBalance - this.solanaReward.lamports);

    this.apr = amountPerPerEpoch * epochsPerYear;
  }
}
export { RewardModel };
