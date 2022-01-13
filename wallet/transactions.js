// Generated by LiveScript 1.6.0
(function () {
  var ref$,
    each,
    map,
    pairsToObj,
    filter,
    find,
    getTransactions,
    run,
    task,
    getPendingTxs,
    removeTx,
    applyTransactions,
    addTask,
    same,
    extend,
    transformPtx,
    makeNotPending,
    checkTransactionTask,
    checkPtxInBackground,
    checkPtxsInBackground,
    rebuildHistory,
    buildLoader,
    loadAllTransactions,
    slice$ = [].slice,
    out$ = (typeof exports != 'undefined' && exports) || this;
  (ref$ = require('prelude-ls')),
    (each = ref$.each),
    (map = ref$.map),
    (pairsToObj = ref$.pairsToObj),
    (filter = ref$.filter),
    (map = ref$.map),
    (find = ref$.find);
  getTransactions = require('./api.js').getTransactions;
  (ref$ = require('./workflow.js')), (run = ref$.run), (task = ref$.task);
  (ref$ = require('./pending-tx.js')),
    (getPendingTxs = ref$.getPendingTxs),
    (removeTx = ref$.removeTx);
  applyTransactions = require('./apply-transactions.js');
  same = function (x, y) {
    return (
      (x != null
        ? typeof x.toUpperCase == 'function'
          ? x.toUpperCase()
          : void 8
        : void 8) ===
      (y != null
        ? typeof y.toUpperCase == 'function'
          ? y.toUpperCase()
          : void 8
        : void 8)
    );
  };
  extend = curry$(function (arg$, tx) {
    var address, coin, pending, network, type, ref$;
    (address = arg$.address),
      (coin = arg$.coin),
      (pending = arg$.pending),
      (network = arg$.network);
    type = (function () {
      switch (false) {
        case !same(tx.to, address):
          return 'IN';
        default:
          return 'OUT';
      }
    })();
    if (tx.type == null) {
      tx.type = type;
    }
    tx.token = (ref$ = coin.token) != null ? ref$ : tx.token;
    tx.pending = pending != null ? pending : tx.pending;
    return (tx.network = network != null ? network : tx.network);
  });
  transformPtx = curry$(function (config, arg$) {
    var tx, amount, fee, time, from, to2, ref$, ref1$, url, linktx;
    (tx = arg$[0]),
      (amount = arg$[1]),
      (fee = arg$[2]),
      (time = arg$[3]),
      (from = arg$[4]),
      (to2 = arg$[5]);
    (ref$ =
      (ref$ = (ref1$ = config.network) != null ? ref1$.api : void 8) != null
        ? ref$
        : {}),
      (url = ref$.url),
      (linktx = ref$.linktx);
    url = (function () {
      switch (false) {
        case !linktx:
          return linktx.replace(':hash', tx);
        case !url:
          return url + '/tx/' + tx;
      }
    })();
    return {
      tx: tx,
      amount: amount,
      url: url,
      fee: fee,
      time: time,
      from: from,
      to: to2,
    };
  });
  makeNotPending = function (store, tx) {
    tx.pending = false;
    return removeTx(
      {
        store: store,
        token: tx.token,
        network: tx.network,
        tx: tx.tx,
      },
      function (err, result) {
        return applyTransactions(store);
      }
    );
  };
  checkTransactionTask = function (bgStore, web3, network, token, ptx) {
    return function (store, cb) {
      var check, ref$;
      check =
        (ref$ = web3[token]) != null ? ref$.getTransactionReceipt : void 8;
      if (check == null) {
        return cb(null);
      }
      return check(ptx[0], function (err, data) {
        var tx, ref$;
        tx = find(function (it) {
          return it.token === token && it.tx === ptx[0];
        })(store.transactions.all);
        if (tx == null) {
          return cb(null);
        }
        console.log(ptx[0], tx != null ? tx.pending : void 8);
        tx.checked = (ref$ = tx.checked) != null ? ref$ : 0;
        tx.checked += 1;
        if (tx == null) {
          return cb(null);
        }
        if ((data != null ? data.status : void 8) === 'confirmed') {
          makeNotPending(store, tx);
        }
        if ((data != null ? data.status : void 8) === 'reverted') {
          makeNotPending(store, tx);
        }
        if ((data != null ? data.status : void 8) === 'confirmed') {
          return cb(null);
        }
        if ((data != null ? data.status : void 8) === 'reverted') {
          return cb(null);
        }
        return cb('pending');
      });
    };
  };

  out$.rebuildHistory = rebuildHistory = function (store, web3, wallet, cb) {
    var address, network, coin, privateKey;
    (address = wallet.address),
      (network = wallet.network),
      (coin = wallet.coin),
      (privateKey = wallet.privateKey);
    return getTransactions(
      {
        address: address,
        network: network,
        token: coin.token,
        account: {
          address: address,
          privateKey: privateKey,
        },
      },
      function (err, data) {
        var ids, dummy;
        if (err != null) {
          return cb(err);
        }
        ids = map(function (it) {
          return it.tx.toUpperCase();
        })(data);
        dummy = function (err, data) {
          return console.log(err, data);
        };
        return getPendingTxs(
          {
            network: network,
            store: store,
            token: coin.token,
          },
          function (err, ptxs) {
            if (err != null) {
              return cb(err);
            }
            each(function (it) {
              return removeTx(
                {
                  store: store,
                  token: coin.token,
                  network: network,
                  tx: it[0],
                },
                dummy
              );
            })(
              filter(function (it) {
                return ids.indexOf(it[0].toUpperCase()) !== -1;
              })(ptxs)
            );
            return getPendingTxs(
              {
                network: network,
                store: store,
                token: coin.token,
              },
              function (err, ptxs) {
                var txs,
                  this$ = this;
                if (err != null) {
                  return cb(err);
                }
                txs = store.transactions.all;
                each(function (it) {
                  return txs.splice(txs.indexOf(it), 1);
                })(
                  filter(function (it) {
                    return it.token === coin.token;
                  })(txs)
                );
                each(bind$(txs, 'push'))(
                  each(
                    extend({
                      address: address,
                      coin: coin,
                      network: network,
                    })
                  )(data)
                );
                each(bind$(txs, 'push'))(
                  each(
                    extend({
                      address: address,
                      coin: coin,
                      network: network,
                      pending: true,
                    })
                  )(map(transformPtx)(ptxs))
                );
                return cb();
              }
            );
          }
        );
      }
    );
  };
  buildLoader = function (store, web3) {
    return function (wallet) {
      return task(function (cb) {
        return rebuildHistory(store, web3, wallet, function (err) {
          if (err != null) {
            return cb();
          }
          return cb(null);
        });
      });
    };
  };
  out$.loadAllTransactions = loadAllTransactions = function (store, web3, cb) {
    var wallets, loaders, tasks;
    wallets = [...store.current.account.wallets];
    if (store.current.wallet) {
      const wallet = find(function (it) {
        return it.coin.token === store.current.wallet;
      })(store.current.account.wallets);
      wallets = [wallet];
    }
    loaders = map(buildLoader(store, web3))(wallets);
    tasks = pairsToObj(
      map(function (it) {
        return [loaders.indexOf(it).toString(), it];
      })(loaders)
    );
    return run([tasks]).then(function () {
      applyTransactions(store);
      return cb(null);
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
  function bind$(obj, key, target) {
    return function () {
      return (target || obj)[key].apply(obj, arguments);
    };
  }
}.call(this));
