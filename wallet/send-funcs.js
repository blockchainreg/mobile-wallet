// Generated by LiveScript 1.5.0
import Spinner from '../utils/spinner';
import { Transaction } from '../models/Transaction';
import bs58 from 'bs58';
import swapNativeToEvm from './Native-swap';
import roundHuman from '../wallet/round-human';
import { Text, View } from 'native-base';
import { Linking, ScrollView } from 'react-native';
import React from 'react';
import Images from '../Images.js';
import roundNumber from '../round-number';

(function () {
  var toJS,
    Alert,
    ref$,
    times,
    minus,
    div,
    createTransaction,
    pushTx,
    isValidAddress,
    changeAmount,
    calcCryptoFromEur,
    calcCryptoFromUsd,
    notifyFormResult,
    getNameMask,
    resolveAddress,
    window,
    navigate,
    close,
    round,
    round5,
    round5edit,
    topup,
    getPrimaryInfo,
    createPendingTx,
    rebuildHistory,
    map,
    getAddressLink,
    getAddressTitle,
    web3,
    calcFee,
    confirm,
    getLang,
    applyTransactions;
  toJS = require('mobx').toJS;
  Alert = require('react-native').Alert;
  (ref$ = require('./math.js')),
    (times = ref$.times),
    (minus = ref$.minus),
    (div = ref$.div);
  (ref$ = require('./api.js')),
    (createTransaction = ref$.createTransaction),
    (pushTx = ref$.pushTx),
    (isValidAddress = ref$.isValidAddress);
  (ref$ = require('./calc-amount.js')),
    (changeAmount = ref$.changeAmount),
    (calcCryptoFromEur = ref$.calcCryptoFromEur),
    (calcCryptoFromUsd = ref$.calcCryptoFromUsd);
  notifyFormResult = require('./send-form.js').notifyFormResult;
  getNameMask = require('./get-name-mask.js');
  resolveAddress = require('./resolve-address.js');
  window = require('./browser/window.js');
  navigate = require('./navigate.js');
  close = require('./close.js');
  round = require('./round.js');
  round5 = require('./round5.js');
  round5edit = require('./round5edit.js');
  topup = require('./topup.js');
  getPrimaryInfo = require('./get-primary-info.js');
  createPendingTx = require('./pending-tx.js').createPendingTx;
  rebuildHistory = require('./transactions.js').rebuildHistory;
  map = require('prelude-ls').map;
  (ref$ = require('./address-link.js')),
    (getAddressLink = ref$.getAddressLink),
    (getAddressTitle = ref$.getAddressTitle);
  web3 = require('./web3.js');
  calcFee = require('./api.js').calcFee;
  confirm = require('./pages/confirmation.js').confirm;
  const confirm2 = require('./pages/confirmation.js').confirm2;
  getLang = require('./get-lang.js');
  applyTransactions = require('./apply-transactions.js');
  var contracts = require('./contracts.js');

  const confirmrn = (store, message, yesButtonText, cb) =>
    Alert.alert(
      'Confirmation',
      message,
      [
        {
          text: 'Cancel',
          onPress: () => cb(false),
          style: 'cancel',
        },
        { text: yesButtonText, onPress: () => cb(true) },
      ],
      { cancelable: false }
    );
  module.exports = function (store, web3t) {
    var lang,
      sendTo,
      send,
      wallet,
      color,
      primaryButtonStyle,
      defaultButtonStyle,
      sendTx,
      performSendSafe,
      performSendUnsafe,
      checkEnough,
      checkRecipientAddress,
      sendMoney,
      sendEscrow,
      sendAnyway,
      sendTitle,
      cancel,
      recipientChange,
      getValue,
      amountChange,
      performAmountEurChange,
      performAmountUsdChange,
      amountEurChange,
      amountUsdChange,
      encodeDecode,
      showData,
      showLabel,
      whenEmpty,
      debug,
      history,
      network,
      invoice,
      token,
      feeToken,
      ref$,
      isData,
      chooseAuto,
      chooseCheap,
      chosenCheap,
      chosenAuto,
      sendOptions,
      pending,
      calcAmountAndFee,
      useMax,
      useMaxTryCatch,
      useMaxAmount;
    if (store == null || web3t == null) {
      console.log('no store or web3t');
      return null;
    }
    lang = getLang(store);
    sendTo = web3t.naming.sendTo;
    send = store.current.send;
    wallet = send.wallet;
    if (wallet == null) {
      console.log('no wallet');
      return null;
    }
    const txFeeIn =
      wallet != null
        ? (ref$ = wallet.network) != null
          ? ref$.txFeeIn
          : void 8
        : void 8;
    const fee = (function () {
      var ref$;
      switch (false) {
        case !(
          txFeeIn == null ||
          txFeeIn !==
            (wallet != null
              ? (ref$ = wallet.coin) != null
                ? ref$.token
                : void 8
              : void 8)
        ):
          return 0;
        default:
          return send.amountSendFee;
      }
    })();
    color = getPrimaryInfo(store).color;
    primaryButtonStyle = {
      background: color,
    };
    defaultButtonStyle = {
      color: color,
    };

    const executeContractData = function (cb) {
      var chosenNetwork, token, ref$, wallet;
      if (store.current.send.chosenNetwork == null) {
        return cb(null);
      }
      chosenNetwork = store.current.send.chosenNetwork;
      token = store.current.send.coin.token;
      if (
        ((ref$ = chosenNetwork.id) === 'evm' || ref$ === 'legacy') &&
        (token === 'vlx_evm' || token === 'vlx2')
      ) {
        store.current.send.contractAddress = null;
        return cb(null);
      }
      wallet = store.current.send.wallet;
      var swaps = contracts({ store, web3t });

      var dummy = function (a, b, cb) {
        return cb(null);
      };
      var func = (function () {
        switch (false) {
          case !(token === 'usdt_erc20' && chosenNetwork.id === 'vlx_usdt'):
            /* Swap from USDT ETHEREUM to USDT VELAS  */
            return swaps.eth_usdtUsdt_velasSwap;

          case !(token === 'vlx_usdt' && chosenNetwork.id === 'usdt_erc20'):
            /* Swap from USDT VELAS to USDT ETHEREUM */
            return swaps.usdt_velasEth_usdtSwap;

          case !(token === 'busd' && chosenNetwork.id === 'vlx_busd'):
            /* Swap from BUSD to BUSD VELAS */
            return swaps.busd_to_busd_velas_swap;

          case !(token === 'vlx_busd' && chosenNetwork.id === 'busd'):
            /* Swap from BUSD VELAS to BUSD */
            return swaps.busd_velas_to_busd_swap;

          case !(token === 'usdc' && chosenNetwork.id === 'vlx_usdc'):
            /* Swap from USDC to USDC VELAS */
            return swaps.usdc_to_usdc_velas_swap;

          case !(token === 'vlx_usdc' && chosenNetwork.id === 'usdc'):
            /* Swap from USDC VELAS to USDC */
            return swaps.usdc_velas_to_usdc_swap;

          case !(
            (token === 'vlx_evm' || token === 'vlx2') &&
            chosenNetwork.id === 'vlx_erc20'
          ):
            /* Swap from VELAS EVM to VLX ERC20 (ETH) */
            return swaps.vlx_evm_to_vlx_erc20_swap;

          case !(
            token === 'vlx_erc20' &&
            (chosenNetwork.id === 'vlx_evm' || chosenNetwork.id === 'vlx2')
          ):
            /* Swap from VLX ERC20 (ETH) to VELAS EVM  */
            return swaps.vlx_erc20_to_velas_swap;

          case !(token === 'eth' && chosenNetwork.id === 'vlx_eth'):
            /* Swap from VLX (ETH) to ETHEREUM */
            return swaps.eth_to_velas_eth_swap;

          case !(token === 'vlx_eth' && chosenNetwork.id === 'eth'):
            /* Swap from VLX (ETH) to ETHEREUM */
            return swaps.velas_eth_to_eth_swap;

          case !(token === 'bsc_vlx' && chosenNetwork.id === 'vlx_evm'):
            /* Swap from VLX (BSC) to VLX EVM */
            return swaps.bsc_velas_to_velas_evm_swap;

          case !(token === 'vlx_evm' && chosenNetwork.id === 'bsc_vlx'):
            /* Swap from VLX (EVM) to VLX (BSC */
            return swaps.velas_evm_to_bsc_swap;

          case !(token === 'vlx_huobi' && chosenNetwork.id === 'vlx_evm'):
            /* Swap from VLX (HECO) to VLX (EVM) */
            return swaps.heco_to_velas_evm_swap;

          case !(token === 'vlx_evm' && chosenNetwork.id === 'vlx_huobi'):
            /* Swap from VLX (EVM) to VLX (HECO) */
            return swaps.velas_evm_to_heco_swap;

          default:
            return dummy;
        }
      })();

      if (typeof func !== 'function') {
        return cb('func type is not a function.');
      }

      func(token, chosenNetwork, function (err, data) {
        var ref$, $recipient, hex, ethAddress;
        if (err != null) {
          return cb(err);
        }

        /**
         * Swap into native */
        if (chosenNetwork.id === 'vlx_native') {
          $recipient = '';
          try {
            $recipient = bs58.decode(send.to);
            hex = $recipient.toString('hex');
          } catch (e$) {
            return cb('Please enter valid address');
          }
          ethAddress = '0x' + hex;
          data =
            web3t.velas.EvmToNativeBridge.transferToNative.getData(ethAddress);
          store.current.send.contractAddress =
            web3t.velas.EvmToNativeBridge.address;
        }

        if (
          ((ref$ = chosenNetwork.id) === 'vlx_evm' || ref$ === 'vlx2') &&
          token === 'vlx_native'
        ) {
          const ownerPrivateKey = wallet.privateKey;
          const lamports = times(
            store.current.send.amountSend,
            Math.pow(10, 9)
          );
          let addr = store.current.send.to;
          if (ref$ === 'vlx2') {
            addr = toEthAddress(addr);
          }
          data = swapNativeToEvm(ownerPrivateKey, lamports, addr);
        }

        send.data = data;
        return cb(null);
      });
    };

    sendTx = function (transaction, cb) {
      if (+transaction.amountFee === 0) {
        return cb('Fee must be more then 0');
      }
      const receiver =
        store.current.send.contractAddress != null
          ? store.current.send.contractAddress
          : transaction.recipient;
      const chosenNetwork = store.current.send.chosenNetwork;
      const referTo = chosenNetwork != null ? chosenNetwork.referTo : void 8;
      const recipient = (function () {
        switch (false) {
          case !(
            referTo != null &&
            referTo !== 'vlx_native' &&
            receiver.startsWith('V')
          ):
            return toEthAddress(receiver);
          case !(
            transaction.coin.token !== 'vlx_native' && receiver.startsWith('V')
          ):
            return toEthAddress(receiver);
          default:
            return receiver;
        }
      })();

      /* Mark transaction as a swap in case of native to legacy swap! */
      transaction.swap = store.current.send.isSwap;
      transaction.recipient = recipient;
      const gasPrice =
        send.gasPriceType === 'custom'
          ? times(store.current.send.gasPriceCustomAmount, Math.pow(10, 9))
          : store.current.send.gasPriceAuto;
      transaction.gasPrice = gasPrice;

      store.current.creatingTransaction = true;
      return createTransaction(transaction, function (err, data) {
        if (err != null) {
          store.current.creatingTransaction = false;
          if (err.toString().indexOf('has no matching Script') !== -1) {
            err = 'Address is not valid';
          }
          return cb(err);
        }
        var currency = (
          transaction.coin.nickname || transaction.coin.token
        ).toUpperCase();
        const amount = roundHuman(transaction.amount);
        /* Important cover sending tx in setImmediate to avoid "send freezing" screen (for solana derivatives tokens). */
        setImmediate(() => {
          let confirmComponent = () => {
            const { url, addressLink } = wallet.network.api;
            const txurl = addressLink
              ? addressLink.replace(':address', transaction.recipient)
              : `${url}/address/${store.current.send.to}`;
            const amountStyle = { fontWeight: 'bold' };
            const linkStyle = {
              textDecorationLine: 'underline',
              color: 'blue',
            };
            return (
              <ScrollView>
                <Text>
                  <Text>{'Are you sure to send '}</Text>
                  <Text style={amountStyle}>
                    {amount} {currency}
                  </Text>
                  <Text>{' to '}</Text>
                  <Text
                    style={linkStyle}
                    onPress={() => {
                      Linking.openURL(txurl);
                    }}
                  >
                    {store.current.send.to}
                  </Text>
                  ?
                </Text>
              </ScrollView>
            );
          };
          if (
            store.current.send.isSwap === true &&
            store.current.send.chosenNetwork
          ) {
            confirmComponent = () => {
              const network = wallet.network.group;
              const walletTo = store.current.account.wallets.find(
                (x) => x.coin.token === store.current.send.chosenNetwork.referTo
              );
              const tokenFee = roundNumber(send.amountSendFee, { decimals: 9 });
              const networkTo = walletTo.network.group;
              const { url, addressLink } = walletTo.network.api;
              const txurl = addressLink
                ? addressLink.replace(':address', store.current.send.to)
                : `${url}/address/${store.current.send.to}`;

              const boldStyle = { fontWeight: 'bold' };
              const networkStyle = {
                fontWeight: 'bold',
                color: Images.colorBlue,
              };
              const linkStyle = {
                textDecorationLine: 'underline',
                color: 'blue',
              };
              const borderStyle = {
                width: '100%',
                padding: 5,
                height: 20,
                display: 'flex',
              };
              return (
                <ScrollView>
                  <Text>
                    <Text>{'Are you sure to swap '}</Text>
                    <Text style={boldStyle}>
                      {amount} {currency}
                    </Text>
                    <Text>{' from '}</Text>
                    <Text style={networkStyle}>{`${network} network`}</Text>
                    <Text>{' to '}</Text>
                    <Text
                      style={[networkStyle, { marginBottom: 5 }]}
                    >{`${networkTo} network`}</Text>
                    ?
                  </Text>
                  <View style={borderStyle}></View>
                  <Text style={boldStyle}>{'Receiver: '}</Text>
                  <Text
                    style={linkStyle}
                    onPress={() => {
                      Linking.openURL(txurl);
                    }}
                  >
                    {store.current.send.to}
                  </Text>
                  <View style={borderStyle}></View>
                  <Text style={boldStyle}>{'Tx fee:'}</Text>
                  <Text>{` ${tokenFee} ${feeToken}`}</Text>
                </ScrollView>
              );
              // confirmText = "Are you sure to swap " + amount + " " + currency + " to " + store.current.send.to;
            };
          }
          return confirm2(store, confirmComponent, function (agree) {
            if (!agree) {
              store.current.creatingTransaction = false;
              return cb('You are not agree');
            }
            var txSpinner = null;
            setTimeout(() => {
              txSpinner = new Spinner(store, 'Sending funds', {
                displayDescription: true,
              });
            }, 1);
            return pushTx(
              import$(
                {
                  token: transaction.coin.token,
                  txType: transaction.txType,
                  network: transaction.network,
                },
                data
              ),
              function (err, tx) {
                store.current.creatingTransaction = false;
                setTimeout(() => {
                  txSpinner.finish();
                  if (err != null) {
                    return cb(err);
                  }
                  return cb(err, tx);
                }, 100);
                // txSpinner.finish();

                /* Remove creating pending tx in order to avoid unnecessary empty tx if parsing is bad */
                /* Only actual txs would be rendering to user via tokens providers */

                // return createPendingTx({
                // 	store: store,
                // 	token: transaction.coin.token,
                // 	network: transaction.network,
                // 	tx: tx,
                // 	amountSend: transaction.amount,
                // 	amountSendFee: transaction.amountFee
                // }, function (err) {
                // 	return cb(err, tx);
                // });
              }
            );
          });
        });
      });
    };
    performSendSafe = function (cb) {
      return resolveAddress(
        {
          store: store,
          address: send.to,
          coin: send.coin,
          network: send.network,
        },
        function (err, to) {
          if (err !== null) {
            var errMessage = err.message ? err.message : err;
            send.error = errMessage;
            return cb(errMessage);
          }
          const Tx = new Transaction(
            send.wallet,
            send.network,
            send.to,
            send.amountSend,
            send.coin,
            send.amountSendFee,
            send.feeType,
            send.txType,
            send.data
          );
          return sendTx(Tx, cb);
        }
      );
    };
    performSendUnsafe = function (cb) {
      return sendTx(
        import$(
          {
            wallet: wallet,
          },
          send
        ),
        cb
      );
    };

    let sendingAmountMoreThanZero = function () {
      return +send.amountSend > 0;
    };

    checkEnough = function (cb) {
      var amount, ref$, err;
      if (!sendingAmountMoreThanZero()) {
        return cb('Amount should be more than 0');
      }

      try {
        amount = minus(
          minus(
            minus(wallet.balance, send.amountSend),
            (ref$ = wallet.pendingSent) != null ? ref$ : 0
          ),
          fee
        );
        if (+amount < 0) {
          return cb('Insufficient funds');
        }
        return cb(null);
      } catch (e$) {
        err = e$;
        return cb(err);
      }
    };

    sendMoney = function () {
      if (wallet.balance === '...') {
        return;
      }
      if (send.sending === true) {
        return;
      }
      return checkEnough(function (err) {
        var ref$;
        if (err != null) {
          return (send.error =
            ((ref$ = err.message) != null ? ref$ : err) + '');
        }
        send.sending = true;
        return performSendSafe(function (err, data) {
          var ref$;
          send.sending = false;
          if (err != null) {
            // Auto clean-up error only in case user pressed cancel button in confirmation modal.
            if ((err || '').toString().indexOf('You are not agree') > -1) {
              send.error = ((ref$ = err.message) != null ? ref$ : err) + '';
              setTimeout(() => {
                send.error = '';
              }, 500);
              return;
            }
            return (send.error =
              ((ref$ = err.message) != null ? ref$ : err) + '');
          }
          notifyFormResult(send.id, null, data);
          store.current.lastTxUrl = send.network.api.url + '/tx/' + data;
          store.current.transaction = {
            hash: data,
          };
          store.current.send.amountSend = '';
          store.current.send.amountSendUsd = '';
          navigate(store, web3t, 'sent');
          return web3t.refresh(function () {});
        });
      });
    };
    sendEscrow = function () {
      var name, amountEthers;
      name = send.to;
      amountEthers = send.amountSend;
      return sendTo(
        {
          name: name,
          amountEthers: amountEthers,
        },
        function (err) {}
      );
    };
    const beforeSendAnyway = function () {
      var cb;
      cb = console.log;
      return executeContractData(function (err) {
        if (err != null) {
          store.current.send.error = err;
          return cb(err);
        }
        return sendMoney();
      });
    };
    sendAnyway = function () {
      return sendMoney();
    };
    sendTitle = (function () {
      switch (false) {
        case !send.proposeEscrow:
          return 'SEND (Escrow)';
        default:
          return lang.send;
      }
    })();
    cancel = function (event) {
      navigate(store, web3t, 'wallets');
      return notifyFormResult(send.id, 'Cancelled by user');
    };
    checkRecipientAddress = function () {
      console.log('checkRecipientAddress');
      const recipientAddress = send.to;
      return resolveAddress(
        {
          store: store,
          address: recipientAddress,
          coin: send.coin,
          network: send.network,
        },
        function (err, to) {
          if (err !== null) {
            var errMessage = err.message ? err.message : err;
            return (send.error = errMessage);
          }
          send.error = '';
          send.to = recipientAddress;
        }
      );
    };
    recipientChange = function (event) {
      var ref$;
      var _to = ((ref$ = event.target.value) != null ? ref$ : '').trim();
      send.to = _to;
      amountChange(
        {
          target: {
            value: store.current.send.amountSend,
          },
        },
        function (err) {}
      );
    };
    getValue = function (event) {
      var value, ref$, value2;
      if (event.target.value === '') {
        return '';
      }
      value =
        (ref$ = event.target.value.match(/^[0-9]+([.]([0-9]+)?)?$/)) != null
          ? ref$[0]
          : void 8;
      value2 = (function () {
        switch (false) {
          case !(
            (value != null ? value[0] : void 8) === '0' &&
            (value != null ? value[1] : void 8) != null &&
            (value != null ? value[1] : void 8) !== '.'
          ):
            return value.substr(1, value.length);
          default:
            return value;
        }
      })();
      return value2;
    };
    amountChange = function (event) {
      var value;
      value = getValue(event);
      return changeAmount(store, value, false, () => {});
    };
    performAmountEurChange = function (value) {
      var toSend;
      toSend = calcCryptoFromEur(store, value);
      return changeAmount(store, toSend, 'skipUpdateFiat', () => {});
    };
    performAmountUsdChange = function (value) {
      var toSend;
      toSend = calcCryptoFromUsd(store, value);
      return changeAmount(store, toSend, 'skipUpdateFiat', () => {});
    };
    amountEurChange = function (event) {
      var value;
      value = getValue(event);
      send.amountSendEur = value;
      amountEurChange.timer = clearTimeout(amountEurChange.timer);
      return (amountEurChange.timer = setTimeout(function () {
        return performAmountEurChange(value);
      }, 100));
    };
    amountUsdChange = function (event) {
      var value;
      value = getValue(event);
      send.amountSendUsd = value;
      amountUsdChange.timer = clearTimeout(amountUsdChange.timer);
      return (amountUsdChange.timer = setTimeout(function () {
        return performAmountUsdChange(value);
      }, 100));
    };
    encodeDecode = function () {
      return (send.showDataMode = (function () {
        switch (false) {
          case send.showDataMode !== 'decoded':
            return 'encoded';
          default:
            return 'decoded';
        }
      })());
    };
    showData = function () {
      switch (false) {
        case send.showDataMode !== 'decoded':
          return send.decodedData;
        default:
          return send.data;
      }
    };
    showLabel = function () {
      if (send.showDataMode === 'decoded') {
        return 'encoded';
      } else {
        return 'decoded';
      }
    };
    whenEmpty = function (str, def) {
      if ((str != null ? str : '').length === 0) {
        return def;
      } else {
        return str;
      }
    };
    debug = function (cb) {
      var token, address, tx, amountSend, amountSendFee;
      token = send.coin.token;
      address = wallet.address;
      tx = 'fake tx';
      amountSend = 1;
      amountSendFee = 0.01;
      return createPendingTx(
        {
          store: store,
          token: token,
          network: send.network,
          tx: tx,
          amountSend: amountSend,
          amountSendFee: amountSendFee,
        },
        function (err) {
          return web3t.refresh(function () {
            return cb(null);
          });
        }
      );
    };
    history = function () {
      store.current.sendMenuOpen = false;
      store.current.filter = ['IN', 'OUT', send.coin.token];
      applyTransactions(store);
      return navigate(store, web3t, 'history');
    };
    network = (function () {
      switch (false) {
        case store.current.network !== 'testnet':
          return ' (TESTNET) ';
        default:
          return '';
      }
    })();
    invoice = function (wallet) {
      var ref$, coin, network;
      store.current.sendMenuOpen = false;
      (ref$ = store.current.send), (coin = ref$.coin), (network = ref$.network);
      importAll$(store.current.invoice, {
        coin: coin,
        wallet: wallet,
        network: network,
      });
      return navigate(store, web3t, 'invoice');
    };
    token = (send.coin.nickname + send.coin.token).toUpperCase();
    const tokenDisplay = (
      (ref$ = wallet.coin.token) != null ? ref$ : ''
    ).toUpperCase();
    feeToken = (
      (ref$ = wallet.network.txFeeIn) != null
        ? ref$
        : send.coin.nickname || send.coin.token
    ).toUpperCase();
    feeToken = feeToken.toUpperCase();
    isData = ((ref$ = send.data) != null ? ref$ : '').length > 0;
    chooseAuto = function () {
      send.feeType = 'auto';
      return changeAmount(store, send.amountSend, false, () => {});
    };
    chooseCheap = function () {
      send.feeType = 'cheap';
      return changeAmount(store, send.amountSend, false, () => {});
    };
    chosenCheap = send.feeType === 'cheap' ? 'chosen' : '';
    chosenAuto = send.feeType === 'auto' ? 'chosen' : '';
    sendOptions = (ref$ = send.coin.txTypes) != null ? ref$ : [];
    pending = wallet.pendingSent + ' ' + token;
    calcAmountAndFee = function (amountSend, trials, cb) {
      var account;
      if (trials <= 0) {
        return cb('Cannot estimate max amount. Please try to type manually');
      }
      if (+amountSend === 0) {
        return cb('Balance is not enough to send tx');
      }
      account = {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
      return calcFee(
        {
          token: token,
          network: send.network,
          amount: amountSend,
          feeType: send.feeType,
          txType: send.txType,
          account: account,
        },
        function (err, amountSendFee) {
          var next, nextAmount, nextTrials;
          if (err == null) {
            return cb(null, {
              amountSend: amountSend,
              amountSendFee: amountSendFee,
            });
          }
          if (err != null && err !== 'Balance is not enough to send tx') {
            return cb(err);
          }
          if (amountSendFee == null) {
            return cb('Fee cannot be calculated');
          }
          next =
            amountSendFee != null
              ? amountSendFee
              : div(10, Math.pow(10, send.network.decimals));
          nextAmount = minus(amountSend, next);
          nextTrials = trials - 1;
          return calcAmountAndFee(nextAmount, nextTrials, cb);
        }
      );
    };
    useMax = function (cb) {
      var ref$, amount;
      if (+((ref$ = send.amountSendFee) != null ? ref$ : 0) === 0) {
        return cb('Data is not ready yet');
      }
      amount = minus(
        minus(wallet.balance, (ref$ = wallet.pendingSent) != null ? ref$ : 0),
        send.amountSendFee
      );
      if (+amount <= 0) {
        return cb('Amount is too small');
      }
      return calcAmountAndFee(amount, 10, function (err, info) {
        if (err != null) {
          return cb(err + '');
        }
        if (+info.amountSend === 0) {
          return cb('Amount is 0');
        }
        send.amountSend = info.amountSend;
        send.amountSendFee = info.amountSendFee;
        changeAmount(store, send.amountSend, false, () => {
          return cb(null);
        });
      });
    };
    useMaxTryCatch = function (cb) {
      var err;
      try {
        return useMax(cb);
      } catch (e$) {
        err = e$;
        return cb(err);
      }
    };
    useMaxAmount = function () {
      return useMaxTryCatch(function (err) {
        if (err != null) {
          return alert(err + '');
        }
      });
    };
    return {
      invoice: invoice,
      token: token,
      network: network,
      send: send,
      wallet: wallet,
      pending: pending,
      feeToken: feeToken,
      primaryButtonStyle: primaryButtonStyle,
      recipientChange: recipientChange,
      checkRecipientAddress: checkRecipientAddress,
      amountChange: amountChange,
      amountUsdChange: amountUsdChange,
      amountEurChange: amountEurChange,
      useMaxAmount: useMaxAmount,
      showData: showData,
      showLabel: showLabel,
      topup: topup(store),
      history: history,
      cancel: cancel,
      sendAnyway: sendAnyway,
      beforeSendAnyway: beforeSendAnyway,
      chooseAuto: chooseAuto,
      chooseCheap: chooseCheap,
      chosenAuto: chosenAuto,
      chosenCheap: chosenCheap,
      getAddressLink: getAddressLink,
      getAddressTitle: getAddressTitle,
      defaultButtonStyle: defaultButtonStyle,
      round5edit: round5edit,
      round5: round5,
      sendOptions: sendOptions,
      sendTitle: sendTitle,
      isData: isData,
      encodeDecode: encodeDecode,
      changeAmount: changeAmount,
    };
  };
  function import$(obj, src) {
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function importAll$(obj, src) {
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}.call(this));
