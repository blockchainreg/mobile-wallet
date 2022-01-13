import commonProvider from './common/provider';

// Generated by LiveScript 1.6.0
(function () {
  var stringify,
    ref$,
    filter,
    map,
    foldl,
    each,
    plus,
    minus,
    times,
    div,
    fromHex,
    $toHex,
    get,
    post,
    Web3,
    Tx,
    BN,
    hdkey,
    bip39,
    ethToVlx,
    vlxToEth,
    jsonParse,
    deadline,
    sha3,
    bignumber,
    getEthereumFullpairByIndex,
    abi,
    getContractInstance,
    isAddress,
    getGasEstimate,
    calcFee,
    getKeys,
    toHex,
    transformTx,
    up,
    getTransactions,
    getWeb3,
    getDec,
    calcGasPrice,
    round,
    createTransaction,
    checkDecodedData,
    pushTx,
    checkTxStatus,
    getTotalReceived,
    getUnconfirmedBalance,
    getBalance,
    isValidAddress,
    tryParse,
    makeQuery,
    getTransactionInfo,
    isChecksumAddress,
    getMarketHistoryPrices,
    toString$ = {}.toString,
    out$ = (typeof exports != 'undefined' && exports) || this;
  stringify = require('qs').stringify;
  (ref$ = require('prelude-ls')),
    (filter = ref$.filter),
    (map = ref$.map),
    (foldl = ref$.foldl),
    (each = ref$.each);
  (ref$ = require('../math.js')),
    (plus = ref$.plus),
    (minus = ref$.minus),
    (times = ref$.times),
    (div = ref$.div),
    (fromHex = ref$.fromHex),
    ($toHex = ref$.$toHex);
  (ref$ = require('./superagent.js')), (get = ref$.get), (post = ref$.post);
  (ref$ = require('./deps.js')),
    (Web3 = ref$.Web3),
    (Tx = ref$.Tx),
    (BN = ref$.BN),
    (hdkey = ref$.hdkey),
    (bip39 = ref$.bip39);
  (ref$ = require('../addresses.js')),
    (ethToVlx = ref$.ethToVlx),
    (vlxToEth = ref$.vlxToEth);
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  sha3 = require('crypto-js/sha3');
  bignumber = require('bignumber.js');
  getEthereumFullpairByIndex = function (mnemonic, index, network) {
    var seed, wallet, w, address, privateKey, publicKey;
    seed = bip39.mnemonicToSeed(mnemonic);
    wallet = hdkey.fromMasterSeed(seed);
    w = wallet.derivePath("m/44'/60'/" + index + "'/0/0").getWallet();
    address = '0x' + w.getAddress().toString('hex');
    privateKey = w.getPrivateKeyString();
    publicKey = w.getPublicKeyString();
    return {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey,
    };
  };
  getContractInstance = commonProvider.getContractInstanceWithAbi(
    commonProvider.ABI
  );
  isAddress = function (address) {
    if (address.startsWith('V')) {
      address = vlxToEth(address);
    }
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else {
      return true;
    }
  };
  getGasEstimate = function (config, cb) {
    var network,
      feeType,
      account,
      amount,
      to,
      data,
      swap,
      dec,
      from,
      web3,
      contract,
      receiver,
      val,
      value,
      $data,
      query;
    (network = config.network),
      (feeType = config.feeType),
      (account = config.account),
      (amount = config.amount),
      (to = config.to),
      (data = config.data),
      (swap = config.swap);
    if (+amount === 0) {
      return cb(null, '0');
    }
    dec = getDec(network);
    from = account.address;
    web3 = getWeb3(network);
    contract = getContractInstance(web3, network.address);
    receiver = (function () {
      switch (false) {
        case !(data != null && data !== '0x'):
          return to;
        default:
          return network.address;
      }
    })();
    val = times(amount, dec);
    value = $toHex(val);
    $data = (function () {
      switch (false) {
        case !(data != null && data !== '0x'):
          return data;
        case contract.methods == null:
          return contract.methods.transfer(to, value).encodeABI();
        default:
          return contract.transfer.getData(to, value);
      }
    })();
    query = {
      from: from,
      to: receiver,
      data: $data,
      value: '0x0',
    };
    return makeQuery(
      network,
      'eth_estimateGas',
      [query],
      function (err, estimate) {
        if (err != null) {
          console.error('[getGasEstimate] error:', err);
        }
        return cb(null, '1000000');
      }
    );
  };
  out$.calcFee = calcFee = function (arg$, cb) {
    var network, feeType, account, amount, to, data, gasPrice, gas, dec;
    (network = arg$.network),
      (feeType = arg$.feeType),
      (account = arg$.account),
      (amount = arg$.amount),
      (to = arg$.to),
      (data = arg$.data),
      (gasPrice = arg$.gasPrice),
      (gas = arg$.gas);
    if (feeType !== 'auto') {
      return cb(null);
    }
    dec = getDec(network);
    return calcGasPrice(
      {
        feeType: feeType,
        network: network,
        gasPrice: gasPrice,
      },
      function (err, gasPrice) {
        if (err != null) {
          return cb(err);
        }
        return getGasEstimate(
          {
            network: network,
            feeType: feeType,
            account: account,
            amount: amount,
            to: to,
            data: data,
          },
          function (err, estimate) {
            var res, val;
            if (err != null) {
              return cb(null, {
                calcedFee: network.txFee,
                gasPrice: gasPrice,
              });
            }
            res = times(gasPrice, estimate);
            val = div(res, dec);
            return cb(null, {
              calcedFee: val,
              gasPrice: gasPrice,
              gasEstimate: estimate,
            });
          }
        );
      }
    );
  };
  out$.getKeys = getKeys = function (arg$, cb) {
    var network, mnemonic, index, result;
    (network = arg$.network), (mnemonic = arg$.mnemonic), (index = arg$.index);
    result = getEthereumFullpairByIndex(mnemonic, index, network);
    return cb(null, result);
  };
  toHex = function (it) {
    return new BN(it);
  };
  transformTx = curry$(function (network, t) {
    var url, FOREIGN_BRIDGE, dec, tx, amount, time, fee, txType;
    url = network.api.url;
    FOREIGN_BRIDGE = network.FOREIGN_BRIDGE;
    dec = getDec(network);
    network = 'eth';
    tx = t.hash;
    amount = div(t.value, dec);
    time = t.timeStamp;
    url = url + '/tx/' + tx;
    fee = div(times(t.cumulativeGasUsed, t.gasPrice), dec);
    txType = (function () {
      switch (false) {
        case up(t.to) !== up(FOREIGN_BRIDGE):
          return 'EVM → ETHEREUM Swap';
        case t.from !== '0x0000000000000000000000000000000000000000':
          return 'ETHEREUM → EVM Swap';
        default:
          return null;
      }
    })();
    return {
      network: network,
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: t.from,
      to: t.to,
      txType: txType,
    };
  });
  up = function (s) {
    return (s != null ? s : '').toUpperCase();
  };
  out$.getTransactions = getTransactions = function (arg$, cb) {
    var network,
      address,
      apiUrl,
      module,
      action,
      startblock,
      endblock,
      sort,
      query;
    (network = arg$.network), (address = arg$.address);
    apiUrl = network.api.apiUrl;
    module = 'account';
    action = 'tokentx';
    startblock = 0;
    endblock = 99999999;
    sort = 'asc';
    query = stringify({
      module: module,
      action: action,
      address: address,
      //      sort: sort,
      //      startblock: startblock,
      //      endblock: endblock
    });
    return get(apiUrl + '?' + query)
      .timeout({
        deadline: deadline,
      })
      .end(function (err, resp) {
        if (err != null) {
          return cb(err);
        }
        return jsonParse(resp.text, function (err, result) {
          var txs;
          if (err != null) {
            return cb(err);
          }
          if (
            toString$
              .call(result != null ? result.result : void 8)
              .slice(8, -1) !== 'Array'
          ) {
            return cb('Unexpected result');
          }
          txs = map(transformTx(network))(
            filter(function (it) {
              return up(it.contractAddress) === up(network.address);
            })(result.result)
          );
          return cb(null, txs);
        });
      });
  };
  getWeb3 = commonProvider.getWeb3;
  getDec = commonProvider.getDec;
  out$.calcGasPrice = calcGasPrice = function (arg$, cb) {
    var feeType, network, gasPrice, swap;
    (feeType = arg$.feeType),
      (network = arg$.network),
      (gasPrice = arg$.gasPrice),
      (swap = arg$.swap);
    if (gasPrice != null) {
      return cb(null, gasPrice);
    }
    return makeQuery(network, 'eth_gasPrice', [], function (err, price) {
      var ref$;
      if (err != null) {
        return cb(
          'calc gas price - err: ' + ((ref$ = err.message) != null ? ref$ : err)
        );
      }
      price = fromHex(price);
      return cb(null, price);
    });
  };
  round = function (num) {
    return Math.round(+num);
  };
  out$.createTransaction = createTransaction = curry$(function (arg$, cb) {
    var network,
      account,
      recipient,
      amount,
      amountFee,
      feeType,
      gasPrice,
      txType,
      data,
      web3,
      dec,
      privateKey,
      from;
    (network = arg$.network),
      (account = arg$.account),
      (recipient = arg$.recipient),
      (amount = arg$.amount),
      (amountFee = arg$.amountFee),
      (feeType = arg$.feeType),
      (gasPrice = arg$.gasPrice),
      (txType = arg$.txType),
      (data = arg$.data);
    if (!isAddress(recipient)) {
      return cb('address in not correct ethereum address');
    }
    web3 = getWeb3(network);
    dec = getDec(network);
    privateKey = new Buffer(account.privateKey.replace(/^0x/, ''), 'hex');
    from = account.address;
    return web3.eth.getTransactionCount(from, 'pending', function (err, nonce) {
      var contract, toWei, toWeiEth, toEth, value;
      if (err != null) {
        return cb(err);
      }
      if (nonce == null) {
        return cb('nonce is required');
      }
      contract = getContractInstance(web3, network.address);
      toWei = function (it) {
        return times(it, dec);
      };
      toWeiEth = function (it) {
        return times(it, Math.pow(10, 18));
      };
      toEth = function (it) {
        return div(it, Math.pow(10, 18));
      };
      value = toWei(amount);
      return calcGasPrice(
        {
          feeType: feeType,
          network: network,
          gasPrice: gasPrice,
        },
        function (err, gasPrice) {
          if (err != null) {
            return cb(err);
          }
          return getGasEstimate(
            {
              network: network,
              feeType: feeType,
              account: account,
              amount: amount,
              to: recipient,
              data: data,
            },
            function (err, gasEstimate) {
              var onePercent, $gasEstimate, res, gasPrice;
              if (err != null) {
                return cb(err);
              }
              onePercent = times(gasEstimate, '0.01');
              $gasEstimate = plus(gasEstimate, onePercent);
              res = $gasEstimate.split('.');
              $gasEstimate = (function () {
                switch (false) {
                  case res.length !== 2:
                    return res[0];
                  default:
                    return $gasEstimate;
                }
              })();
              if (feeType === 'custom' || !gasPrice) {
                gasPrice = div(times(amountFee, dec), gasEstimate);
                gasPrice = new bignumber(gasPrice).toFixed(0);
              }
              if (
                toString$.call(web3.eth.getBalance).slice(8, -1) !== 'Function'
              ) {
                return cb('getBalance is not a function');
              }
              return commonProvider.web3EthGetBalance(
                from,
                network,
                function (err, balance) {
                  var balanceEth;
                  if (err != null) {
                    return cb(err);
                  }
                  balanceEth = toEth(balance);
                  if (+balanceEth < +amountFee) {
                    return cb(
                      'Velas Evm balance (' +
                        balanceEth +
                        ') is not enough to send tx'
                    );
                  }
                  return getBalance(
                    {
                      network: network,
                      address: from,
                    },
                    function (err, ercBalance) {
                      if (err != null) {
                        return cb(err);
                      }
                      if (+ercBalance < +amount) {
                        return cb('Balance is not enough to send this amount');
                      }
                      return makeQuery(
                        network,
                        'eth_chainId',
                        [],
                        function (err, chainId) {
                          var $data, $recipient, tx, rawtx;
                          if (err != null) {
                            return cb(err);
                          }
                          $data = (function () {
                            switch (false) {
                              case !(data != null && data !== '0x'):
                                return data;
                              case contract.methods == null:
                                return contract.methods
                                  .transfer(recipient, value)
                                  .encodeABI();
                              default:
                                return contract.transfer.getData(
                                  recipient,
                                  value
                                );
                            }
                          })();
                          $recipient = (function () {
                            switch (false) {
                              case !(data != null && data !== '0x'):
                                return recipient;
                              default:
                                return network.address;
                            }
                          })();
                          tx = new Tx({
                            nonce: toHex(nonce),
                            gasPrice: toHex(gasPrice),
                            value: toHex('0'),
                            gas: toHex($gasEstimate),
                            to: $recipient,
                            from: from,
                            data: $data || '0x',
                            chainId: chainId,
                          });
                          tx.sign(privateKey);
                          rawtx = '0x' + tx.serialize().toString('hex');
                          return cb(null, {
                            rawtx: rawtx,
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
  out$.checkDecodedData = checkDecodedData = function (decodedData, data) {
    if (!(decodedData != null ? decodedData : '').length === 0) {
      return false;
    }
    if (!(data != null ? data : '').length === 0) {
      return false;
    }
  };
  out$.pushTx = pushTx = curry$(function (arg$, cb) {
    var network, rawtx, web3, send, ref$;
    (network = arg$.network), (rawtx = arg$.rawtx);
    web3 = getWeb3(network);
    send =
      (ref$ = web3.eth.sendRawTransaction) != null
        ? ref$
        : web3.eth.sendSignedTransaction;
    return send(rawtx, function (err, txid) {
      return cb(err, txid);
    });
  });
  out$.checkTxStatus = checkTxStatus = function (arg$, cb) {
    var network, tx;
    (network = arg$.network), (tx = arg$.tx);
    return cb('Not Implemented');
  };
  out$.getTotalReceived = getTotalReceived = function (arg$, cb) {
    var address, network;
    (address = arg$.address), (network = arg$.network);
    return getTransactions(
      {
        address: address,
        network: network,
      },
      function (err, txs) {
        var total;
        total = foldl(
          plus,
          0
        )(
          map(function (it) {
            return it.amount;
          })(
            filter(function (it) {
              return it.to.toUpperCase() === address.toUpperCase();
            })(txs)
          )
        );
        return cb(null, total);
      }
    );
  };
  out$.getUnconfirmedBalance = getUnconfirmedBalance = function (arg$, cb) {
    var network, address;
    (network = arg$.network), (address = arg$.address);
    return cb('Not Implemented');
  };
  out$.getBalance = getBalance = commonProvider.getBalance;
  out$.isValidAddress = isValidAddress = function (arg$, cb) {
    var address, network, e, valid;
    (address = arg$.address), (network = arg$.network);
    if (address.startsWith('V')) {
      try {
        address = vlxToEth(address);
      } catch (e$) {
        e = e$;
        return cb('Address is not valid');
      }
    }
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return cb('Address is not valid');
    } else {
      valid = isChecksumAddress(address);
      if (!valid) {
        return cb('Address is not valid');
      }
    }
    return cb(null, true);
  };
  makeQuery = commonProvider.makeQuery;
  out$.getTransactionInfo = getTransactionInfo = function (config, cb) {
    var network, tx, query;
    (network = config.network), (tx = config.tx);
    query = [tx];
    return makeQuery(
      network,
      'eth_getTransactionReceipt',
      query,
      function (err, tx) {
        var status, result;
        if (err != null) {
          return cb(err);
        }
        status = (function () {
          switch (false) {
            case toString$.call(tx).slice(8, -1) === 'Object':
              return 'pending';
            case tx.status !== '0x0':
              return 'reverted';
            case tx.status !== '0x1':
              return 'confirmed';
            default:
              return 'pending';
          }
        })();
        result = {
          from: tx != null ? tx.from : void 8,
          to: tx != null ? tx.to : void 8,
          status: status,
          info: tx,
        };
        return cb(null, result);
      }
    );
  };
  isChecksumAddress = function (address) {
    var addressHash, i;
    address = address.replace('0x', '');
    addressHash = sha3(address.toLowerCase());
    i = 0;
    while (i < 40) {
      if (
        (parseInt(addressHash[i], 16) > 7 &&
          address[i].toUpperCase() !== address[i]) ||
        (parseInt(addressHash[i], 16) <= 7 &&
          address[i].toLowerCase() !== address[i])
      ) {
        return false;
      }
      i++;
    }
    return true;
  };
  out$.getMarketHistoryPrices = getMarketHistoryPrices = function (config, cb) {
    var network, coin, market;
    (network = config.network), (coin = config.coin);
    market = coin.market;
    return get(market)
      .timeout({
        deadline: deadline,
      })
      .end(function (err, resp) {
        var ref$;
        if (err != null) {
          return cb(
            'cannot execute query - err ' +
              ((ref$ = err.message) != null ? ref$ : err)
          );
        }
        return jsonParse(resp.text, function (err, result) {
          if (err != null) {
            return cb(err);
          }
          return cb(null, result);
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
}.call(this));
