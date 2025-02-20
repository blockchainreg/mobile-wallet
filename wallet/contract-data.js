// Generated by LiveScript 1.6.0
(function () {
  var ref$,
    times,
    minus,
    div,
    plus,
    map,
    find,
    BN,
    bs58,
    assert,
    velasWeb3,
    abis,
    out$ = (typeof exports != 'undefined' && exports) || this;
  (ref$ = require('./math.js')),
    (times = ref$.times),
    (minus = ref$.minus),
    (div = ref$.div),
    (plus = ref$.plus);
  (ref$ = require('prelude-ls')), (map = ref$.map), (find = ref$.find);
  BN = require('ethereumjs-util').BN;
  bs58 = require('bs58');
  velasWeb3 = require('./velas/velas-web3.js');
  const resolveAddress = require('./resolve-address.js');
  abis = {
    EvmToNativeBridge: require('../web3t/contracts/EvmToNativeBridge.json').abi,
    HomeBridgeNativeToErc:
      require('../web3t/contracts/HomeBridgeNativeToErc.json').abi,
    ForeignBridgeNativeToErc:
      require('../web3t/contracts/ForeignBridgeNativeToErc.json').abi,
    ERC20BridgeToken: require('../web3t/contracts/ERC20BridgeToken.json').abi,
    ERC677BridgeToken: require('../web3t/contracts/ERC20BridgeToken.json').abi,
    HomeERC677Bridge: require('../web3t/contracts/HomeBridgeNativeToErc.json')
      .abi,
    ForeignBridgeErcToErc:
      require('../web3t/contracts/ForeignBridgeErcToErc.json').abi,
  };
  module.exports = function (arg$) {
    var store,
      send,
      wallet,
      feeType,
      up,
      isSelfSend,
      usdc_to_usdc_velas_swap,
      usdc_velas_to_usdc_swap,
      busd_velas_to_busd_swap,
      busd_to_busd_velas_swap,
      eth_usdtUsdt_velasSwap,
      usdt_velasEth_usdtSwap,
      formContractData,
      toHex;
    store = arg$.store;
    if ((store != null) == null) {
      return null;
    }
    send = store.current.send;
    (wallet = send.wallet), (feeType = send.feeType);
    if (wallet == null) {
      return null;
    }
    up = function (str) {
      return (str != null ? str : '').trim().toUpperCase();
    };
    isSelfSend = up(wallet.address) === up(store.current.send.to);
    var value =
      store.current.send.amountSend !== '' ? store.current.send.amountSend : 0;
    /*
     * Swap from USDC to USDC VELAS
     */
    usdc_to_usdc_velas_swap = function (token, chosenNetwork, cb) {
      var web3,
        ref$,
        FOREIGN_BRIDGE,
        FOREIGN_BRIDGE_TOKEN,
        receiver,
        coin,
        gas,
        gasPrice,
        amountSend,
        amountSendFee,
        feeType,
        network,
        txType,
        ref1$,
        ref2$,
        ref3$,
        contract,
        data,
        contractAddress;
      if (!(token === 'usdc' && chosenNetwork.id === 'vlx_usdc')) {
        return cb(null);
      }
      web3 = velasWeb3(store);
      (ref$ = wallet.network),
        (FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE),
        (FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN);
      value = times(value, Math.pow(10, 6));
      receiver = send.to;
      (coin = send.coin),
        (gas = send.gas),
        (gasPrice = send.gasPrice),
        (amountSend = send.amountSend),
        (amountSendFee = send.amountSendFee),
        (feeType = send.feeType),
        (network = send.network),
        (txType = send.txType);
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          wallet != null
            ? (ref$ = wallet.network) != null
              ? (ref1$ = ref$.api) != null
                ? ref1$.web3Provider
                : void 8
              : void 8
            : void 8
        )
      );
      web3.eth.providerUrl =
        wallet != null
          ? (ref2$ = wallet.network) != null
            ? (ref3$ = ref2$.api) != null
              ? ref3$.web3Provider
              : void 8
            : void 8
          : void 8;
      contract = web3.eth
        .contract(abis.ForeignBridgeErcToErc)
        .at(FOREIGN_BRIDGE);
      data = (function () {
        switch (false) {
          case isSelfSend !== true:
            return contract.transfer.getData(FOREIGN_BRIDGE, value);
          default:
            return contract.relayTokens.getData(receiver, value);
        }
      })();
      contractAddress = (function () {
        switch (false) {
          case isSelfSend !== true:
            return FOREIGN_BRIDGE_TOKEN;
          default:
            return FOREIGN_BRIDGE;
        }
      })();
      store.current.send.contractAddress = contractAddress;
      store.current.send.data = data;
      return cb(null, data);
    };
    /*
     * Swap from USDC VELAS to USDC
     */
    usdc_velas_to_usdc_swap = function (token, chosenNetwork, cb) {
      var web3,
        ref$,
        HOME_BRIDGE,
        HOME_BRIDGE_TOKEN,
        ref1$,
        ref2$,
        ref3$,
        contract,
        data;
      if (!(token === 'vlx_usdc' && chosenNetwork.id === 'usdc')) {
        return cb(null);
      }
      web3 = velasWeb3(store);
      (ref$ = wallet.network),
        (HOME_BRIDGE = ref$.HOME_BRIDGE),
        (HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN);
      if (HOME_BRIDGE == null) {
        return cb('HOME_BRIDGE is not defined');
      }
      if (HOME_BRIDGE_TOKEN == null) {
        return cb('HOME_BRIDGE_TOKEN is not defined');
      }
      value = times(value, Math.pow(10, 6));
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          wallet != null
            ? (ref$ = wallet.network) != null
              ? (ref1$ = ref$.api) != null
                ? ref1$.web3Provider
                : void 8
              : void 8
            : void 8
        )
      );
      web3.eth.providerUrl =
        wallet != null
          ? (ref2$ = wallet.network) != null
            ? (ref3$ = ref2$.api) != null
              ? ref3$.web3Provider
              : void 8
            : void 8
          : void 8;
      contract = web3.eth.contract(abis.ERC20BridgeToken).at(HOME_BRIDGE);
      data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
      store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
      store.current.send.data = data;
      return cb(null, data);
    };
    busd_velas_to_busd_swap = function (token, chosenNetwork, cb) {
      var web3,
        ref$,
        HOME_BRIDGE,
        HOME_BRIDGE_TOKEN,
        receiver,
        ref1$,
        ref2$,
        ref3$,
        contract,
        data;
      if (!(token === 'vlx_busd' && chosenNetwork.id === 'busd')) {
        return cb(null);
      }
      web3 = velasWeb3(store);
      (ref$ = wallet.network),
        (HOME_BRIDGE = ref$.HOME_BRIDGE),
        (HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN);
      value = times(value, Math.pow(10, 18));
      receiver = send.to;
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          wallet != null
            ? (ref$ = wallet.network) != null
              ? (ref1$ = ref$.api) != null
                ? ref1$.web3Provider
                : void 8
              : void 8
            : void 8
        )
      );
      web3.eth.providerUrl =
        wallet != null
          ? (ref2$ = wallet.network) != null
            ? (ref3$ = ref2$.api) != null
              ? ref3$.web3Provider
              : void 8
            : void 8
          : void 8;
      contract = web3.eth.contract(abis.ERC20BridgeToken).at(HOME_BRIDGE);
      data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
      store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
      store.current.send.data = data;
      return cb(null, data);
    };
    busd_to_busd_velas_swap = function (token, chosenNetwork, cb) {
      var wallets,
        chosenNetworkWallet,
        ref$,
        FOREIGN_BRIDGE,
        FOREIGN_BRIDGE_TOKEN,
        web3,
        receiver,
        contract,
        data,
        contractAddress;
      if (!(token === 'busd' && chosenNetwork.id === 'vlx_busd')) {
        return cb(null);
      }
      wallets = store.current.account.wallets;
      chosenNetworkWallet = find(function (it) {
        return it.coin.token === chosenNetwork.id;
      })(wallets);
      if (chosenNetworkWallet == null) {
        return cb(
          '[Swap error]: wallet ' + chosenNetwork.id + ' is not found!'
        );
      }
      (ref$ = wallet.network),
        (FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE),
        (FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN);
      web3 = new Web3(
        new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
      );
      web3.eth.providerUrl = wallet.network.api.web3Provider;
      value = times(value, Math.pow(10, 18));
      receiver = send.to;
      contract = web3.eth
        .contract(abis.ForeignBridgeErcToErc)
        .at(FOREIGN_BRIDGE);
      data = (function () {
        switch (false) {
          case up(wallet.address) !== up(store.current.send.to):
            return contract.transfer.getData(FOREIGN_BRIDGE, value);
          default:
            return contract.relayTokens.getData(receiver, value);
        }
      })();
      contractAddress = (function () {
        switch (false) {
          case up(wallet.address) !== up(store.current.send.to):
            return FOREIGN_BRIDGE_TOKEN;
          default:
            return FOREIGN_BRIDGE;
        }
      })();
      store.current.send.contractAddress = contractAddress;
      store.current.send.data = data;
      return cb(null, data);
    };
    /*
     * Swap from USDT ETHEREUM to USDT VELAS
     */
    eth_usdtUsdt_velasSwap = function (token, chosenNetwork, cb) {
      var web3,
        ref$,
        FOREIGN_BRIDGE,
        FOREIGN_BRIDGE_TOKEN,
        receiver,
        ref1$,
        ref2$,
        ref3$,
        contract,
        data,
        contractAddress;
      if (!(token === 'usdt_erc20' && chosenNetwork.id === 'vlx_usdt')) {
        return cb(null);
      }
      web3 = velasWeb3(store);
      (ref$ = wallet.network),
        (FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE),
        (FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN);
      if (FOREIGN_BRIDGE == null) {
        return cb('FOREIGN_BRIDGE is not defined');
      }
      if (FOREIGN_BRIDGE_TOKEN == null) {
        return cb('FOREIGN_BRIDGE_TOKEN is not defined');
      }
      value = times(value, Math.pow(10, 6));
      receiver = send.to;
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          wallet != null
            ? (ref$ = wallet.network) != null
              ? (ref1$ = ref$.api) != null
                ? ref1$.web3Provider
                : void 8
              : void 8
            : void 8
        )
      );
      web3.eth.providerUrl =
        wallet != null
          ? (ref2$ = wallet.network) != null
            ? (ref3$ = ref2$.api) != null
              ? ref3$.web3Provider
              : void 8
            : void 8
          : void 8;
      contract = web3.eth
        .contract(abis.ForeignBridgeErcToErc)
        .at(FOREIGN_BRIDGE);
      data = (function () {
        switch (false) {
          case up(wallet.address) !== up(store.current.send.to):
            return contract.transfer.getData(FOREIGN_BRIDGE, value);
          default:
            return contract.relayTokens.getData(receiver, value);
        }
      })();
      contractAddress = (function () {
        switch (false) {
          case up(wallet.address) !== up(store.current.send.to):
            return FOREIGN_BRIDGE_TOKEN;
          default:
            return FOREIGN_BRIDGE;
        }
      })();
      store.current.send.contractAddress = contractAddress;
      store.current.send.data = data;
      return cb(null, data);
    };
    /*
     * Swap from USDT VELAS to USDT ETHEREUM
     */
    usdt_velasEth_usdtSwap = function (token, chosenNetwork, cb) {
      var web3,
        ref$,
        HOME_BRIDGE,
        HOME_BRIDGE_TOKEN,
        ref1$,
        ref2$,
        ref3$,
        contract,
        data;
      if (!(token === 'vlx_usdt' && chosenNetwork.id === 'usdt_erc20')) {
        return cb(null);
      }
      web3 = velasWeb3(store);
      (ref$ = wallet.network),
        (HOME_BRIDGE = ref$.HOME_BRIDGE),
        (HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN);
      value = times(value, Math.pow(10, 6));
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          wallet != null
            ? (ref$ = wallet.network) != null
              ? (ref1$ = ref$.api) != null
                ? ref1$.web3Provider
                : void 8
              : void 8
            : void 8
        )
      );
      web3.eth.providerUrl =
        wallet != null
          ? (ref2$ = wallet.network) != null
            ? (ref3$ = ref2$.api) != null
              ? ref3$.web3Provider
              : void 8
            : void 8
          : void 8;
      contract = web3.eth.contract(abis.ERC20BridgeToken).at(HOME_BRIDGE);
      data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
      store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
      store.current.send.data = data;
      return cb(null, data);
    };
    formContractData = function (cb) {
      var chosenNetwork,
        token,
        ref$,
        wallet,
        contractAddress,
        data,
        dummy,
        func;
      if (store.current.send.chosenNetwork == null) {
        return cb(null);
      }

      const recipientAddress = store.current.send.to;
      resolveAddress(
        {
          store: store,
          address: recipientAddress,
          coin: store.current.send.coin,
          network: store.current.send.network,
        },
        function (err, to) {
          if (err !== null) {
            var errMessage = err.message ? err.message : err;
            store.current.send.error = errMessage;
            return cb(errMessage);
          }

          chosenNetwork = store.current.send.chosenNetwork;
          token = store.current.send.coin.token;
          if (
            ((ref$ = chosenNetwork.id) === 'vlx_evm' || ref$ === 'vlx2') &&
            (token === 'vlx_evm' || token === 'vlx2')
          ) {
            store.current.send.contractAddress = null;
            return cb(null);
          }
          wallet = store.current.send.wallet;
          contractAddress = null;
          data = null;
          send.swap = true;
          /* DONE! */
          dummy = function (a, b, cb) {
            return cb(null);
          };
          func = (function () {
            switch (false) {
              case !(token === 'usdt_erc20' && chosenNetwork.id === 'vlx_usdt'):
                /* Swap from USDT ETHEREUM to USDT VELAS  */
                return eth_usdtUsdt_velasSwap;
              case !(token === 'vlx_usdt' && chosenNetwork.id === 'usdt_erc20'):
                /* Swap from USDT VELAS to USDT ETHEREUM */
                return usdt_velasEth_usdtSwap;
              case !(token === 'busd' && chosenNetwork.id === 'vlx_busd'):
                /* Swap from BUSD to BUSD VELAS */
                return busd_to_busd_velas_swap;
              case !(token === 'vlx_busd' && chosenNetwork.id === 'busd'):
                /* Swap from BUSD VELAS to BUSD */
                return busd_velas_to_busd_swap;
              case !(token === 'usdc' && chosenNetwork.id === 'vlx_usdc'):
                /* Swap from USDC to USDC VELAS */
                return usdc_to_usdc_velas_swap;
              case !(token === 'vlx_usdc' && chosenNetwork.id === 'usdc'):
                /* Swap from USDC VELAS to USDC */
                return usdc_velas_to_usdc_swap;
              default:
                return dummy;
            }
          })();
          return func(token, chosenNetwork, function (err, data) {
            var wallets,
              chosenNetworkWallet,
              HECO_SWAP__HOME_BRIDGE,
              web3,
              ref$,
              ref1$,
              ref2$,
              ref3$,
              contract,
              receiver,
              ref4$,
              FOREIGN_BRIDGE,
              FOREIGN_BRIDGE_TOKEN,
              ref5$,
              ref6$,
              ref7$,
              ref8$,
              BSC_SWAP__HOME_BRIDGE,
              ERC20BridgeToken,
              ref9$,
              ref10$,
              ref11$,
              contractAddress,
              ref12$,
              ref13$,
              ref14$,
              ref15$,
              HOME_BRIDGE,
              network,
              ref16$,
              value2,
              sendingTo,
              EVM_TO_NATIVE_BRIDGE,
              $recipient,
              recipient,
              hex,
              ethAddress;
            if (err != null) {
              return cb(err);
            }
            /* Swap from VELAS EVM to HECO */
            if (token === 'vlx_evm' && chosenNetwork.id === 'vlx_huobi') {
              wallets = store.current.account.wallets;
              chosenNetworkWallet = find(function (it) {
                return it.coin.token === chosenNetwork.id;
              })(wallets);
              if (chosenNetworkWallet == null) {
                return cb(
                  '[Swap error]: wallet ' + chosenNetwork.id + ' is not found!'
                );
              }
              HECO_SWAP__HOME_BRIDGE = wallet.network.HECO_SWAP__HOME_BRIDGE;
              web3 = new Web3(
                new Web3.providers.HttpProvider(
                  wallet != null
                    ? (ref$ = wallet.network) != null
                      ? (ref1$ = ref$.api) != null
                        ? ref1$.web3Provider
                        : void 8
                      : void 8
                    : void 8
                )
              );
              web3.eth.providerUrl =
                wallet != null
                  ? (ref2$ = wallet.network) != null
                    ? (ref3$ = ref2$.api) != null
                      ? ref3$.web3Provider
                      : void 8
                    : void 8
                  : void 8;
              contract = web3.eth
                .contract(abis.HomeBridgeNativeToErc)
                .at(HECO_SWAP__HOME_BRIDGE);
              receiver = store.current.send.to;
              data = contract.relayTokens.getData(receiver);
              store.current.send.contractAddress = HECO_SWAP__HOME_BRIDGE;
              send.data = data;
            }
            /* Swap from HECO to VELAS EVM */
            if (token === 'vlx_huobi' && chosenNetwork.id === 'vlx_evm') {
              value = times(value, Math.pow(10, 18));
              (ref4$ = wallet.network),
                (FOREIGN_BRIDGE = ref4$.FOREIGN_BRIDGE),
                (FOREIGN_BRIDGE_TOKEN = ref4$.FOREIGN_BRIDGE_TOKEN);
              if (FOREIGN_BRIDGE == null) {
                return cb('FOREIGN_BRIDGE is not defined');
              }
              if (FOREIGN_BRIDGE_TOKEN == null) {
                return cb('FOREIGN_BRIDGE_TOKEN is not defined');
              }
              web3 = new Web3(
                new Web3.providers.HttpProvider(
                  wallet != null
                    ? (ref4$ = wallet.network) != null
                      ? (ref5$ = ref4$.api) != null
                        ? ref5$.web3Provider
                        : void 8
                      : void 8
                    : void 8
                )
              );
              web3.eth.providerUrl =
                wallet != null
                  ? (ref6$ = wallet.network) != null
                    ? (ref7$ = ref6$.api) != null
                      ? ref7$.web3Provider
                      : void 8
                    : void 8
                  : void 8;
              contract = web3.eth
                .contract(abis.ForeignBridgeNativeToErc)
                .at(FOREIGN_BRIDGE_TOKEN);
              data = (function () {
                switch (false) {
                  case isSelfSend !== true:
                    return contract.transfer.getData(
                      FOREIGN_BRIDGE,
                      toHex(value),
                      send.to
                    );
                  default:
                    return contract.transferAndCall.getData(
                      FOREIGN_BRIDGE,
                      value,
                      send.to
                    );
                }
              })();
              send.contractAddress = FOREIGN_BRIDGE_TOKEN;
              send.data = data;
            }
            /* Swap from VELAS EVM to HECO */
            if (token === 'vlx_evm' && chosenNetwork.id === 'bsc_vlx') {
              wallets = store.current.account.wallets;
              chosenNetworkWallet = find(function (it) {
                return it.coin.token === chosenNetwork.id;
              })(wallets);
              if (chosenNetworkWallet == null) {
                return cb(
                  '[Swap error]: wallet ' + chosenNetwork.id + ' is not found!'
                );
              }
              (ref8$ = wallet.network),
                (BSC_SWAP__HOME_BRIDGE = ref8$.BSC_SWAP__HOME_BRIDGE),
                (ERC20BridgeToken = ref8$.ERC20BridgeToken);
              web3 = new Web3(
                new Web3.providers.HttpProvider(
                  wallet != null
                    ? (ref8$ = wallet.network) != null
                      ? (ref9$ = ref8$.api) != null
                        ? ref9$.web3Provider
                        : void 8
                      : void 8
                    : void 8
                )
              );
              web3.eth.providerUrl =
                wallet != null
                  ? (ref10$ = wallet.network) != null
                    ? (ref11$ = ref10$.api) != null
                      ? ref11$.web3Provider
                      : void 8
                    : void 8
                  : void 8;
              contract = web3.eth
                .contract(abis.HomeBridgeNativeToErc)
                .at(BSC_SWAP__HOME_BRIDGE);
              receiver = store.current.send.to;
              //          data = (function(){
              //            switch (false) {
              //            case isSelfSend !== true:
              //              return contract.transfer.getData(BSC_SWAP__HOME_BRIDGE, value);
              //            default:
              //              return contract.relayTokens.getData(receiver);
              //            }
              //          }());
              contractAddress = (function () {
                switch (false) {
                  case isSelfSend !== true:
                    return ERC20BridgeToken;
                  default:
                    return BSC_SWAP__HOME_BRIDGE;
                }
              })();
              data = contract.relayTokens.getData(receiver);
              send.data = data;
              store.current.send.contractAddress = BSC_SWAP__HOME_BRIDGE;
            }
            /* Swap from BSC VELAS to VELAS EVM */
            if (token === 'bsc_vlx' && chosenNetwork.id === 'vlx_evm') {
              value = times(value, Math.pow(10, 18));
              (ref12$ = wallet.network),
                (FOREIGN_BRIDGE = ref12$.FOREIGN_BRIDGE),
                (FOREIGN_BRIDGE_TOKEN = ref12$.FOREIGN_BRIDGE_TOKEN);
              web3 = new Web3(
                new Web3.providers.HttpProvider(
                  wallet != null
                    ? (ref12$ = wallet.network) != null
                      ? (ref13$ = ref12$.api) != null
                        ? ref13$.web3Provider
                        : void 8
                      : void 8
                    : void 8
                )
              );
              web3.eth.providerUrl =
                wallet != null
                  ? (ref14$ = wallet.network) != null
                    ? (ref15$ = ref14$.api) != null
                      ? ref15$.web3Provider
                      : void 8
                    : void 8
                  : void 8;
              contract = web3.eth
                .contract(abis.ForeignBridgeNativeToErc)
                .at(FOREIGN_BRIDGE_TOKEN);
              data = (function () {
                switch (false) {
                  case up(wallet.address) !== up(store.current.send.to):
                    return contract.transfer.getData(
                      FOREIGN_BRIDGE,
                      toHex(value),
                      send.to
                    );
                  default:
                    return contract.transferAndCall.getData(
                      FOREIGN_BRIDGE,
                      value,
                      send.to
                    );
                }
              })();
              send.contractAddress = FOREIGN_BRIDGE_TOKEN;
              send.data = data;
            }
            /* Swap from ETH to ETHEREUM (VELAS) */
            if (token === 'eth' && chosenNetwork.id === 'vlx_eth') {
              wallets = store.current.account.wallets;
              chosenNetworkWallet = find(function (it) {
                return it.coin.token === chosenNetwork.id;
              })(wallets);
              if (chosenNetworkWallet == null) {
                return cb(
                  '[Swap error]: wallet ' + chosenNetwork.id + ' is not found!'
                );
              }
              value = toHex(times(value, Math.pow(10, 18)));
              HOME_BRIDGE = wallet.network.HOME_BRIDGE;
              web3 = new Web3(
                new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
              );
              web3.eth.providerUrl = wallet.network.api.web3Provider;
              contract = web3.eth
                .contract(abis.HomeBridgeNativeToErc)
                .at(HOME_BRIDGE);
              receiver = send.to;
              data = contract.relayTokens.getData(receiver);
              store.current.send.contractAddress = HOME_BRIDGE;
              send.data = data;
            }
            /* Swap from ETHEREUM (VELAS) to ETH  */
            if (token === 'vlx_eth' && chosenNetwork.id === 'eth') {
              console.log('Swap from ETHEREUM (VELAS) to ETH', value);
              value = times(value, Math.pow(10, 18));
              network = wallet.network;
              (ref16$ = wallet.network),
                (FOREIGN_BRIDGE = ref16$.FOREIGN_BRIDGE),
                (FOREIGN_BRIDGE_TOKEN = ref16$.FOREIGN_BRIDGE_TOKEN);
              web3 = new Web3(
                new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
              );
              web3.eth.providerUrl = wallet.network.api.web3Provider;
              contract = web3.eth
                .contract(abis.ERC20BridgeToken)
                .at(FOREIGN_BRIDGE_TOKEN);
              data = contract.transferAndCall.getData(
                FOREIGN_BRIDGE,
                value,
                send.to
              );
              send.data = data;
              send.contractAddress = FOREIGN_BRIDGE_TOKEN;
            }
            /* Swap from VLX ERC20 to COIN VLX */
            if (
              token === 'vlx_erc20' &&
              ((ref16$ = chosenNetwork.id) === 'vlx_evm' || ref16$ === 'vlx2')
            ) {
              value2 = toHex(times(value, Math.pow(10, 18))).toString(16);
              value = times(value, Math.pow(10, 18));
              network = wallet.network;
              (ref16$ = wallet.network),
                (FOREIGN_BRIDGE = ref16$.FOREIGN_BRIDGE),
                (FOREIGN_BRIDGE_TOKEN = ref16$.FOREIGN_BRIDGE_TOKEN);
              web3 = new Web3(
                new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
              );
              web3.eth.providerUrl = wallet.network.api.web3Provider;
              sendingTo = (function () {
                switch (false) {
                  case !send.to.startsWith('V'):
                    return toEthAddress(send.to);
                  default:
                    return send.to;
                }
              })();
              contract = web3.eth
                .contract(abis.ERC20BridgeToken)
                .at(FOREIGN_BRIDGE_TOKEN);
              data = contract.transferAndCall.getData(
                FOREIGN_BRIDGE,
                value,
                sendingTo
              );
              send.data = data;
              send.contractAddress = FOREIGN_BRIDGE_TOKEN;
            }
            /* Swap from COIN VLX to VLX ERC20 */
            if (
              (token === 'vlx_evm' || token === 'vlx2') &&
              chosenNetwork.id === 'vlx_erc20'
            ) {
              wallets = store.current.account.wallets;
              chosenNetworkWallet = find(function (it) {
                return it.coin.token === chosenNetwork.id;
              })(wallets);
              if (chosenNetworkWallet == null) {
                return cb(
                  '[Swap error]: wallet ' + chosenNetwork.id + ' is not found!'
                );
              }
              HOME_BRIDGE = wallet.network.HOME_BRIDGE;
              receiver = store.current.send.to;
              network = wallet.network;
              web3 = new Web3(
                new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
              );
              web3.eth.providerUrl = wallet.network.api.web3Provider;
              contract = web3.eth
                .contract(abis.HomeBridgeNativeToErc)
                .at(HOME_BRIDGE);
              data = contract.relayTokens.getData(receiver);
              store.current.send.contractAddress = HOME_BRIDGE;
              send.data = data;
            }
            /* Swap from Legacy or EVM into native */
            if (
              (token === 'vlx_evm' || token === 'vlx2') &&
              chosenNetwork.id === 'vlx_native'
            ) {
              EVM_TO_NATIVE_BRIDGE = wallet.network.EVM_TO_NATIVE_BRIDGE;
              if (EVM_TO_NATIVE_BRIDGE == null) {
                console.error('EVM_TO_NATIVE_BRIDGE address is not defined');
                return cb('EVM_TO_NATIVE_BRIDGE address is not defined');
              }
              $recipient = '';
              try {
                recipient = (function () {
                  switch (false) {
                    case !send.to.startsWith('V'):
                      return toEthAddress(send.to);
                    default:
                      return send.to;
                  }
                })();
                $recipient = bs58.decode(recipient);
                hex = $recipient.toString('hex');
              } catch (e$) {
                err = e$;
                return cb('Please enter valid address');
              }
              ethAddress = '0x' + hex;
              web3 = new Web3(
                new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
              );
              web3.eth.providerUrl = wallet.network.api.web3Provider;
              contract = web3.eth
                .contract(abis.EvmToNativeBridge)
                .at(EVM_TO_NATIVE_BRIDGE);
              data = contract.transferToNative.getData(ethAddress);
              send.data = data;
              store.current.send.contractAddress = EVM_TO_NATIVE_BRIDGE;
            }
            send.data = data;
            return cb(null);
          });
        }
      );
    };
    toHex = function (it) {
      return new BN(it);
    };
    out$.formContractData = formContractData;
    return out$;
  };
}.call(this));
