// Generated by LiveScript 1.5.0
(function () {
  var each, toJS, accs, fakeWallet;
  each = require('prelude-ls').each;
  toJS = require('mobx').toJS;
  accs = {
    btc: '3AG7ZC6KxfKerviTod2DHqbJ5WDjwMjE6j',
    btcTestnet: 'mysKEM9kN86Nkcqwb4gw7RqtDyc552LQoq',
    ltc: 'LajyQBeZaBA1NkZDeY8YT5RYYVRkXMvb2T',
    waves: '3P6Qf3N56CEvJrUPzr5WyGokvoNEfN2wtyx',
    zec: 't1VpYecBW4UudbGcy4ufh61eWxQCoFaUrPs',
    dash: 'XfXzCt8S7atiVyqnGZdeXunjArgnkuLCc5',
  };
  fakeWallet = function (wallet) {
    var ref$;
    return (wallet.address =
      (ref$ = accs[wallet.coin.token]) != null ? ref$ : wallet.address);
  };
  module.exports = function (store) {
    var wallets;
    wallets = store.current.account.wallets;
    return each(fakeWallet)(wallets);
  };
}.call(this));
