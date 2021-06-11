import BN from "bn.js";

class StakingAccountModel {
  parsedAccoount = null;
  myStake = null;
  isActivated = null;

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

  constructor(parsedAccoount) {
    this.parsedAccoount = parsedAccoount;
    const { account } = parsedAccoount;
    const { lamports } = account;
    if (account.data.parsed.info.stake) {
      const { deactivationEpoch } = account.data.parsed.info.stake.delegation;
      this.isActivated = deactivationEpoch === '18446744073709551615';
    } else {
      this.isActivated = false;
    }
    console.log(this.parsedAccoount.pubkey.toBase58())
    this.myStake = new BN(lamports+'', 10);
  }
}
export { StakingAccountModel };
