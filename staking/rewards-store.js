import {decorate, observable, runInAction} from 'mobx';
import { cachedCallWithRetries } from './utils';
import { RewardModel } from "./reward-model";
const solanaWeb3 = require('./index.cjs.js');

class RewardsStore {
  connection = null;
  network = null;
  isLatestRewardsLoading = null;

  constructor() {
    decorate(this, {
      isLatestRewardsLoading: observable, 
	    latestRewardsPerValidator: observable
    });
  }

  setConnection(connection, network) {
  	this.network = network;
    this.connection = connection;
    //this.loadLatestRewards();
  }
  
 
  setlatestRewardsPerValidator = (tmpMap, epoch, cb) => {
	  runInAction(() => {
			this.getEpochDuration(epoch - 1,  (epochDuration) => {
				tmpMap.forEach((value, key) => {
					let maxAmount = -1;
					let biggestReward = null;
					for (let reward of value) if (reward.lamports > maxAmount) {
						maxAmount = reward.lamports;
						biggestReward = reward;
					}
					 
					// Here we load calc apr for each RewardModel
					let rm = new RewardModel(biggestReward, epoch - 1, this.connection, this.network, epochDuration);
					this.latestRewardsPerValidator.set(key, [rm]);
				});
				cb();
			})
	  })
  }

  getLatestRewardsOfVaildator(address, cb) {
    if (!this.latestRewardsPerValidator) {
      return cb([]);
    }
    return cb(this.latestRewardsPerValidator.get(address) || []);
  }

  loadLatestRewards(cb) {
		runInAction(() => {
			if (this.isLatestRewardsLoading) {
				return;
			}
			this.isLatestRewardsLoading = true;
		 
			this.getAccounts().then( accounts => {
				const accountMap = new Map();
				for (let account of accounts) {
					accountMap.set(account.pubkey.toBase58(), account);
				}
				this.getEpochSchedule().then(res => {
					let firstNormalEpoch = res.firstNormalEpoch;
					let firstNormalSlot = res.firstNormalSlot
					let leaderScheduleSlotOffset = res.leaderScheduleSlotOffset
					let slotsPerEpoch = res.slotsPerEpoch
					let warmup = res.warmup
				
					this.getEpochInfo().then((resp) => {
						const epoch = resp.epoch;
					
						const firstSlotInEpoch = (epoch - firstNormalEpoch) * slotsPerEpoch + firstNormalSlot;
						this.getConfirmedBlocksWithLimit(firstSlotInEpoch).then( blockNumberResult => {
							
							this.getConfirmedBlock(blockNumberResult.result[0]).then( blockResult => {
								this.latestRewardsPerValidator = new observable.map();
								const tmpMap = new Map();
								for (let reward of blockResult.rewards) {
									let account = accountMap.get(reward.pubkey);
									if (!account || !account.account.data.parsed.info || !account.account.data.parsed.info.stake) continue;
									const { voter } = account.account.data.parsed.info.stake.delegation;
									if (!tmpMap.has(voter)) {
										tmpMap.set(voter, []);
										continue;
									}
									tmpMap.get(voter).push(reward);
								}
								this.setlatestRewardsPerValidator(tmpMap, epoch,  () => {
									this.isLatestRewardsLoading = false;
									cb();	
								});
							})
							.catch(err => {
								console.warn("[getConfirmedBlock] error", err);
							})
						})
						.catch(err => {
							console.warn("[getConfirmedBlocksWithLimit] error", err);
						})
					})
					.catch(err => {
						console.warn("[getEpochInfo] error", err);
					})
				})
				.catch(err => {
					console.warn("[getEpochSchedule] error", err);
				});	
			})
			.catch(err => {
				console.warn("[getAccounts] error", err);
			});
		});
  }

  async getEpochSchedule() {
    return await cachedCallWithRetries(
	  this.network,
      ['getEpochSchedule', this.connection],
      () => this.connection.getEpochSchedule(),
    );
  }

  async getEpochInfo() {
    return await cachedCallWithRetries(
		this.network,
      ['getEpochInfo', this.connection],
      () => this.connection.getEpochInfo(),
    );
  }

  async getConfirmedBlocksWithLimit(firstSlotInEpoch) {
    return await cachedCallWithRetries(
		this.network,
      ['getConfirmedBlocksWithLimit', this.connection, firstSlotInEpoch, 1],
      () => this.connection.getConfirmedBlocksWithLimit(firstSlotInEpoch, 1),
    );
  }

  async getConfirmedBlock(blockNumber) {
    return await cachedCallWithRetries(
		this.network,
      ['getConfirmedBlock', this.connection, blockNumber],
      () => this.connection.getConfirmedBlock(blockNumber, 1),
    );
  }

  async getAccounts() {
    return await cachedCallWithRetries(
		this.network,
      ['getParsedProgramAccounts', this.connection, solanaWeb3.StakeProgram.programId.toString()],
      () => this.connection.getParsedProgramAccounts(
          solanaWeb3.StakeProgram.programId
        )
    );
  }
	
	getEpochTimeTs(epoch, cb) {
		this.getEpochSchedule().then( result => {
			const firstSlotInEpoch = (epoch - result.firstNormalEpoch) * result.slotsPerEpoch + result.firstNormalSlot;
			this.getConfirmedBlocksWithLimit(firstSlotInEpoch).then( blockNumberResult => {
				if (!blockNumberResult.result || blockNumberResult.result.length === 0) {
					return cb(0);
				}
				this.getConfirmedBlock(blockNumberResult.result[0]).then( blockResult => {
					if ( !blockResult ) return cb(0);
					if ( !blockResult.blockTime ){  
						console.error( "[getConfirmedBlock] blocktime is not defined" );
						return cb(0);
					}
						
					return cb(blockResult.blockTime);
				}).catch(err => console.error("[getConfirmedBlock Error]", err));
			}).catch(err => console.error("[getConfirmedBlocksWithLimit Error]", err));
		}).catch(err => console.error("[getEpochSchedule Error]", err))
	}
	
	getEpochDuration(epoch, cb){
		this.getEpochTimeTs(epoch + 1, (epochEndTime) => {
			this.getEpochTimeTs(epoch, (epochStartTime) => {
				const epochDuration = epochEndTime - epochStartTime;
				cb(epochDuration);
			})
		})
	}
}

export const rewardsStore = new RewardsStore();
