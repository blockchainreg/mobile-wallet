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
    getEthereumFullpairByIndex,
    abi,
    getContractInstance,
    isAddress,
    calcFee,
    getKeys,
    toHex,
    transformTx,
    up,
    getTransactions,
    tryParse,
    makeQuery,
    getWeb3,
    getDec,
    calcGasPrice,
    round,
    createTransaction,
    checkDecodedData,
    pushTx,
    checkTxStatus,
    getTransactionInfo,
    getTotalReceived,
    getUnconfirmedBalance,
    getBalance,
    isValidAddress,
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
    (div = ref$.div);
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
  abi = [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
        {
          name: '_spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      payable: true,
      stateMutability: 'payable',
      type: 'fallback',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ];
  getContractInstance = function (web3, addr) {
    switch (false) {
      case toString$.call(web3.eth.contract).slice(8, -1) !== 'Function':
        return web3.eth.contract(abi).at(addr);
      default:
        return new web3.eth.Contract(abi, addr);
    }
  };
  isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else {
      return true;
    }
  };
  out$.calcFee = calcFee = function (arg$, cb) {
    var network, tx, feeType, account, amount, to, data, web3;
    (network = arg$.network),
      (tx = arg$.tx),
      (feeType = arg$.feeType),
      (account = arg$.account),
      (amount = arg$.amount),
      (to = arg$.to),
      (data = arg$.data);
    if (feeType !== 'auto') {
      return cb(null);
    }
    web3 = getWeb3(network);
    return calcGasPrice(
      {
        web3: web3,
        feeType: feeType,
      },
      function (err, gasPrice) {
        var from;
        if (err != null) {
          return cb(err);
        }
        from = account.address;
        return web3.eth.estimateGas(
          {
            from: from,
            to: to,
            data: data,
          },
          function (err, estimate) {
            var dec, res, val;
            if (err != null) {
              return cb(err);
            }
            dec = getDec(network);
            res = times(gasPrice, estimate);
            val = div(res, Math.pow(10, 18));
            return cb(null, val);
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
    var url, dec, tx, amount, time, fee, txType, from;
    url = network.api.url;
    dec = getDec(network);
    network = 'eth';
    tx = t.hash;
    amount = div(t.value, dec);
    time = t.timeStamp;
    url = url + '/tx/' + tx;
    fee = (function () {
      switch (false) {
        case t.cumulativeGasUsed == null:
          return div(times(t.cumulativeGasUsed, t.gasPrice), Math.pow(10, 18));
        default:
          return div(times(t.gasUsed, t.gasPrice), Math.pow(10, 18));
      }
    })();
    txType = (function () {
      switch (false) {
        case t.from !== '0x0000000000000000000000000000000000000000':
          return 'ETHEREUM → EVM Swap';
        default:
          return null;
      }
    })();
    from = t.from;
    return {
      network: network,
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: from,
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
      sort: sort,
      startblock: startblock,
      endblock: endblock,
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
  tryParse = function (data, cb) {
    return setImmediate(function () {
      var err;
      if (toString$.call(data.body).slice(8, -1) === 'Object') {
        return cb(null, data);
      }
      if (
        toString$.call(data != null ? data.text : void 8).slice(8, -1) !==
        'String'
      ) {
        console.log(data);
      }
      if (
        toString$.call(data != null ? data.text : void 8).slice(8, -1) !==
        'String'
      ) {
        return cb('expected text');
      }
      try {
        data.body = JSON.parse(data.text);
        return cb(null, data);
      } catch (e$) {
        err = e$;
        return cb(err);
      }
    });
  };
  makeQuery = function (network, method, params, cb) {
    var web3Provider, query;
    web3Provider = network.api.web3Provider;
    query = {
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params,
    };
    return post(web3Provider, query).end(function (err, data) {
      var ref$;
      if (err != null) {
        return cb('query err: ' + ((ref$ = err.message) != null ? ref$ : err));
      }
      return tryParse(data, function (err, data) {
        var ref$;
        if (err != null) {
          return cb(err);
        }
        if (toString$.call(data.body).slice(8, -1) !== 'Object') {
          return cb('expected object');
        }
        if (((ref$ = data.body) != null ? ref$.error : void 8) != null) {
          return cb(data.body.error);
        }
        return cb(null, data.body.result);
      });
    });
  };
  getWeb3 = function (network) {
    var web3Provider;
    web3Provider = network.api.web3Provider;
    return new Web3(new Web3.providers.HttpProvider(web3Provider));
  };
  getDec = function (network) {
    var decimals;
    decimals = network.decimals;
    return Math.pow(10, decimals);
  };
  calcGasPrice = function (arg$, cb) {
    var web3, feeType;
    (web3 = arg$.web3), (feeType = arg$.feeType);
    if (feeType === 'cheap') {
      return cb(null, '3000000000');
    }
    return web3.eth.getGasPrice(cb);
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
          web3: web3,
          feeType: feeType,
        },
        function (err, gasPriceBn) {
          var gasPrice, gasMinimal, gasEstimate;
          gasPrice = gasPriceBn.toFixed();
          if (err != null) {
            return cb(err);
          }
          gasMinimal = div(toWeiEth(amountFee), gasPrice);
          gasEstimate = round(times(gasMinimal, 5));
          gasEstimate = 1000000;
          if (toString$.call(web3.eth.getBalance).slice(8, -1) !== 'Function') {
            return cb('getBalance is not a function');
          }
          return web3.eth.getBalance(from, function (err, balance) {
            var balanceEth;
            if (err != null) {
              return cb(err);
            }
            balanceEth = toEth(balance);
            if (+balanceEth < +amountFee) {
              return cb('Balance is not enough to send tx');
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
                    var $data, tx, rawtx;
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
                          return contract.transfer.getData(recipient, value);
                      }
                    })();
                    tx = new Tx({
                      nonce: toHex(nonce),
                      gasPrice: toHex(gasPrice),
                      value: toHex('0'),
                      gas: toHex(gasEstimate),
                      to: network.address,
                      from: from,
                      data: $data || '0x',
                      chainId: chainId,
                    });
                    console.log('sign');
                    tx.sign(privateKey);
                    rawtx = '0x' + tx.serialize().toString('hex');
                    return cb(null, {
                      rawtx: rawtx,
                    });
                  }
                );
              }
            );
          });
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
    console.log('push-tx');
    return send(rawtx, function (err, txid) {
      console.log({
        err: err,
        txid: txid,
      });
      return cb(err, txid);
    });
  });
  out$.checkTxStatus = checkTxStatus = function (arg$, cb) {
    var network, tx;
    (network = arg$.network), (tx = arg$.tx);
    return cb('Not Implemented');
  };
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
  out$.getBalance = getBalance = function (arg$, cb) {
    var network, address, web3, contract, balanceOf;
    (network = arg$.network), (address = arg$.address);
    web3 = getWeb3(network);
    contract = getContractInstance(web3, network.address);
    balanceOf = (function () {
      switch (false) {
        case contract.methods == null:
          return function (address, cb) {
            return contract.methods.balanceOf(address).call(cb);
          };
        default:
          return function (address, cb) {
            return contract.balanceOf(address, cb);
          };
      }
    })();
    return balanceOf(address, function (err, number) {
      var dec, balance;
      if (err != null) {
        return cb(err);
      }
      dec = getDec(network);
      balance = div(number, dec);
      return cb(null, balance);
    });
  };
  out$.isValidAddress = isValidAddress = function (arg$, cb) {
    var address, network, valid;
    (address = arg$.address), (network = arg$.network);
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
