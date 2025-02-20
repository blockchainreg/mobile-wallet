// Generated by LiveScript 1.6.0
(function () {
  var ref$,
    objToPairs,
    pairsToObj,
    filter,
    minus,
    div,
    times,
    configParser,
    calcFeeOptions,
    defaultCalcFee,
    buildCalcFee,
    buildSendTransaction,
    buildGetTotalReceived,
    buildGetBalance,
    buildHumanizeAmount,
    buildUnhumanizeAmount,
    buildIsValidAddress,
    buildSendAllFunds,
    buildCreateAccount,
    buildGetHistory,
    buildPair,
    buildPairs,
    onlyEnabled,
    buildApi,
    toString$ = {}.toString,
    slice$ = [].slice;
  (ref$ = require('prelude-ls')),
    (objToPairs = ref$.objToPairs),
    (pairsToObj = ref$.pairsToObj),
    (filter = ref$.filter);
  (ref$ = require('./math.js')),
    (minus = ref$.minus),
    (div = ref$.div),
    (times = ref$.times);
  configParser = require('./config-parser.js');
  calcFeeOptions = function (network, tx, cb) {
    var feeType, txFeeOptions, option;
    feeType = tx.feeType;
    txFeeOptions = network.txFeeOptions;
    if (toString$.call(txFeeOptions).slice(8, -1) !== 'Object') {
      return cb('Expected object tx-fee-options');
    }
    if (feeType !== 'auto' && feeType !== 'cheap') {
      return cb('Expected string auto|cheap');
    }
    option = txFeeOptions[feeType];
    if (toString$.call(option).slice(8, -1) !== 'String') {
      return cb('Option is not defined');
    }
    return cb(null, option);
  };
  defaultCalcFee = function (network, tx, cb) {
    var feeType, txFeeOptions;
    feeType = tx.feeType;
    txFeeOptions = network.txFeeOptions;
    if (feeType != null && txFeeOptions != null) {
      return calcFeeOptions(network, tx, cb);
    }
    return cb(null, network.txFee);
  };
  buildCalcFee = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (tx, cb) {
      if (toString$.call(provider.calcFee).slice(8, -1) !== 'Function') {
        return cb(null, network.txFee);
      }
      return provider.calcFee(
        import$(
          {
            network: network,
          },
          tx
        ),
        function (err, txFee) {
          if (err != null) {
            return cb(err);
          }
          if (txFee == null) {
            return defaultCalcFee(network, tx, cb);
          }
          return cb(null, txFee);
        }
      );
    };
  };
  buildSendTransaction = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (arg$, cb) {
      var account,
        to,
        amount,
        data,
        feeType,
        spender,
        createTransaction,
        pushTx,
        calcFee;
      (account = arg$.account),
        (to = arg$.to),
        (amount = arg$.amount),
        (data = arg$.data),
        (feeType = arg$.feeType),
        (spender = arg$.spender);
      (createTransaction = provider.createTransaction),
        (pushTx = provider.pushTx);
      calcFee = buildCalcFee({
        network: network,
        provider: provider,
      });
      return calcFee(
        {
          account: account,
          to: to,
          amount: amount,
          data: data,
          feeType: feeType,
          spender: spender,
        },
        function (err, amountFee) {
          if (err != null) {
            return cb(err);
          }
          return createTransaction(
            {
              account: account,
              recipient: to,
              amount: amount,
              data: data,
              network: network,
              amountFee: amountFee,
              feeType: feeType,
              spender: spender,
            },
            function (err, data) {
              if (err != null) {
                return cb(err);
              }
              return pushTx(
                {
                  network: network,
                  rawtx: data.rawtx,
                },
                function (err, data) {
                  if (err != null) {
                    return cb(err);
                  }
                  return cb(null, data);
                }
              );
            }
          );
        }
      );
    };
  };
  buildGetTotalReceived = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (arg$, cb) {
      var account, getTotalReceived;
      account = arg$.account;
      getTotalReceived = provider.getTotalReceived;
      return getTotalReceived(
        {
          address: account.address,
          network: network,
        },
        function (err, data) {
          if (err != null) {
            return cb(err);
          }
          return cb(null, data);
        }
      );
    };
  };
  buildGetBalance = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (arg$, cb) {
      var account, getBalance;
      account = arg$.account;
      getBalance = provider.getBalance;
      return getBalance(
        {
          address: account.address,
          network: network,
        },
        function (err, data) {
          if (err != null) {
            return cb(err);
          }
          return cb(null, data);
        }
      );
    };
  };
  buildHumanizeAmount = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (value, cb) {
      var res;
      if (toString$.call(value).slice(8, -1) !== 'String') {
        return cb('value should be string');
      }
      res = div(value, Math.pow(10, network.decimals));
      return cb(null, res);
    };
  };
  buildUnhumanizeAmount = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (value, cb) {
      var res;
      if (toString$.call(value).slice(8, -1) !== 'String') {
        return cb('value should be string');
      }
      res = times(value, Math.pow(10, network.decimals));
      return cb(null, res);
    };
  };
  buildIsValidAddress = function (arg$) {
    var network, provider, token;
    (network = arg$.network), (provider = arg$.provider), (token = arg$.token);
    return function (address, cb) {
      if (toString$.call(address).slice(8, -1) !== 'String') {
        return cb('address should be string');
      }
      if (toString$.call(provider.isValidAddress).slice(8, -1) !== 'Function') {
        return cb(null, true);
      }
      return provider.isValidAddress(
        {
          address: address,
          network: network,
          token: token,
        },
        function (err, valid) {
          if (err != null) {
            return cb(err);
          }
          return cb(null, valid);
        }
      );
    };
  };
  buildSendAllFunds = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (arg$, cb) {
      var account,
        to,
        data,
        feeType,
        spender,
        sendTransaction,
        getBalance,
        calcFee;
      (account = arg$.account),
        (to = arg$.to),
        (data = arg$.data),
        (feeType = arg$.feeType),
        (spender = arg$.spender);
      sendTransaction = buildSendTransaction({
        network: network,
        provider: provider,
      });
      getBalance = buildGetBalance({
        network: network,
        provider: provider,
      });
      calcFee = buildCalcFee({
        network: network,
        provider: provider,
      });
      return getBalance(
        {
          account: account,
        },
        function (err, amount) {
          if (err != null) {
            return cb(err);
          }
          return calcFee(
            {
              account: account,
              to: to,
              amount: amount,
              data: data,
              feeType: feeType,
            },
            function (err, fee) {
              var all;
              if (err != null) {
                return cb(err);
              }
              all = minus(amount, fee);
              return sendTransaction(
                {
                  account: account,
                  to: to,
                  amount: all,
                  data: data,
                  feeType: feeType,
                  spender: spender,
                },
                cb
              );
            }
          );
        }
      );
    };
  };
  buildCreateAccount = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (arg$, cb) {
      var mnemonic, index, getKeys;
      (mnemonic = arg$.mnemonic), (index = arg$.index);
      getKeys = provider.getKeys;
      return getKeys(
        {
          mnemonic: mnemonic,
          index: index,
          network: network,
        },
        function (err, data) {
          if (err != null) {
            return cb(err);
          }
          return cb(null, data);
        }
      );
    };
  };
  buildGetHistory = function (arg$) {
    var network, provider;
    (network = arg$.network), (provider = arg$.provider);
    return function (arg$, cb) {
      var account, getTransactions;
      account = arg$.account;
      getTransactions = provider.getTransactions;
      return getTransactions(
        {
          address: account.address,
          network: network,
        },
        function (err, data) {
          if (err != null) {
            return cb(err);
          }
          return cb(null, data);
        }
      );
    };
  };
  buildPair = function (arg$, providers, config, cb) {
    var name,
      api,
      getModeFor,
      mode,
      network,
      provider,
      humanizeAmount,
      unhumanizeAmount,
      isValidAddress,
      sendTransaction,
      createAccount,
      calcFee,
      getBalance,
      getTotalReceived,
      getHistory,
      sendAllFunds,
      getNetwork,
      getConfig;
    (name = arg$[0]), (api = arg$[1]);
    if (api.enabled !== true || api.type !== 'coin') {
      return cb(null, {});
    }
    getModeFor = configParser(config).getModeFor;
    mode = getModeFor(name);
    network = api[mode];
    if (network == null) {
      return cb('Network ' + mode + ' not found for ' + name + '/' + mode);
    }
    if (network.api == null) {
      return cb('API config not found for ' + name + '/' + mode);
    }
    provider = providers[network.api.provider];
    if (provider == null) {
      return cb('Provider not found for ' + name);
    }
    humanizeAmount = buildHumanizeAmount({
      network: network,
      provider: provider,
    });
    unhumanizeAmount = buildUnhumanizeAmount({
      network: network,
      provider: provider,
    });
    isValidAddress = buildIsValidAddress({
      network: network,
      provider: provider,
    });
    sendTransaction = buildSendTransaction({
      network: network,
      provider: provider,
    });
    createAccount = buildCreateAccount({
      network: network,
      provider: provider,
    });
    calcFee = buildCalcFee({
      network: network,
      provider: provider,
    });
    getBalance = buildGetBalance({
      network: network,
      provider: provider,
    });
    getTotalReceived = buildGetTotalReceived({
      network: network,
      provider: provider,
    });
    getHistory = buildGetHistory({
      network: network,
      provider: provider,
    });
    sendAllFunds = buildSendAllFunds({
      network: network,
      provider: provider,
    });
    getNetwork = function (cb) {
      return cb(null, network);
    };
    getConfig = function () {
      return config;
    };
    return cb(null, {
      getConfig: getConfig,
      sendTransaction: sendTransaction,
      createAccount: createAccount,
      calcFee: calcFee,
      getBalance: getBalance,
      getHistory: getHistory,
      sendAllFunds: sendAllFunds,
      humanizeAmount: humanizeAmount,
      isValidAddress: isValidAddress,
      unhumanizeAmount: unhumanizeAmount,
      getTotalReceived: getTotalReceived,
      getNetwork: getNetwork,
    });
  };
  buildPairs = function (arg$, providers, config, cb) {
    var pair, rest;
    (pair = arg$[0]), (rest = slice$.call(arg$, 1));
    if (pair == null) {
      return cb(null, []);
    }
    return buildPair(pair, providers, config, function (err, item) {
      if (err != null) {
        return cb(err);
      }
      return buildPairs(rest, providers, config, function (err, rest) {
        if (err != null) {
          return cb(err);
        }
        return cb(null, [[pair[0], item]].concat(rest));
      });
    });
  };
  onlyEnabled = function (config) {
    return function (item) {
      var getModeFor, mode;
      getModeFor = configParser(config).getModeFor;
      mode = getModeFor(item[0]);
      return item[1][mode].disabled !== true;
    };
  };
  buildApi = function (coins, providers, config, cb) {
    var pairs;
    pairs = filter(onlyEnabled(config))(objToPairs(coins));
    return buildPairs(pairs, providers, config, function (err, items) {
      var result;
      if (err != null) {
        return cb(err);
      }
      result = pairsToObj(items);
      return cb(null, result);
    });
  };
  module.exports = buildApi;
  function import$(obj, src) {
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}.call(this));
