// Generated by LiveScript 1.6.0
(function () {
  var newAccount,
    refreshWallet,
    ref$,
    toJS,
    transaction,
    map,
    pairsToObj,
    mirror,
    applyTransactions,
    refreshWaletTxs,
    setAccount,
    refreshAccount,
    refreshTxs,
    backgroundRefreshAccount,
    out$ = (typeof exports != 'undefined' && exports) || this;
  newAccount = require('./new-account.js');
  refreshWallet = require('./refresh-wallet.js');
  (ref$ = require('mobx')),
    (toJS = ref$.toJS),
    (transaction = ref$.transaction);
  (ref$ = require('prelude-ls')),
    (map = ref$.map),
    (pairsToObj = ref$.pairsToObj);
  mirror = require('./mirror.js');
  applyTransactions = require('./apply-transactions.js');
  refreshWaletTxs = require('./refresh-txs.js');
  out$.setAccount = setAccount = function (web3, store, cb) {
    return newAccount(store, store.current.seed, function (err, account) {
      if (err != null) {
        return cb(err);
      }
      store.current.account = account;
      mirror.accountAddresses = pairsToObj(
        map(function (it) {
          return [it.coin.token, it.address];
        })(account.wallets)
      );
      return cb(null);
    });
  };
  out$.refreshAccount = refreshAccount = curry$(function (web3, store, cb) {
    return setAccount(web3, store, function (err) {
      var accountName;
      if (err != null) {
        return cb(err);
      }
      store.current.account.accountName = 'Anonymous';
      accountName = store.current.account.accountName;
      if (accountName !== 'Anonymous') {
        store.current.nickname = '';
      }
      if (accountName !== 'Anonymous') {
        store.current.nicknamefull = accountName;
      }
      return refreshWallet(web3, store, cb);
    });
  });
  refreshTxs = curry$(function (web3, store, cb) {
    setTimeout(() => {
      refreshWaletTxs(web3, store, function () {});
    }, 1);
  });
  out$.backgroundRefreshAccount = backgroundRefreshAccount = function (
    web3,
    store,
    cb
  ) {
    var bgStore;
    store.current.refreshing = true;
    bgStore = toJS(store);
    return refreshAccount(web3, bgStore, function (err) {
      var state = {
        err: null,
        data: null,
      };
      store.current.refreshing = false;
      if (err != null) {
        return cb(err);
      }
      transaction(function () {
        var wallet, err;
        try {
          const walletToken = store.current.wallet;
          if (walletToken) {
            wallet = bgStore.current.account.wallets.find(
              (it) => it.coin.token === walletToken
            );
          } else {
            if (store.current.walletIndex < 0) return;
            wallet = bgStore.current.account.wallets[store.current.walletIndex];
          }
          store.rates = bgStore.rates;
          store.current.account = bgStore.current.account;
          store.current.filter.filterTxsTypes = ['IN', 'OUT'];
          const filterToken = wallet.coin != null ? wallet.coin.token : '';
          store.current.filter = {
            token: filterToken,
          };
          store.current.balanceUsd = bgStore.current.balanceUsd;
          return refreshTxs(web3, store, function () {
            store.transactions = bgStore.transactions;
            return applyTransactions(store);
          });
        } catch (e) {
          console.error('[refreshAccount] Error: ', e);
          state.err = e;
        }
      });
      return cb(state.err);
    });
  };
  function curry$(f, bound) {
    var context,
      _curry = function (args) {
        return f.length > 1
          ? function () {
              var params = args ? args.concat() : [];
              context = bound ? context || this : this;
              return params.push.apply(params, arguments) < f.length &&
                arguments.length
                ? _curry.call(context, params)
                : f.apply(context, params);
            }
          : f;
      };
    return _curry();
  }
}.call(this));
