// Generated by LiveScript 1.5.0
(function () {
  var ref$,
    objToPairs,
    find,
    pairsToObj,
    map,
    toJS,
    getKeys,
    web3,
    slice$ = [].slice;
  (ref$ = require('prelude-ls')),
    (find = ref$.find),
    (objToPairs = ref$.objToPairs),
    (pairsToObj = ref$.pairsToObj),
    (map = ref$.map);
  toJS = require('mobx').toJS;
  getKeys = require('./api.js').getKeys;
  module.exports = function (store, mnemonic, cb) {
    var generateCoinWallet, generateCoinWallets;
    mnemonic == null && (mnemonic = '');
    generateCoinWallet = function (store, coin, cb) {
      var network, index;
      network = coin[store.current.network];
      if (network.disabled === true) {
        return cb(null);
      }
      index = store.current.accountIndex;
      getKeys(
        {
          index: index,
          network: network,
          mnemonic: mnemonic,
          token: coin.token,
        },
        function (err, wallet) {
          var balance, balanceUsd, usdRate;
          if (err != null) {
            return cb(err);
          }
          // Do not set wallet with default values if it is present in the added list
          // and there is no network change or account index change (just simple wallet reload).
          var foundWallet = (store.current.account.wallets || []).find(
            (it) => it.coin.token === coin.token
          );
          if (
            store.walletStarted &&
            foundWallet &&
            store.current.account.wallets &&
            !store.changingAccountIndex &&
            !store.changingNetwork
          ) {
            console.log(`Take ${coin.token} wallet from cache`);
            return cb(null, foundWallet);
          }

          balance = '..';
          balanceUsd = '..';
          usdRate = '..';
          wallet.coin = coin;
          wallet.network = network;
          wallet.balance = balance;
          wallet.balanceUsd = balanceUsd;
          wallet.usdRate = usdRate;
          wallet.mnemonic = mnemonic;
          return cb(null, JSON.parse(JSON.stringify(wallet)));
        }
      );
    };
    generateCoinWallets = function (store, arg$, cb) {
      var coin, rest;
      (coin = arg$[0]), (rest = slice$.call(arg$, 1));
      if (coin == null) {
        return cb(null, []);
      }
      return generateCoinWallet(store, coin, function (err, walletOrNull) {
        if (err != null) {
          return cb(err);
        }
        if (walletOrNull != null) {
          coin.wallet = walletOrNull;
        }
        return generateCoinWallets(store, rest, function (err, wallets) {
          var currentWallets, all;
          if (err != null) {
            return cb(err);
          }
          currentWallets = (function () {
            switch (false) {
              case walletOrNull == null:
                return [walletOrNull];
              default:
                return [];
            }
          })();
          all = wallets.concat(currentWallets);
          return cb(null, all);
        });
      });
    };
    if (store.coins.length === 0) {
      return cb(null, {
        mnemonic: mnemonic,
        wallets: [],
      });
    }
    return generateCoinWallets(store, store.coins, function (err, wallets) {
      if (err != null) {
        return cb(err);
      }
      console.log('.... set store.walletStarted = true;');
      store.walletStarted = true;
      return cb(null, {
        mnemonic: mnemonic,
        wallets: wallets,
      });
    });
  };
}.call(this));
