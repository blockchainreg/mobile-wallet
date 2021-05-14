

export class Transaction {
  account;
  network;
  wallet;
  recipient;
  amount;
  coin;
  amountFee;
  feeType;
  txType;
  data;

  constructor(wallet, network, recipient, amount, coin, amountFee, feeType, txType, data) {
    this.wallet = wallet;
    this.network = network;
    this.recipient = recipient;
    this.amount = amount;
    this.amountFee = amountFee;
    this.feeType = feeType;
    this.txType = txType;
    this.coin = coin;
    this.data = data;
    this.account = {
      address: wallet.address,
      privateKey: wallet.privateKey
    }
  }

  get = (prop) => {
    if(this[prop] == null) {
      throw new Error(`Cannot get property ${prop} of Transaction object!`);
    }
    return this[prop];
  }

  set = (prop, value) => {
    if (this[prop] == null) {
      throw new Error(`Cannot set property ${prop} of Transaction object!`);
    }
    this[prop] = value;
  }

}