// Generated by LiveScript 1.5.0
(function () {
  var ref$,
    times,
    lang,
    minus,
    plus,
    div,
    toJS,
    transaction,
    calcFee,
    find,
    round5,
    calcCryptoGeneric,
    calcCryptoFromUsd,
    calcCryptoFromEur,
    calcFiat,
    calcUsd,
    calcEur,
    calcFeeProxy,
    changeAmountGeneric,
    changeAmount,
    changeAmountInvoice,
    out$ = (typeof exports != 'undefined' && exports) || this;
  (ref$ = require('./math.js')),
    (times = ref$.times),
    (minus = ref$.minus),
    (plus = ref$.plus),
    (div = ref$.div);
  (ref$ = require('mobx')),
    (toJS = ref$.toJS),
    (transaction = ref$.transaction);
  calcFee = require('./api.js').calcFee;
  find = require('prelude-ls').find;
  round5 = require('./round5.js');
  getLang = require('./get-lang.js');
  var contractData = require('./contract-data.js');
  calcCryptoGeneric = function (name) {
    return function (store, val) {
      var send, wallet, token, rate, ref$;
      if (val == null) {
        return '0';
      }
      send = store.current.send;
      wallet = send.wallet;
      token = send.coin.token;
      rate = (ref$ = wallet != null ? wallet[name] : void 8) != null ? ref$ : 0;
      return round5(div(val, rate));
    };
  };
  out$.calcCryptoFromUsd = calcCryptoFromUsd = calcCryptoGeneric('usdRate');
  out$.calcCryptoFromEur = calcCryptoFromEur = calcCryptoGeneric('eurRate');
  calcFiat = function (name) {
    return function (store, amountSend) {
      var send, wallet, token, rate, ref$;
      if (amountSend == null) {
        return '0';
      }
      send = store.current.send;
      wallet = send.wallet;
      token = send.coin.token;
      rate = (ref$ = wallet != null ? wallet[name] : void 8) != null ? ref$ : 0;
      return times(amountSend, rate);
    };
  };
  out$.calcUsd = calcUsd = calcFiat('usdRate');
  out$.calcEur = calcEur = calcFiat('eurRate');

  calcFeeProxy = function (arg$, cb) {
    var fun;
    var store,
      query,
      fast,
      token,
      to,
      data,
      network,
      amount,
      feeType,
      txType,
      account,
      swap,
      send,
      calcFeeFun;
    (store = arg$.store), (query = arg$.query), (fast = arg$.fast);
    (store = arg$.store),
      (token = arg$.token),
      (network = arg$.network),
      (amount = arg$.amount),
      (feeType = arg$.feeType),
      (txType = arg$.txType),
      (account = arg$.account);
    to = arg$.to;
    if (store == null) {
      return cb('store isn`t defined');
    }
    if (network == null) {
      return cb('network isn`t defined');
    }
    if (amount == null) {
      return cb('amount isn`t defined');
    }
    if (account == null) {
      return cb('account isn`t defined');
    }
    var send = store.current.send;
    var gasPrice = null;
    console.log('to', to);

    switch (send.gasPriceType) {
      case 'custom':
        gasPrice = times(send.gasPriceCustomAmount, Math.pow(10, 9));
        break;
      default:
        gasPrice = send.gasPriceAuto;
        break;
    }

    return calcFee(
      {
        store: store,
        token: token,
        to: to,
        data: send.data,
        network: network,
        amount: amount,
        feeType: feeType,
        txType: txType,
        account: account,
        gasPrice: gasPrice,
      },
      (err, result) => {
        console.log({ err, result });
        send.feeCalculating = false;
        if (err !== null) {
          send.error = (err.message || err).toString();
          return cb(err);
        }
        return cb(null, result);
      }
    );
  };

  changeAmountGeneric = function (field) {
    return function (store, amountSend, skipUpdateFiat, cb) {
      var send,
        wallet,
        token,
        wallets,
        feeToken,
        ref$,
        feeWallet,
        resultAmountSend,
        feeType,
        txType,
        usdRate,
        feeUsdRate,
        account,
        gasPrice,
        gasEstimate,
        calcedFee;
      send = store.current[field];
      wallet = send.wallet;
      token = send.coin.token;
      wallets = store.current.account.wallets;
      feeToken =
        (ref$ = wallet.network.txFeeIn) != null
          ? ref$
          : (ref$ = send.coin.token) != null
          ? ref$
          : 'unknown';
      feeWallet = find(function (it) {
        var ref$;
        return ((ref$ = it.coin) != null ? ref$.token : void 8) === feeToken;
      })(wallets);
      if (wallet == null) {
        return (send.error = 'Balance is not loaded');
      }
      lang = getLang(store);

      /*
       * Restrict amount of decimals input more than specified in coin config.
       * */
      var decimalsConfig = send.network.decimals;
      if (amountSend) {
        var decimals = amountSend.toString().split('.')[1];
        if (decimals) {
          if (decimals.length > decimalsConfig) {
            return false;
          }
        }
      }
      send.amountChanging = true;
      resultAmountSend = amountSend != null ? amountSend : 0;
      (ref$ = store.current.send),
        (feeType = ref$.feeType),
        (txType = ref$.txType);
      usdRate =
        (ref$ = wallet != null ? wallet.usdRate : void 8) != null ? ref$ : 0;
      feeUsdRate =
        (ref$ = feeWallet != null ? feeWallet.usdRate : void 8) != null
          ? ref$
          : 0;
      account = {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
      send.amountSend = amountSend != null ? amountSend : '';
      send.amountSend = amountSend != null ? amountSend : '';
      send.value = times(resultAmountSend, Math.pow(10, send.network.decimals));
      send.amountObtain = resultAmountSend;
      send.amountObtainUsd = times(send.amountObtain, usdRate);

      var dataBuilder = contractData({ store });
      dataBuilder.formContractData((err, res) => {
        var sendTo = send.to;
        if (send.isSwap) {
          /* Add extra check in case it`s legacy-->evm swap where contractAddress == null */
          sendTo = send.contractAddress ? send.contractAddress : send.to;
        } else if (send.to.trim().length === 0) {
          sendTo = send.wallet.address;
        }
        if (!sendTo) {
          //          send.error = "sendTo cannot be null"
          //          return;
        }

        if (!skipUpdateFiat) {
          send.amountSendUsd = calcUsd(store, amountSend);
          send.amountSendEur = calcEur(store, amountSend);
        }
        return calcFeeProxy(
          {
            token: token,
            network: send.network,
            amount: resultAmountSend,
            to: sendTo,
            feeType: feeType,
            txType: txType,
            account: account,
            store: store,
            data: send.data,
            gasPrice: send.gasPrice,
          },
          function (err, result) {
            var ref$, txFee;
            if (err != null) {
              send.error =
                'Calc Fee Error: ' +
                ((ref$ = err.message) != null ? ref$ : err);
              return (send.amountSendFee = 0);
            }
            if (result != null) {
              calcedFee = result.calcedFee;
              gasPrice = result.gasPrice;
              gasEstimate = result.gasEstimate;
              if (send.gasPriceType !== 'custom') {
                send.gasPriceAuto = gasPrice;
              }
            }
            send.gasEstimate = gasEstimate;
            txFee = (function () {
              var ref$, ref1$;
              switch (false) {
                case feeType !== 'custom':
                  return send.amountSendFee;
                case (result != null ? result.calcedFee : void 8) == null:
                  return result.calcedFee;
                case ((ref$ = send.network) != null
                  ? ref$.txFeeOptions
                  : void 8) == null:
                  return (ref1$ = send.network.txFeeOptions[feeType]) != null
                    ? ref1$
                    : send.network.txFee;
                default:
                  return send.network.txFee;
              }
            })();
            send.amountSendFee = txFee;
            send.amountCharged = (function () {
              switch (false) {
                case wallet.network.txFeeIn == null:
                  return send.amountSend;
                case (resultAmountSend != null ? resultAmountSend : '')
                  .length !== 0:
                  return txFee;
                case resultAmountSend !== '0':
                  return txFee;
                case resultAmountSend !== 0:
                  return txFee;
                case feeToken === token:
                  return resultAmountSend;
                default:
                  return plus(resultAmountSend, txFee);
              }
            })();
            send.amountChargedUsd = times(send.amountCharged, usdRate);
            send.amountSendFeeUsd = times(txFee, feeUsdRate);
            send.amountChanging = false;

            var amountToCharge = (function () {
              switch (false) {
                case feeToken !== token:
                  return minus(
                    minus(wallet.balance, resultAmountSend),
                    send.amountSendFee
                  );
                default:
                  return minus(wallet.balance, resultAmountSend);
              }
            })();

            send.error = (function () {
              switch (false) {
                case wallet.balance !== '...':
                  return 'Balance is not yet loaded';
                case !(parseFloat(amountToCharge) < 0):
                  return lang.insufficientFunds;
                default:
                  return '';
              }
            })();
            return cb(null);
          }
        );
      });
    };
  };
  out$.changeAmount = changeAmount = changeAmountGeneric('send');
  out$.changeAmountInvoice = changeAmountInvoice =
    changeAmountGeneric('invoice');
}.call(this));
