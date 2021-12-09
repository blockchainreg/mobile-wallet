// Generated by LiveScript 1.6.0
(function () {
  var Qiwi,
    ref$,
    map,
    find,
    split,
    div,
    times,
    plus,
    minus,
    moment,
    calcFee,
    getKeys,
    transformTx,
    getTransactions,
    getDec,
    createTransaction,
    pushTx,
    getTotalReceived,
    getApi,
    getBalance,
    out$ = (typeof exports != 'undefined' && exports) || this,
    toString$ = {}.toString;
  Qiwi = require('node-qiwi-api').Qiwi;
  (ref$ = require('prelude-ls')),
    (map = ref$.map),
    (find = ref$.find),
    (split = ref$.split),
    (map = ref$.map);
  (ref$ = require('../math.js')),
    (div = ref$.div),
    (times = ref$.times),
    (plus = ref$.plus),
    (minus = ref$.minus);
  moment = require('moment');
  out$.calcFee = calcFee = function (arg$, cb) {
    var network, feeType, account, amount, to, data, fixed, def;
    (network = arg$.network),
      (feeType = arg$.feeType),
      (account = arg$.account),
      (amount = arg$.amount),
      (to = arg$.to),
      (data = arg$.data);
    fixed = 50;
    if (+amount === 0) {
      return cb(null, fixed);
    }
    def = plus(fixed, times(div(amount, 100), 2));
    return cb(null, def);
  };
  out$.getKeys = getKeys = function (arg$, cb) {
    var network, mnemonic, index;
    (network = arg$.network), (mnemonic = arg$.mnemonic), (index = arg$.index);
    return getApi(network.privateKey, function (err, api) {
      if (err != null) {
        return cb(err);
      }
      return api.getAccountInfo(function (err, info) {
        var address, ref$;
        if (err != null) {
          return cb(err);
        }
        address =
          '+' + ((ref$ = info.contractInfo) != null ? ref$.contractId : void 8);
        return cb(null, {
          privateKey: network.privateKey,
          address: address,
        });
      });
    });
  };
  transformTx = curry$(function (network, t) {
    var url, tx, amount, time, fee, from, to;
    url = network.api.url;
    tx = t.txnId;
    amount = t.total.amount;
    time = moment(t.date).utc().unix();
    fee = t.commission.amount;
    from = t.type === 'OUT' ? t.personId : t.account;
    to = t.type === 'OUT' ? t.account : t.personId;
    return {
      network: 'qiwi',
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: t.from,
      to: t.to,
    };
  });
  out$.getTransactions = getTransactions = function (arg$, cb) {
    var network, address;
    (network = arg$.network), (address = arg$.address);
    return getApi(network.privateKey, function (err, api) {
      var sources;
      if (err != null) {
        return cb(err);
      }
      sources = (function () {
        switch (false) {
          case network.currency !== 643:
            return ['QW_RUB'];
          default:
            return [];
        }
      })();
      return api.getOperationHistory(
        {
          rows: 25,
          sources: sources,
        },
        function (err, info) {
          var txs;
          if (err != null) {
            return cb(err);
          }
          if (toString$.call(info.data).slice(8, -1) !== 'Array') {
            return cb('expected array');
          }
          txs = map(transformTx(network))(info.data);
          return cb(null, txs);
        }
      );
    });
  };
  getDec = function (network) {
    var decimals;
    decimals = network.decimals;
    return Math.pow(10, decimals);
  };
  out$.createTransaction = createTransaction = curry$(function (arg$, cb) {
    var network, account, recipient, amount, amountFee, data, feeType, txType;
    (network = arg$.network),
      (account = arg$.account),
      (recipient = arg$.recipient),
      (amount = arg$.amount),
      (amountFee = arg$.amountFee),
      (data = arg$.data),
      (feeType = arg$.feeType),
      (txType = arg$.txType);
    return getBalance(
      {
        network: network,
        address: account.address,
      },
      function (err, balance) {
        var rest, rawtx;
        if (err != null) {
          return cb(err);
        }
        rest = minus(balance, plus(amount, amountFee));
        if (+rest < 0) {
          return cb('Balance is not enough to send this amount');
        }
        if (err != null) {
          return cb(err);
        }
        rawtx = amount + ' -> ' + recipient;
        return cb(null, {
          rawtx: rawtx,
        });
      }
    );
  });
  out$.pushTx = pushTx = curry$(function (arg$, cb) {
    var network, rawtx, ref$, amount, account;
    (network = arg$.network), (rawtx = arg$.rawtx);
    if (toString$.call(rawtx).slice(8, -1) !== 'String') {
      return cb('rawtx should be an string');
    }
    (ref$ = map(function (it) {
      return it.trim();
    })(split('->')(rawtx))),
      (amount = ref$[0]),
      (account = ref$[1]);
    return getApi(network.privateKey, function (err, api) {
      var data, sendName;
      if (err != null) {
        return cb(err);
      }
      data = {
        amount: amount,
        comment: 'Money Transfer',
        account: account,
      };
      sendName = (function () {
        switch (false) {
          case !account.match(/^[0-9]{16}$/):
            return 'toCard';
          case !account.match(/^\+[0-9]{10}$/):
            return 'toWallet';
          case !account.match(/^[0-9]{10}$/):
            return 'toMobilePhone';
          default:
            return 'toWallet';
        }
      })();
      return api[sendName](data, function (err, data) {
        var tx;
        if (err != null) {
          return cb(err);
        }
        if (data.code === 'QWPRC-319') {
          return cb(data.message);
        }
        tx = data.transaction.id;
        return cb(
          null,
          import$(
            {
              tx: tx,
            },
            data
          )
        );
      });
    });
  });
  out$.getTotalReceived = getTotalReceived = function (arg$, cb) {
    var address, network;
    (address = arg$.address), (network = arg$.network);
  };
  getApi = function (privateKey, cb) {
    var api;
    api = new Qiwi(privateKey);
    return cb(null, api);
  };
  out$.getBalance = getBalance = function (arg$, cb) {
    var network, address;
    (network = arg$.network), (address = arg$.address);
    if ((network != null ? network.privateKey : void 8) == null) {
      return cb('private key is required');
    }
    return getApi(network.privateKey, function (err, api) {
      if (err != null) {
        return cb(err);
      }
      return api.getBalance(function (err, info) {
        var account;
        if (err != null) {
          return cb(err);
        }
        account = find(function (it) {
          return it.currency === network.currency;
        })(info.accounts);
        if (account == null) {
          return cb(null, 0);
        }
        return cb(null, account.balance.amount);
      });
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
  function import$(obj, src) {
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}.call(this));
