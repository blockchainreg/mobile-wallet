// Generated by LiveScript 1.5.0
(function () {
  var toJS,
    ref$,
    times,
    minus,
    div,
    changeAmountInvoice,
    calcCrypto,
    window,
    navigate,
    close,
    round5edit,
    getPrimaryInfo,
    map,
    getAddressLink,
    getAddressTitle,
    put;
  toJS = require('mobx').toJS;
  (ref$ = require('./math.js')),
    (times = ref$.times),
    (minus = ref$.minus),
    (div = ref$.div);
  (ref$ = require('./calc-amount.js')),
    (changeAmountInvoice = ref$.changeAmountInvoice),
    (calcCrypto = ref$.calcCrypto);
  window = require('./browser/window.js');
  navigate = require('./navigate.js');
  close = require('./close.js');
  round5edit = require('./round5edit.js');
  getPrimaryInfo = require('./get-primary-info.js');
  map = require('prelude-ls').map;
  (ref$ = require('./address-link.js')),
    (getAddressLink = ref$.getAddressLink),
    (getAddressTitle = ref$.getAddressTitle);
  put = require('../web3t/providers/superagent.js').put;
  module.exports = function (store, web3t) {
    var invoice,
      wallet,
      color,
      primaryButtonStyle,
      defaultButtonStyle,
      sendAnyway,
      cancel,
      recipientChange,
      getValue,
      amountChange,
      amountUsdChange,
      network,
      token,
      descriptionChange;
    if (store == null || web3t == null) {
      return null;
    }
    invoice = store.current.invoice;
    wallet = invoice.wallet;
    if (wallet == null) {
      return null;
    }
    color = getPrimaryInfo(store).color;
    primaryButtonStyle = {
      background: color,
    };
    defaultButtonStyle = {
      color: color,
    };
    sendAnyway = function (response) {
      var address, to, data, amountSend;
      address = invoice.wallet.address;
      (to = invoice.to),
        (data = invoice.data),
        (amountSend = invoice.amountSend);
      return put('https://web3.space/invoice/send', {
        response: response,
        token: token,
        address: address,
        to: to,
        data: data,
        amount: amountSend,
      }).end(function (err, data) {
        var ref$;
        if (err != null) {
          return alert(
            ((ref$ = err.message) != null ? ref$ : err) + ': ' + data.text
          );
        }
        alert('Your invoice has been sent');
        return cancel();
      });
    };
    cancel = function (event) {
      return navigate(store, web3t, 'wallets');
    };
    recipientChange = function (event) {
      var ref$;
      return (invoice.to = (ref$ = event.target.value) != null ? ref$ : '');
    };
    getValue = function (event) {
      var value, ref$, value2;
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
      return changeAmountInvoice(store, value);
    };
    amountUsdChange = function (event) {
      var value, toSend;
      value = getValue(event);
      toSend = calcCrypto(store, value);
      return changeAmountInvoice(store, toSend);
    };
    network = (function () {
      switch (false) {
        case store.current.network !== 'testnet':
          return ' (TESTNET) ';
        default:
          return '';
      }
    })();
    token = invoice.coin.token.toUpperCase();
    descriptionChange = function (event) {
      return (invoice.data = event.target.value);
    };
    return {
      invoice: invoice,
      descriptionChange: descriptionChange,
      token: token,
      wallet: wallet,
      primaryButtonStyle: primaryButtonStyle,
      recipientChange: recipientChange,
      amountChange: amountChange,
      amountUsdChange: amountUsdChange,
      cancel: cancel,
      sendAnyway: sendAnyway,
      getAddressLink: getAddressLink,
      getAddressTitle: getAddressTitle,
      defaultButtonStyle: defaultButtonStyle,
      round5edit: round5edit,
    };
  };
}.call(this));
