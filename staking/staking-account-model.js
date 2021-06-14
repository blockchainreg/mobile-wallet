import BN from "bn.js";
import { ManyKeysMap } from "./many-keys-map.js"

const cacheMap = new ManyKeysMap();

async function cachedCall(params, call) {
  if (!cacheMap.has(params)) {
    cacheMap.set(params, call());
  }
  return await cacheMap.get(params);
}

class StakingAccountModel {
  parsedAccoount = null;
  myStake = null;
  isActivated = null;
  connection = null;
  rewards = null;

  get address() {
    return this.parsedAccoount.pubkey.toBase58();
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
    return await cachedCall(
      ['getEpochSchedule', this.connection],
      () => this.connection.getEpochSchedule(),
    );
  }

  async getEpochInfo() {
    return await cachedCall(
      ['getEpochInfo', this.connection],
      () => this.connection.getEpochInfo(),
    );
  }

  async getConfirmedBlocksWithLimit(firstSlotInEpoch) {
    return await cachedCall(
      ['getConfirmedBlocksWithLimit', this.connection, firstSlotInEpoch, 1],
      () => this.connection.getConfirmedBlocksWithLimit(firstSlotInEpoch, 1),
    );
  }

  async getConfirmedBlock(blockNumber) {
    return await cachedCall(
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

      const { activationEpoch } = account.data.parsed.info.stake.delegation;
      const {firstNormalEpoch, firstNormalSlot, leaderScheduleSlotOffset, slotsPerEpoch, warmup} = await this.getEpochSchedule();
      const info = await this.getEpochInfo();
      const { epoch, blockHeight, slotIndex, slotsInEpoch, transactionCount } = info;
      const firstSlotInEpoch = (epoch - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot
      const blockNumberResult = await this.getConfirmedBlocksWithLimit(firstSlotInEpoch);
      const blockResult = await this.getConfirmedBlock(blockNumberResult.result[0]);
      const address = this.address;
      this.rewards = blockResult.rewards.filter(r => r.pubKey === address);
      if (this.rewards.length === 0) {
        return;
      }
      // fetchEpochRewards(account.address, activationEpoch)
    } catch(e) {
      console.error(e);
    }
  }
}
export { StakingAccountModel };
