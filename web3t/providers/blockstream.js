// Generated by LiveScript 1.6.0
(function () {
  var moment,
    ref$,
    map,
    foldl,
    any,
    each,
    find,
    sum,
    filter,
    head,
    values,
    join,
    get,
    post,
    plus,
    minus,
    div,
    times,
    BitcoinLib,
    bip39,
    jsonParse,
    deadline,
    decode,
    segwitAddress,
    segwitAddress2,
    getBitcoinFullpairByIndex,
    findMax,
    getEnough,
    calcFeePerByte,
    calcDynamicFee,
    getCalcFeeFunc,
    calcFeePrivate,
    calcFeeInstantx,
    calcFee,
    getKeys,
    extend,
    getDec,
    getOutputs,
    parseRateString,
    extractVal,
    parseResult,
    addOutputs,
    getError,
    createTransaction,
    pushTx,
    getTotalReceived,
    getUnconfirmedBalance,
    getBalance,
    incomingVout,
    outcomingVouts,
    transformIn,
    transformOut,
    transformTx,
    getApiUrl,
    checkTxStatus,
    getTransactions,
    slice$ = [].slice,
    toString$ = {}.toString,
    out$ = (typeof exports != 'undefined' && exports) || this;
  moment = require('moment');
  (ref$ = require('prelude-ls')),
    (map = ref$.map),
    (foldl = ref$.foldl),
    (any = ref$.any),
    (each = ref$.each),
    (find = ref$.find),
    (sum = ref$.sum),
    (filter = ref$.filter),
    (head = ref$.head),
    (values = ref$.values),
    (join = ref$.join);
  (ref$ = require('./superagent.js')), (get = ref$.get), (post = ref$.post);
  (ref$ = require('../math.js')),
    (plus = ref$.plus),
    (minus = ref$.minus),
    (div = ref$.div),
    (times = ref$.times);
  (ref$ = require('./deps.js')),
    (BitcoinLib = ref$.BitcoinLib),
    (bip39 = ref$.bip39);
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  decode = require('bs58').decode;
  segwitAddress = function (publicKey) {
    var witnessScript, scriptPubKey;
    witnessScript = BitcoinLib.script.witnessPubKeyHash.output.encode(
      BitcoinLib.crypto.hash160(publicKey)
    );
    scriptPubKey = BitcoinLib.script.scriptHash.output.encode(
      BitcoinLib.crypto.hash160(witnessScript)
    );
    return BitcoinLib.address.fromOutputScript(scriptPubKey);
  };
  segwitAddress2 = function (publicKey) {
    var scriptPubKey;
    scriptPubKey = BitcoinLib.script.witnessPubKeyHash.output.encode(
      BitcoinLib.crypto.hash160(publicKey)
    );
    return BitcoinLib.address.fromOutputScript(scriptPubKey);
  };
  getBitcoinFullpairByIndex = function (mnemonic, index, network) {
    var seed, hdnode, address, privateKey, publicKey;
    seed = bip39.mnemonicToSeedHex(mnemonic);
    hdnode = BitcoinLib.HDNode.fromSeedHex(seed, network).derive(index);
    address = hdnode.getAddress();
    privateKey = hdnode.keyPair.toWIF();
    publicKey = hdnode.getPublicKeyBuffer().toString('hex');
    return {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey,
    };
  };
  findMax = function (first, current) {
    if (current.rank < first.rank) {
      return current;
    } else {
      return first;
    }
  };
  getEnough = function (arg$, amount, youHave, cb) {
    var output, outputs, outputAmount, ref$, nextAmount, youHaveNext;
    (output = arg$[0]), (outputs = slice$.call(arg$, 1));
    if (output == null) {
      return cb('Not Enough Funds (Unspent Outputs). You have ' + youHave);
    }
    if (output.value == null) {
      return cb('Expected output value, got ' + output.value);
    }
    outputAmount = div(
      (ref$ = output.value) != null ? ref$ : 0,
      getDec(output.network)
    );
    nextAmount = minus(amount, outputAmount);
    if (+nextAmount <= 0) {
      return cb(null, [output]);
    }
    youHaveNext = plus(youHave, outputAmount);
    return getEnough(outputs, nextAmount, youHaveNext, function (err, other) {
      var current, all;
      if (err != null) {
        return cb(err);
      }
      current = (function () {
        switch (false) {
          case +outputAmount !== 0:
            return [];
          default:
            return [output];
        }
      })();
      all = current.concat(other);
      return cb(null, all);
    });
  };
  calcFeePerByte = function (config, cb) {
    var network, tx, txType, account, feeType, to, o, txFee, ref$;
    (network = config.network),
      (tx = config.tx),
      (txType = config.txType),
      (account = config.account),
      (feeType = config.feeType),
      (account = config.account),
      (to = config.to);
    o = network != null ? network.txFeeOptions : void 8;
    txFee =
      (ref$ = o != null ? o[feeType] : void 8) != null
        ? ref$
        : (ref$ = network.txFee) != null
        ? ref$
        : 0;
    if (feeType !== 'auto') {
      return cb(null, txFee);
    }
    return get(getApiUrl(network) + '/fee-estimates')
      .timeout({
        deadline: deadline,
      })
      .end(function (err, data) {
        var feePerByte;
        if (err != null) {
          return cb(err);
        }
        feePerByte = data.body[6];
        return createTransaction(
          import$(
            {
              feeType: feeType,
              amountFee: 0,
              recipient: to || account.address,
            },
            config
          ),
          function (err, data) {
            var bytes, infelicity, calcFee;
            if ((err + '').indexOf('Not Enough Funds (Unspent Outputs)') > -1) {
              return cb(null, o != null ? o.cheap : void 8);
            }
            if (err != null) {
              return cb(err, o != null ? o.cheap : void 8);
            }
            if (toString$.call(data.rawtx).slice(8, -1) !== 'String') {
              return cb('rawtx is expected');
            }
            bytes = data.rawtx.length / 2;
            infelicity = 1;
            calcFee = times(bytes + infelicity, feePerByte);
            return cb(null, div(calcFee, getDec(network)));
          }
        );
      });
  };
  calcDynamicFee = function (arg$, cb) {
    var network, tx, txType, account, feeType, o, txFee, ref$;
    (network = arg$.network),
      (tx = arg$.tx),
      (txType = arg$.txType),
      (account = arg$.account),
      (feeType = arg$.feeType);
    o = network != null ? network.txFeeOptions : void 8;
    txFee =
      (ref$ = o != null ? o[feeType] : void 8) != null
        ? ref$
        : (ref$ = network.txFee) != null
        ? ref$
        : 0;
    if (feeType !== 'auto') {
      return cb(null, txFee);
    }
    return get(getApiUrl(network) + '/fee-estimates')
      .timeout({
        deadline: deadline,
      })
      .end(function (err, data) {
        var val, exists, calcedFee;
        if (err != null) {
          return cb(err);
        }
        val = data.body[6];
        exists = val != null ? val : -1;
        calcedFee = (function () {
          switch (false) {
            case val !== -1:
              return network.txFee;
            default:
              return div(val, getDec(network));
          }
        })();
        return cb(null, calcedFee);
      });
  };
  getCalcFeeFunc = function (network) {
    switch (false) {
      case (network != null ? network.txFeeAutoMode : void 8) !== 'per-byte':
        return calcFeePerByte;
      default:
        return calcDynamicFee;
    }
  };
  calcFeePrivate = function (config, cb) {
    var network, tx, txType, account, feeType, ref$, o, calcFee;
    (network = config.network),
      (tx = config.tx),
      (txType = config.txType),
      (account = config.account),
      (feeType = config.feeType);
    if (
      ((ref$ = account != null ? account.address : void 8) != null
        ? ref$
        : '') === ''
    ) {
      return cb('address cannot be empty');
    }
    o = network != null ? network.txFeeOptions : void 8;
    calcFee = getCalcFeeFunc(network);
    return calcFee(config, function (err, txFee) {
      if (err != null) {
        return cb(err);
      }
      return getOutputs(
        {
          network: network,
          address: account.address,
        },
        function (err, outputs) {
          var numberOfInputs, fee;
          if (err != null) {
            return cb(err);
          }
          numberOfInputs = outputs.length > 0 ? outputs.length : 1;
          if (o.privatePerInput == null) {
            return cb('private-per-input is missing');
          }
          fee = plus(times(txFee, 2), times(numberOfInputs, o.privatePerInput));
          return cb(null, fee);
        }
      );
    });
  };
  calcFeeInstantx = function (arg$, cb) {
    var network, tx, txType, account, feeType, ref$, o, calcFee;
    (network = arg$.network),
      (tx = arg$.tx),
      (txType = arg$.txType),
      (account = arg$.account),
      (feeType = arg$.feeType);
    if (
      ((ref$ = account != null ? account.address : void 8) != null
        ? ref$
        : '') === ''
    ) {
      return cb('address cannot be empty');
    }
    o = network != null ? network.txFeeOptions : void 8;
    calcFee = getCalcFeeFunc(network);
    return calcFee(
      {
        network: network,
        tx: tx,
        txType: txType,
        account: account,
        feeType: feeType,
      },
      function (err, txFee) {
        if (err != null) {
          return cb(err);
        }
        return getOutputs(
          {
            network: network,
            address: account.address,
          },
          function (err, outputs) {
            var numberOfInputs, fee;
            if (err != null) {
              return cb(err);
            }
            numberOfInputs = outputs.length > 0 ? outputs.length : 1;
            if (o.instantPerInput == null) {
              return cb('instant-per-input is missing');
            }
            fee = times(numberOfInputs, o.instantPerInput);
            return cb(null, fee);
          }
        );
      }
    );
  };
  out$.calcFee = calcFee = function (config, cb) {
    var network, tx, txType, account, calcFee;
    (network = config.network),
      (tx = config.tx),
      (txType = config.txType),
      (account = config.account);
    if (txType === 'private') {
      return calcFeePrivate(config, cb);
    }
    if (txType === 'instant') {
      return calcFeeInstantx(config, cb);
    }
    calcFee = getCalcFeeFunc(network);
    return calcFee(config, cb);
  };
  out$.getKeys = getKeys = function (arg$, cb) {
    var network, mnemonic, index, result;
    (network = arg$.network), (mnemonic = arg$.mnemonic), (index = arg$.index);
    result = getBitcoinFullpairByIndex(mnemonic, index, network);
    return cb(null, result);
  };
  extend = curry$(function (add, json) {
    return import$(json, add);
  });
  getDec = function (network) {
    var decimals;
    decimals = network.decimals;
    return Math.pow(10, decimals);
  };
  getOutputs = curry$(function (arg$, cb) {
    var network, address, url, requestUrl;
    (network = arg$.network), (address = arg$.address);
    url = network.api.url;
    requestUrl = getApiUrl(network) + '/address/' + address + '/utxo';
    return get(requestUrl)
      .timeout({
        deadline: deadline,
      })
      .end(function (err, data) {
        var ref$;
        if (err != null) {
          return cb(
            'cannot get outputs - err ' +
              ((ref$ = err.message) != null ? ref$ : err)
          );
        }
        return (function (it) {
          return cb(null, it);
        })(
          map(
            extend({
              network: network,
              address: address,
            })
          )(
            filter(function (it) {
              return it.value != null;
            })(data.body)
          )
        );
      });
  });
  parseRateString = function (usdInfo) {
    var ref$, _, url, extract;
    (ref$ = usdInfo.match(/url\(([^)]+)\)(.+)?/)),
      (_ = ref$[0]),
      (url = ref$[1]),
      (extract = ref$[2]);
    return {
      url: url,
      extract: extract,
    };
  };
  extractVal = function (data, arg$) {
    var head, tail;
    (head = arg$[0]), (tail = slice$.call(arg$, 1));
    if (head == null) {
      return data;
    }
    return extractVal(data[head], tail);
  };
  parseResult = function (text, extract, cb) {
    if ((extract != null ? extract : '') === '') {
      return cb(null, text);
    }
    return jsonParse(text, function (err, model) {
      var result;
      if (err != null) {
        return cb(err);
      }
      result = extractVal(model, extract);
      return cb(null, result);
    });
  };
  addOutputs = function (config, cb) {
    var txType, total, value, fee, tx, recipient, account, rest;
    (txType = config.txType),
      (total = config.total),
      (value = config.value),
      (fee = config.fee),
      (tx = config.tx),
      (recipient = config.recipient),
      (account = config.account);
    if (fee == null || value == null || total == null) {
      return cb('fee, value, total are required');
    }
    rest = minus(minus(total, value), fee);
    tx.addOutput(recipient, +value);
    if (+rest !== 0) {
      tx.addOutput(account.address, +rest);
    }
    return cb(null);
  };
  getError = function (config, fields) {
    var result;
    result = join(', ')(
      map(function (it) {
        return it + ' is required field';
      })(
        filter(function (it) {
          return config[it] == null;
        })(fields)
      )
    );
    if (result === '') {
      return null;
    }
    return result;
  };
  out$.createTransaction = createTransaction = function (config, cb) {
    var err, network, account, recipient, amount, amountFee, feeType, txType;
    err = getError(config, [
      'network',
      'account',
      'amount',
      'amountFee',
      'recipient',
    ]);
    if (err != null) {
      return cb(err);
    }
    (network = config.network),
      (account = config.account),
      (recipient = config.recipient),
      (amount = config.amount),
      (amountFee = config.amountFee),
      (feeType = config.feeType),
      (txType = config.txType);
    return getOutputs(
      {
        network: network,
        address: account.address,
      },
      function (err, outputs) {
        var amountWithFee;
        if (err != null) {
          return cb(err);
        }
        amountWithFee = plus(amount, amountFee);
        return getEnough(outputs, amountWithFee, 0, function (err, outputs) {
          var isNoValue, dec, value, fee, total, tx;
          if (err != null) {
            return cb(err);
          }
          isNoValue = find(function (it) {
            return it.value == null;
          })(outputs);
          if (isNoValue) {
            return cb('Each output should have a value');
          }
          dec = getDec(network);
          value = times(amount, dec);
          fee = times(amountFee, dec);
          total = sum(
            map(function (it) {
              return it.value;
            })(outputs)
          );
          if (+minus(minus(total, fee), value) < 0) {
            return cb('Balance is not enough to send tx');
          }
          if (isNaN(total)) {
            return cb('Total is NaN');
          }
          tx = new BitcoinLib.TransactionBuilder(network);
          return addOutputs(
            {
              txType: txType,
              total: total,
              value: value,
              fee: fee,
              tx: tx,
              recipient: recipient,
              network: network,
              account: account,
            },
            function (err) {
              var apply, sign, rawtx;
              if (err != null) {
                return cb(err);
              }
              apply = function (output, i) {
                return tx.addInput(output.txid, output.vout);
              };
              sign = function (output, i) {
                var key;
                key = BitcoinLib.ECPair.fromWIF(account.privateKey, network);
                return tx.sign(i, key);
              };
              outputs.forEach(apply);
              outputs.forEach(sign);
              rawtx = tx.build().toHex();
              return cb(null, {
                rawtx: rawtx,
              });
            }
          );
        });
      }
    );
  };
  out$.pushTx = pushTx = curry$(function (arg$, cb) {
    var network, rawtx, txType, sendType;
    (network = arg$.network), (rawtx = arg$.rawtx), (txType = arg$.txType);
    sendType = (function () {
      switch (false) {
        case txType !== 'instant':
          return 'sendix';
        default:
          return 'send';
      }
    })();
    return post(getApiUrl(network) + '/tx', rawtx).end(function (err, res) {
      var ref$;
      if (err != null) {
        return cb(err + ': ' + (res != null ? res.text : void 8));
      }
      return cb(null, (ref$ = res.body) != null ? ref$.txid : void 8);
    });
  });
  out$.getTotalReceived = getTotalReceived = function (arg$, cb) {
    var address, network, ref$;
    (address = arg$.address), (network = arg$.network);
    if (
      (network != null
        ? (ref$ = network.api) != null
          ? ref$.url
          : void 8
        : void 8) == null
    ) {
      return cb('Url is not defined');
    }
    return get(getApiUrl(network) + '/addr/' + address + '/totalReceived')
      .timeout({
        deadline: deadline,
      })
      .end(function (err, data) {
        var dec, num;
        if (err != null || data.text.length === 0) {
          return cb(err);
        }
        dec = getDec(network);
        num = div(data.text, dec);
        return cb(null, num);
      });
  };
  out$.getUnconfirmedBalance = getUnconfirmedBalance = function (arg$, cb) {
    var network, address, ref$;
    (network = arg$.network), (address = arg$.address);
    if (
      (network != null
        ? (ref$ = network.api) != null
          ? ref$.url
          : void 8
        : void 8) == null
    ) {
      return cb('Url is not defined');
    }
    return get(getApiUrl(network) + '/address/' + address)
      .timeout({
        deadline: deadline,
      })
      .end(function (err, data) {
        var dec, num;
        if (err != null || data.text.length === 0) {
          return cb(err);
        }
        dec = getDec(network);
        num = div(data.text, dec);
        return cb(null, num);
      });
  };
  out$.getBalance = getBalance = function (arg$, cb) {
    var address, network, ref$;
    (address = arg$.address), (network = arg$.network);
    if (
      (network != null
        ? (ref$ = network.api) != null
          ? ref$.url
          : void 8
        : void 8) == null
    ) {
      return cb('Url is not defined');
    }
    return get(getApiUrl(network) + '/address/' + address)
      .timeout({
        deadline: deadline,
      })
      .end(function (err, data) {
        var dec, num;
        if (err != null) {
          return cb(err);
        }
        if (!data || !data.text || !data.body || !data.body.chain_stats) {
          return cb('Invalid blockstream balance response');
        }
        dec = getDec(network);
        num = div(data.body.chain_stats.funded_txo_sum, dec);
        return cb(null, num);
      });
  };
  incomingVout = curry$(function (address, vout) {
    var addr;
    addr = vout.scriptpubkey_address;
    return addr === address;
  });
  outcomingVouts = curry$(function (address, vout) {
    var addr;
    addr = vout.scriptpubkey_address;
    if (!addr) {
      return null;
    }
    if (addr !== address) {
      return {
        value: vout.value,
        address: addr,
      };
    }
    return null;
  });
  transformIn = function (arg$, t) {
    var net,
      address,
      tx,
      time,
      fee,
      ref$,
      vout,
      pending,
      dec,
      unspend,
      amount,
      to,
      from,
      url;
    (net = arg$.net), (address = arg$.address);
    tx = t.txid;
    time = t.status.block_time;
    fee = (ref$ = t.fee) != null ? ref$ : 0;
    vout = (ref$ = t.vout) != null ? ref$ : [];
    pending = t.status.confirmed ? 0 : 1;
    dec = getDec(net);
    unspend = head(filter(incomingVout(address))(vout));
    amount = (unspend != null ? unspend.value : void 8) || 0;
    amount = div(amount, dec);
    fee = div(fee, dec);
    to = address;
    from = (function () {
      switch (false) {
        case toString$.call(t.vin).slice(8, -1) !== 'Array':
          return t.vin.map(function (it) {
            return it.prevout.scriptpubkey_address;
          });
        default:
          return t.vin.addr;
      }
    })();
    from = from[0];
    url = net.api.url + '/tx/' + tx;
    return {
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      to: to,
      from: from,
      pending: pending,
    };
  };
  transformOut = function (arg$, t) {
    var net,
      address,
      tx,
      time,
      fee,
      ref$,
      vout,
      pending,
      outcoming,
      amount,
      dec,
      to,
      from,
      url;
    (net = arg$.net), (address = arg$.address);
    tx = t.txid;
    time = t.status.block_time;
    fee = (ref$ = t.fee) != null ? ref$ : 0;
    vout = (ref$ = t.vout) != null ? ref$ : [];
    pending = t.confirmations === 0;
    outcoming = filter(function (it) {
      return it != null;
    })(map(outcomingVouts(address))(vout));
    amount = foldl(
      plus,
      0
    )(
      map(function (it) {
        return it.value;
      })(outcoming)
    );
    dec = getDec(net);
    amount = div(amount, dec);
    fee = div(fee, dec);
    to = outcoming
      .map(function (it) {
        return it.address;
      })
      .join(',');
    to = to[0];
    from = address;
    url = net.api.url + '/tx/' + tx;
    return {
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      to: to,
      pending: pending,
      from: from,
    };
  };
  transformTx = curry$(function (config, t) {
    var selfSender, ref$;
    selfSender = find(function (it) {
      return it.prevout && it.prevout.scriptpubkey_address === config.address;
    })((ref$ = t.vin) != null ? ref$ : []);
    if (selfSender == null) {
      return transformIn(config, t);
    }
    return transformOut(config, t);
  });
  getApiUrl = function (network) {
    var apiName, ref$;
    apiName = (ref$ = network.api.apiName) != null ? ref$ : 'api';
    return network.api.url + '/' + apiName;
  };
  out$.checkTxStatus = checkTxStatus = function (arg$, cb) {
    var network, tx;
    (network = arg$.network), (tx = arg$.tx);
    return cb('Not Implemented');
  };
  out$.getTransactions = getTransactions = function (arg$, cb) {
    var network, address, ref$;
    (network = arg$.network), (address = arg$.address);
    if (
      (network != null
        ? (ref$ = network.api) != null
          ? ref$.url
          : void 8
        : void 8) == null
    ) {
      return cb('Url is not defined');
    }
    return get(getApiUrl(network) + '/address/' + address + '/txs')
      .timeout({
        deadline: 15000,
      })
      .end(function (err, data) {
        if (err != null) {
          return cb(err);
        }
        return jsonParse(data.text, function (err, result) {
          var txs;
          if (err != null) {
            return cb(err);
          }
          if (toString$.call(result).slice(8, -1) !== 'Array') {
            return cb('Unexpected result');
          }
          txs = filter(function (it) {
            return it != null;
          })(
            map(
              transformTx({
                net: network,
                address: address,
              })
            )(result)
          );
          return cb(null, txs);
        });
      });
  };
  function import$(obj, src) {
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
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
