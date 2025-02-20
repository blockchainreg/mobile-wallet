// Generated by LiveScript 1.6.0
(function () {
  var superagent,
    ref$,
    map,
    find,
    split,
    div,
    times,
    plus,
    minus,
    moment,
    buildRequest,
    buildCreateUser,
    buildObtainToken,
    buildRefreshToken,
    buildGetBalance,
    buildAccountInfo,
    buildWithdrawal,
    buildCancelWithdrawal,
    buildRepeatWithdrawal,
    buildExchange,
    buildOrderHistory,
    buildOrderDetails,
    getApi,
    calcFee,
    getKeys,
    transformTx,
    getTransactions,
    getDec,
    createTransaction,
    pushTx,
    getTotalReceived,
    getBalance,
    toString$ = {}.toString,
    out$ = (typeof exports != 'undefined' && exports) || this;
  superagent = require('superagent');
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
  buildRequest = function (privateKey, cb) {
    var baseUrl, post, get;
    baseUrl = 'https://coinpay.org.ua/api/v1';
    post = function (url, data, cb) {
      return superagent
        .post(baseUrl + '/' + url, data)
        .set(
          'X-CSRFToken',
          'sbo79kBAedsRgp1BgPFJUrkqgklYaybnVXB4hxHa8iZXqojg7Vt3JBMBMZ3LjcMw'
        )
        .set('Authorization', 'Bearer ' + privateKey)
        .end(function (err, res) {
          if (err != null) {
            return cb(err);
          }
          if (res.status !== 201) {
            return cb(res.data);
          }
          return cb(null, res.data);
        });
    };
    get = function (url, data, cb) {
      return superagent
        .get(baseUrl + '/' + url)
        .set(
          'X-CSRFToken',
          'sbo79kBAedsRgp1BgPFJUrkqgklYaybnVXB4hxHa8iZXqojg7Vt3JBMBMZ3LjcMw'
        )
        .set('Authorization', 'Bearer ' + privateKey)
        .end(function (err, res) {
          if (err != null) {
            return cb(err);
          }
          if (res.status !== 201) {
            return cb(res.data);
          }
          return cb(null, res.data);
        });
    };
    return cb(null, {
      post: post,
      get: get,
    });
  };
  buildCreateUser = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.password).slice(8, -1) !== 'String') {
        return cb('password is required');
      }
      if (toString$.call(data.email).slice(8, -1) !== 'String') {
        return cb('email is required');
      }
      if (toString$.call(data.username).slice(8, -1) !== 'String') {
        return cb('username is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('user/create', data, cb);
      });
    };
  };
  buildObtainToken = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.password).slice(8, -1) !== 'String') {
        return cb('password is required');
      }
      if (toString$.call(data.email).slice(8, -1) !== 'String') {
        return cb('email is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('user/obtain_token', data, cb);
      });
    };
  };
  buildRefreshToken = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.token).slice(8, -1) !== 'String') {
        return cb('token is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('user/refresh_token', data, cb);
      });
    };
  };
  buildGetBalance = function (privateKey) {
    return function (data, cb) {
      return buildRequest(privateKey, function (err, arg$) {
        var get;
        get = arg$.get;
        if (err != null) {
          return cb(err);
        }
        return get('user/balance', data, cb);
      });
    };
  };
  buildAccountInfo = function (privateKey) {
    return function (cb) {
      return buildRequest(privateKey, function (err, arg$) {
        var get;
        get = arg$.get;
        if (err != null) {
          return cb(err);
        }
        return get('user/account_info', {}, cb);
      });
    };
  };
  buildWithdrawal = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.withdrawal_type).slice(8, -1) !== 'String') {
        return cb('withdrawal_type is required');
      }
      if (toString$.call(data.wallet_to).slice(8, -1) !== 'String') {
        return cb('wallet_to is required');
      }
      if (toString$.call(data.amount).slice(8, -1) !== 'String') {
        return cb('amount is required');
      }
      if (toString$.call(data.currency).slice(8, -1) !== 'String') {
        return cb('currency is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('withdrawal', data, cb);
      });
    };
  };
  buildCancelWithdrawal = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.order_id).slice(8, -1) !== 'String') {
        return cb('order_id is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('withdrawal/cancel', data, cb);
      });
    };
  };
  buildRepeatWithdrawal = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.order_id).slice(8, -1) !== 'String') {
        return cb('order_id is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('withdrawal/repeat', data, cb);
      });
    };
  };
  buildExchange = function (privateKey) {
    return function (data, cb) {
      if (
        toString$.call(data.currency_to_get_amount).slice(8, -1) !== 'String' &&
        toString$.call(data.сurrency_to_spend_amount).slice(8, -1) !== 'String'
      ) {
        return cb(
          'either currency_to_get_amount or сurrency_to_spend_amount is required'
        );
      }
      if (toString$.call(data.currency_to_spend).slice(8, -1) !== 'String') {
        return cb('currency_to_spend is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var post;
        post = arg$.post;
        if (err != null) {
          return cb(err);
        }
        return post('exchange', data, cb);
      });
    };
  };
  buildOrderHistory = function (privateKey) {
    return function (data, cb) {
      return buildRequest(privateKey, function (err, arg$) {
        var get;
        get = arg$.get;
        if (err != null) {
          return cb(err);
        }
        return get('orders/history', data, cb);
      });
    };
  };
  buildOrderDetails = function (privateKey) {
    return function (data, cb) {
      if (toString$.call(data.order_id).slice(8, -1) !== 'String') {
        return cb('order_id is required');
      }
      return buildRequest(privateKey, function (err, arg$) {
        var get;
        get = arg$.get;
        if (err != null) {
          return cb(err);
        }
        return get('orders/details', data, cb);
      });
    };
  };
  getApi = function (privateKey, cb) {
    var createUser,
      obtainToken,
      refreshToken,
      getBalance,
      accountInfo,
      withdrawal,
      cancelWithdrawal,
      repeatWithdrawal,
      exchange,
      orderHistory,
      orderDetails;
    createUser = buildCreateUser(null);
    obtainToken = buildObtainToken(null);
    refreshToken = buildRefreshToken(null);
    getBalance = buildGetBalance(privateKey);
    accountInfo = buildAccountInfo(privateKey);
    withdrawal = buildWithdrawal(privateKey);
    cancelWithdrawal = buildCancelWithdrawal(privateKey);
    repeatWithdrawal = buildRepeatWithdrawal(privateKey);
    exchange = buildExchange(privateKey);
    orderHistory = buildOrderHistory(privateKey);
    orderDetails = buildOrderDetails(privateKey);
    return cb(null, {
      createUser: createUser,
      obtainToken: obtainToken,
      refreshToken: refreshToken,
      getBalance: getBalance,
      accountInfo: accountInfo,
      cancelWithdrawal: cancelWithdrawal,
      repeatWithdrawal: repeatWithdrawal,
      withdrawal: withdrawal,
      exchange: exchange,
      orderHistory: orderHistory,
      orderDetails: orderDetails,
    });
  };
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
