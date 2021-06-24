import BN from "bn.js";
import { cachedCallWithRetries } from './utils';

class RewardModel {
  solanaReward = null;
  epoch = null;

  get amount() {
    return new BN(this.solanaReward.lamports+'', 10);
  }

  get apr() {
    return 10.2;
  }
  
  constructor(solanaReward, epoch) {
    this.solanaReward = solanaReward;
    this.epoch = epoch;
  }

}
export { RewardModel };
