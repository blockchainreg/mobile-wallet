var ref$,
  abis,
  Web3,
  createTransaction,
  getTransactionInfo,
  times,
  minus,
  div,
  plus,
  pushTx,
  calcFee;

import commonProvider from '../web3t/providers/common/provider';
Web3 = require('web3');
(ref$ = require('./api.js')),
  (createTransaction = ref$.createTransaction),
  (getTransactionInfo = ref$.getTransactionInfo),
  (pushTx = ref$.pushTx);
calcFee = ref$.calcFee;
(ref$ = require('./math.js')),
  (times = ref$.times),
  (minus = ref$.minus),
  (div = ref$.div),
  (plus = ref$.plus);
var ref$ = require('prelude-ls'),
  sortBy = ref$.sortBy,
  reverse = ref$.reverse,
  filter = ref$.filter,
  find = ref$.find,
  keys = ref$.keys,
  map = ref$.map;
var confirm = require('./pages/confirmation.js').confirm;
import spin from '../utils/spin.js';
const BN = require('ethereumjs-util').BN;
const calcAmount = require('./calc-amount.js');

abis = {
  Staking: require('../web3t/contracts/StakingAuRa.json').abi,
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
const MAX_WAITING_RESPONE_TIME = 1500;

const ABI = [
  {
    constant: true,
    inputs: [],
    name: 'getHomeFee',
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
    constant: true,
    inputs: [],
    name: 'getForeignFee',
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
    constant: true,
    inputs: [],
    name: 'dailyLimit',
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
    constant: true,
    inputs: [],
    name: 'minPerTx',
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
    constant: true,
    inputs: [],
    name: 'maxPerTx',
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
    constant: true,
    inputs: [],
    name: 'executionDailyLimit',
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
    constant: true,
    inputs: [],
    name: 'maxAvailablePerTx',
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
    constant: true,
    inputs: [],
    name: 'getCurrentDay',
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
    constant: true,
    inputs: [
      {
        name: '_day',
        type: 'uint256',
      },
    ],
    name: 'totalSpentPerDay',
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
    constant: true,
    inputs: [],
    name: 'feeManagerContract',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

function importAll$(obj, src) {
  for (var key in src) obj[key] = src[key];
  return obj;
}

/**
 * Recursively makes allowance request untill find available web3Provider.
 */
const checkAllowanceWithAvailableWeb3Provider = (
  {
    web3Providers,
    wallet,
    send,
    value,
    FOREIGN_BRIDGE,
    FOREIGN_BRIDGE_TOKEN,
    sendValue,
    checkAllowedAmount,
    isSelfSend,
    store,
  },
  cb
) => {
  const [web3Provider, ...extraWeb3Providers] = web3Providers;
  if (!web3Provider) {
    return cb(
      '[checkAllowanceWithAvailableWeb3Provider] err: No web3Provider!'
    );
  }

  const walletWithChangedWeb3Providers = {
    ...wallet,
    network: {
      ...wallet.network,
      api: { ...wallet.network.api, web3Provider, extraWeb3Providers },
    },
  };

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      walletWithChangedWeb3Providers.network.api.web3Provider
    )
  );
  web3.eth.providerUrl =
    walletWithChangedWeb3Providers.network.api.web3Provider;

  let contract = web3.eth
    .contract(abis.ForeignBridgeErcToErc)
    .at(FOREIGN_BRIDGE_TOKEN);
  const formattedValue = times(value, Math.pow(10, 18));

  /* Check for allowed amount for contract */
  contract.allowance(
    walletWithChangedWeb3Providers.address,
    FOREIGN_BRIDGE,
    function (err, allowedRaw) {
      if (err) {
        const isExtraWeb3Providers = extraWeb3Providers.length !== 0;
        if (isExtraWeb3Providers) {
          return checkAllowanceWithAvailableWeb3Provider(
            {
              web3Providers: extraWeb3Providers,
              wallet: walletWithChangedWeb3Providers,
              send,
              value,
              FOREIGN_BRIDGE,
              FOREIGN_BRIDGE_TOKEN,
              sendValue,
              checkAllowedAmount,
              isSelfSend,
              store,
            },
            cb
          );
        }
      }
      const allowed = div(allowedRaw, Math.pow(10, 0));
      contract = web3.eth
        .contract(abis.ForeignBridgeErcToErc)
        .at(FOREIGN_BRIDGE);
      contract.minPerTx(function (err, minPerTxRaw) {
        const minPerTx = div(minPerTxRaw, Math.pow(10, 18));
        if (+sendValue < +minPerTx) {
          return cb('Min amount per transaction is ' + minPerTx + ' BUSD');
        }
        contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
          const maxPerTx = div(maxPerTxRaw, Math.pow(10, 18));
          if (+sendValue > +maxPerTx) {
            return cb('Max amount per transaction is ' + maxPerTx + ' BUSD');
          }
          return checkAllowedAmount(
            {
              contract,
              wallet: walletWithChangedWeb3Providers,
              amount: send.amountSend,
              allowed,
              bridge: FOREIGN_BRIDGE,
              bridgeToken: FOREIGN_BRIDGE_TOKEN,
            },
            function (err) {
              var data, contractAddress;
              if (err != null) {
                return cb(err);
              }
              data = (function () {
                switch (false) {
                  case isSelfSend !== true:
                    return contract.transfer.getData(
                      FOREIGN_BRIDGE,
                      formattedValue
                    );
                  default: {
                    const receiver = send.to;
                    return contract.relayTokens.getData(
                      receiver,
                      formattedValue
                    );
                  }
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

              return cb(null, { data, contractAddress });
            }
          );
        });
      });
    }
  );
};

const FIXED_FEE = '0xc76cdb54';
const PERCENTAGE_FEE = '0x40c62b8f';
/**/
const getFeeMode = function (
  wallet,
  evm_wallet,
  token,
  feeManagerContract,
  cb
) {
  var ref$, ref1$, ref2$, ref3$;
  var mode = 'percent';

  if (feeManagerContract === '0x') {
    return cb('feeManagerContract is not valid address');
  }
  if (wallet == null) {
    return cb(null, mode);
  }
  if (feeManagerContract == null) {
    return cb(null, mode);
  }
  var abi = [
    {
      constant: true,
      inputs: [],
      name: 'getFeeMode',
      outputs: [
        {
          name: '',
          type: 'bytes4',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ];
  var web3 = new Web3(
    new Web3.providers.HttpProvider(
      evm_wallet != null
        ? (ref$ = evm_wallet.network) != null
          ? (ref1$ = ref$.api) != null
            ? ref1$.web3Provider
            : void 8
          : void 8
        : void 8
    )
  );
  web3.eth.providerUrl =
    evm_wallet != null
      ? (ref2$ = evm_wallet.network) != null
        ? (ref3$ = ref2$.api) != null
          ? ref3$.web3Provider
          : void 8
        : void 8
      : void 8;
  var addr = feeManagerContract;
  if (addr == null) {
    return cb(null, mode);
  }

  var contract = web3.eth.contract(abi).at(addr);
  contract.getFeeMode(function (err, feeMode) {
    if (feeMode !== FIXED_FEE && feeMode !== PERCENTAGE_FEE) {
      console.log('feeMode was not recognized properly ', feeMode);
    }
    return cb(null, feeMode === FIXED_FEE ? 'fixed' : 'percent');
  });
};

/**
 * Recursively makes getHomeFee request untill find available web3Provider.
 */
const getHomeFeeWithAvaliableWeb3Provider = (
  {
    web3Providers,
    wallet,
    walletEvm,
    ref2$,
    ref3$,
    ref4$,
    ref5$,
    chosenNetwork,
    token,
    walletTo,
  },
  cb
) => {
  const [web3Provider, ...extraWeb3Providers] = web3Providers;
  if (!web3Provider) {
    return cb('[getHomeFeeWithAvaliableWeb3Provider] err: No web3Provider!');
  }

  const walletWithChangedWeb3Providers = {
    ...wallet,
    network: {
      ...wallet.network,
      api: { ...wallet.network.api, web3Provider, extraWeb3Providers },
    },
  };

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      wallet != null
        ? (ref2$ = walletWithChangedWeb3Providers.network) != null
          ? (ref3$ = ref2$.api) != null
            ? ref3$.web3Provider
            : void 8
          : void 8
        : void 8
    )
  );
  web3.eth.providerUrl =
    walletWithChangedWeb3Providers.network.api.web3Provider;
  ref4$ = walletWithChangedWeb3Providers.network;

  const HOME_BRIDGE = ref4$.HOME_BRIDGE;
  const HECO_SWAP__HOME_BRIDGE = ref4$.HECO_SWAP__HOME_BRIDGE;
  const BSC_SWAP__HOME_BRIDGE = ref4$.BSC_SWAP__HOME_BRIDGE;
  const FOREIGN_BRIDGE = ref4$.FOREIGN_BRIDGE;
  const addr = (function () {
    switch (false) {
      case !(token === 'vlx_evm' && chosenNetwork.referTo === 'vlx_huobi'):
        return HECO_SWAP__HOME_BRIDGE;
      case !(token === 'vlx_evm' && chosenNetwork.referTo === 'bsc_vlx'):
        return BSC_SWAP__HOME_BRIDGE;
      case !(token === 'usdc' && chosenNetwork.referTo === 'vlx_usdc'):
        return FOREIGN_BRIDGE;
      case !(token === 'vlx_eth' && chosenNetwork.referTo === 'eth'):
        return FOREIGN_BRIDGE;
      case !(token === 'usdt_erc20' && chosenNetwork.referTo === 'vlx_usdt'):
        return FOREIGN_BRIDGE;
      case !(token === 'vlx_erc20' && chosenNetwork.referTo === 'vlx_evm'):
        return FOREIGN_BRIDGE;
      case !(token === 'bsc_vlx' && chosenNetwork.referTo === 'vlx_evm'):
        return FOREIGN_BRIDGE;
      case !(token === 'vlx_huobi' && chosenNetwork.referTo === 'vlx_evm'):
        return FOREIGN_BRIDGE;
      case !(token === 'busd' && chosenNetwork.referTo === 'vlx_busd'):
        return FOREIGN_BRIDGE;
      default:
        return HOME_BRIDGE;
    }
  })();
  const contract = web3.eth.contract(ABI).at(addr);
  let feeMode = 'percent';

  return contract.feeManagerContract(function (err, feeManagerContract) {
    const beforeStartGetHomeFeeTime = performance.now();
    getFeeMode(
      wallet,
      walletEvm,
      token,
      feeManagerContract,
      function (err, feeMode) {
        return contract.getHomeFee(function (err, bridgeHomeFee) {
          if (err) {
            const isErrorCausedByUnavailableWeb3Provider =
              commonProvider.isErrorCausedByUnavailableWeb3Provider(err);
            const startGetHomeFeeTime = performance.now();
            // Slow provider 4466-6000 milliseconds on dev simulator
            // Fast 143-400 milliseconds on dev simulator
            const isSlowProvider =
              startGetHomeFeeTime - beforeStartGetHomeFeeTime >
              MAX_WAITING_RESPONE_TIME;
            const isExtraWeb3Providers = extraWeb3Providers.length !== 0;
            if (
              (isExtraWeb3Providers &&
                isErrorCausedByUnavailableWeb3Provider) ||
              (isExtraWeb3Providers && isSlowProvider)
            ) {
              return getHomeFeeWithAvaliableWeb3Provider(
                {
                  web3Providers: extraWeb3Providers,
                  wallet: walletWithChangedWeb3Providers,
                  walletEvm,
                  ref2$,
                  ref3$,
                  ref4$,
                  ref5$,
                  chosenNetwork,
                  token,
                  walletTo,
                },
                cb
              );
            }
          }
          var homeFeePercent = div(
            bridgeHomeFee || 0,
            Math.pow(10, wallet.network.decimals)
          );

          contract.dailyLimit(function (err, dailyLimit) {
            var currentDay, totalSpentPerDay, remainingDailyLimit;
            dailyLimit = div(dailyLimit, Math.pow(10, wallet.network.decimals));

            contract.getCurrentDay(function (err, currentDay) {
              contract.totalSpentPerDay(
                currentDay || 0,
                function (err, totalSpentPerDay) {
                  totalSpentPerDay = div(
                    totalSpentPerDay,
                    Math.pow(10, wallet.network.decimals)
                  );
                  remainingDailyLimit = minus(dailyLimit, totalSpentPerDay);
                  return contract.maxAvailablePerTx(function (
                    err,
                    maxAvailablePerTx
                  ) {
                    maxAvailablePerTx = div(
                      maxAvailablePerTx,
                      Math.pow(10, wallet.network.decimals)
                    );
                    return contract.minPerTx(function (err, minPerTxRaw) {
                      var minPerTx = div(
                        minPerTxRaw != null ? minPerTxRaw : 0,
                        Math.pow(10, wallet.network.decimals)
                      );
                      return contract.maxPerTx(function (err, maxPerTxRaw) {
                        var maxPerTx,
                          wallets,
                          ref$,
                          HOME_BRIDGE,
                          FOREIGN_BRIDGE,
                          BSC_SWAP__HOME_BRIDGE,
                          HECO_SWAP__HOME_BRIDGE,
                          web3,
                          ref1$,
                          addr,
                          contract,
                          network;
                        maxPerTx = div(
                          maxPerTxRaw != null ? maxPerTxRaw : 0,
                          Math.pow(10, wallet.network.decimals)
                        );
                        if (
                          token !== 'busd' &&
                          token !== 'usdc' &&
                          token !== 'usdt_erc20'
                        ) {
                          return cb(null, {
                            feeMode: feeMode,
                            homeFeePercent,
                            minPerTx,
                            maxPerTx,
                            remainingDailyLimit,
                            homeDailyLimit: dailyLimit,
                          });
                        }

                        (ref$ = walletTo.network),
                          (HOME_BRIDGE = ref$.HOME_BRIDGE),
                          (FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE),
                          (BSC_SWAP__HOME_BRIDGE = ref$.BSC_SWAP__HOME_BRIDGE),
                          (HECO_SWAP__HOME_BRIDGE =
                            ref$.HECO_SWAP__HOME_BRIDGE);
                        web3 = new Web3(
                          new Web3.providers.HttpProvider(
                            walletTo != null
                              ? (ref$ = walletTo.network) != null
                                ? (ref1$ = ref$.api) != null
                                  ? ref1$.web3Provider
                                  : void 8
                                : void 8
                              : void 8
                          )
                        );
                        web3.eth.providerUrl =
                          walletTo.network.api.web3Provider;
                        addr = (() => {
                          switch (false) {
                            case !(
                              token === 'usdt_erc20' &&
                              chosenNetwork.referTo === 'vlx_usdt'
                            ):
                              return HOME_BRIDGE;
                            case !(
                              token === 'usdc' &&
                              chosenNetwork.referTo === 'vlx_usdc'
                            ):
                              return HOME_BRIDGE;
                            case !(
                              token === 'busd' &&
                              chosenNetwork.referTo === 'vlx_busd'
                            ):
                              return HOME_BRIDGE;
                          }
                        })();
                        contract = web3.eth.contract(ABI).at(addr);
                        network = walletTo.network;
                        /* Retrieve maxPerTx, minPerTx, dailyLimit, brridgeFee */
                        return contract.feeManagerContract(function (
                          err,
                          feeManagerContract
                        ) {
                          var feeMode, bridgeHomeFee, homeFeePercent;
                          getFeeMode(
                            wallet,
                            walletEvm,
                            token,
                            feeManagerContract,
                            function (err, feeMode) {
                              contract.getForeignFee(function (
                                err,
                                bridgeHomeFee
                              ) {
                                homeFeePercent = (() => {
                                  switch (true) {
                                    case err:
                                      return 0;
                                    default:
                                      return div(
                                        bridgeHomeFee,
                                        Math.pow(10, walletTo.network.decimals)
                                      );
                                  }
                                })();
                                return cb(null, {
                                  feeMode: feeMode,
                                  homeFeePercent,
                                  minPerTx,
                                  maxPerTx,
                                  remainingDailyLimit,
                                  homeDailyLimit: dailyLimit,
                                });
                              });
                            }
                          );
                        });
                      });
                    });
                  });
                }
              );
            });
          });
        });
      }
    );
  });
};

/**
 * Recursively makes minPerTx request untill find available web3Provider.
 */
const generateWeb3AndContractForMinPerTxWithAvaliableWeb3Provider = (
  { web3Providers, contractConfig },
  cb
) => {
  const [web3Provider, ...extraWeb3Providers] = web3Providers;
  const { abi, bridge } = contractConfig;

  const web3 = new Web3(new Web3.providers.HttpProvider(web3Provider));
  web3.eth.providerUrl = web3Provider;
  const contract = web3.eth.contract(abi).at(bridge);

  return contract.minPerTx((err, minPerTxRaw) => {
    if (err) {
      if (extraWeb3Providers.length !== 0) {
        return generateWeb3AndContractForMinPerTxWithAvaliableWeb3Provider(
          {
            web3Providers: extraWeb3Providers,
            contractConfig: {
              abi,
              bridge,
            },
          },
          cb
        );
      }
    }

    return cb(null, { minPerTxRaw, web3, contractPrev: contract });
  });
};

module.exports = function ({ store, web3t }) {
  var lang,
    wallets,
    chosenNetworkWallet,
    send,
    wallet,
    vlx_evm_to_vlx_erc20_swap,
    velas_evm_to_heco_swap,
    bsc_velas_to_velas_evm_swap,
    velas_eth_to_eth_swap,
    eth_to_velas_eth_swap,
    vlx_erc20_to_velas_swap,
    velas_evm_to_bsc_swap,
    heco_to_velas_evm_swap,
    usdc_to_usdc_velas_swap,
    usdc_velas_to_usdc_swap,
    busd_velas_to_busd_swap,
    busd_to_busd_velas_swap,
    checkAllowedAmount,
    eth_usdtUsdt_velasSwap,
    usdt_velasEth_usdtSwap,
    HOME_BRIDGE,
    FOREIGN_BRIDGE_TOKEN,
    FOREIGN_BRIDGE,
    receiver,
    web3,
    contract;

  let checkingAllowed = store.current.send.checkingAllowed;

  if (store == null || web3t == null) {
    console.log('! store == null || web3t == null');
    return null;
  }

  const toHex = function (it) {
    return new BN(it);
  };

  send = store.current.send;
  wallet = send.wallet;

  var value =
    store.current.send.amountSend !== '' ? store.current.send.amountSend : 0;
  let sendValue = value === '' ? '0' : value;

  if (wallet == null) {
    console.log('! wallet == null');
    return null;
  }
  var up = function (str) {
    return (str != null ? str : '').trim().toUpperCase();
  };
  var isSelfSend = up(wallet.address) === up(store.current.send.to);

  const isNotBridge = function () {
    var token, chosenNetwork, ref$;
    token = store.current.send.wallet.coin.token;
    chosenNetwork = store.current.send.chosenNetwork;
    return (
      ((ref$ = chosenNetwork.referTo) === 'vlx_evm' ||
        ref$ === 'vlx2' ||
        ref$ === 'vlx_native') &&
      (token === 'vlx_evm' || token === 'vlx2' || token === 'vlx_native')
    );
  };

  /*
   * Swap from USDC to USDC VELAS
   */
  usdc_to_usdc_velas_swap = function (token, chosenNetwork, cb) {
    var web3,
      ref$,
      FOREIGN_BRIDGE,
      FOREIGN_BRIDGE_TOKEN,
      receiver,
      contract,
      allowed,
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
      minPerTxRaw,
      minPerTx,
      maxPerTxRaw,
      maxPerTx;
    if (!(token === 'usdc' && chosenNetwork.id === 'vlx_usdc')) {
      return cb(null);
    }
    (ref$ = wallet.network),
      (FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE),
      (FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN);
    value = times(value, Math.pow(10, 6));
    receiver = send.to;
    web3 = new Web3(
      new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
    );
    web3.eth.providerUrl = wallet.network.api.web3Provider;
    contract = web3.eth
      .contract(abis.ForeignBridgeErcToErc)
      .at(FOREIGN_BRIDGE_TOKEN);
    /*---*/
    receiver = send.to;
    /* Check for allowed amount for contract */
    contract.allowance(
      wallet.address,
      FOREIGN_BRIDGE,
      function (err, allowedRaw) {
        allowed = div(allowedRaw, Math.pow(10, wallet.network.decimals));
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
        contract.minPerTx(function (err, minPerTxRaw) {
          minPerTx = div(minPerTxRaw, Math.pow(10, 6));
          if (+sendValue < +minPerTx) {
            return cb('Min amount per transaction is ' + minPerTx + ' USDC');
          }
          contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
            maxPerTx = div(maxPerTxRaw, Math.pow(10, 6));
            if (+sendValue > +maxPerTx) {
              return cb('Max amount per transaction is ' + maxPerTx + ' USDC');
            }

            return checkAllowedAmount(
              {
                contract: contract,
                wallet: wallet,
                amount: send.amountSend,
                allowed: allowed,
                bridge: FOREIGN_BRIDGE,
                bridgeToken: FOREIGN_BRIDGE_TOKEN,
              },
              function (err) {
                var data, contractAddress;
                if (err != null) {
                  return cb(err);
                }
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
              }
            );
          });
        });
      }
    );
  };
  /* DONE! */
  /*
   * Swap from USDC VELAS to USDC
   */
  usdc_velas_to_usdc_swap = function (token, chosenNetwork, cb) {
    var web3,
      ref$,
      HOME_BRIDGE,
      HOME_BRIDGE_TOKEN,
      receiver,
      ref1$,
      ref2$,
      ref3$,
      contract,
      network,
      minPerTxRaw,
      minPerTx,
      maxPerTxRaw,
      maxPerTx,
      err,
      data;
    if (!(token === 'vlx_usdc' && chosenNetwork.id === 'usdc')) {
      return cb(null);
    }
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

    contract.minPerTx(function (err, minPerTxRaw) {
      minPerTx = div(minPerTxRaw, Math.pow(10, 6));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' USDC');
      }
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, 6));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' USDC');
        }

        data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
        store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
        store.current.send.data = data;
        cb(null, data);
      });
    });
  };

  /* ! */
  busd_velas_to_busd_swap = function (token, chosenNetwork, cb) {
    var web3,
      ref$,
      HOME_BRIDGE,
      HOME_BRIDGE_TOKEN,
      ref1$,
      ref2$,
      ref3$,
      contract,
      minPerTx,
      maxPerTx,
      data;
    if (!(token === 'vlx_busd' && chosenNetwork.id === 'busd')) {
      return cb(null);
    }
    (ref$ = wallet.network),
      (HOME_BRIDGE = ref$.HOME_BRIDGE),
      (HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN);
    value = times(value, Math.pow(10, 18));
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
    contract.minPerTx(function (err, minPerTxRaw) {
      minPerTx = div(minPerTxRaw, Math.pow(10, 18));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' BUSD');
      }
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, 18));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' BUSD');
        }
        data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
        store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
        store.current.send.data = data;
        cb(null, data);
      });
    });
  };

  busd_to_busd_velas_swap = function (token, chosenNetwork, cb) {
    var wallets,
      chosenNetworkWallet,
      ref$,
      FOREIGN_BRIDGE,
      FOREIGN_BRIDGE_TOKEN;
    if (!(token === 'busd' && chosenNetwork.id === 'vlx_busd')) {
      return cb(null);
    }
    wallets = store.current.account.wallets;
    chosenNetworkWallet = find(function (it) {
      return it.coin.token === chosenNetwork.id;
    })(wallets);
    if (chosenNetworkWallet == null) {
      return cb('[Swap error]: wallet ' + chosenNetwork.id + ' is not found!');
    }
    (ref$ = wallet.network),
      (FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE),
      (FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN);

    const { web3Provider, extraWeb3Providers } = wallet.network.api;
    const web3Providers = commonProvider.getWeb3Providers(
      web3Provider,
      extraWeb3Providers
    );

    checkAllowanceWithAvailableWeb3Provider(
      {
        web3Providers,
        wallet,
        send,
        value,
        chosenNetworkWallet,
        FOREIGN_BRIDGE,
        FOREIGN_BRIDGE_TOKEN,
        sendValue,
        checkAllowedAmount,
        isSelfSend,
        store,
      },
      (err, { data, contractAddress }) => {
        if (err) {
          return cb(err);
        }
        store.current.send.contractAddress = contractAddress;
        store.current.send.data = data;

        return cb(null, data);
      }
    );
  };
  /* Check for allowed amount for contract */
  checkAllowedAmount = function (arg$, cb) {
    var contract,
      wallet,
      amount,
      allowed,
      bridge,
      bridgeToken,
      token,
      ref$,
      ref1$;
    (contract = arg$.contract),
      (wallet = arg$.wallet),
      (amount = arg$.amount),
      (allowed = arg$.allowed),
      (bridge = arg$.bridge),
      (bridgeToken = arg$.bridgeToken);
    const feeType = send.feeType;
    const network = send.network;
    const txType = send.txType;
    if (checkingAllowed) {
      return;
    }
    store.current.send.checkingAllowed = true;
    if (isSelfSend === true) {
      return cb(null);
    }
    if (bridge == null) {
      return cb('bridge is not defined');
    }
    if (bridgeToken == null) {
      return cb('bridgeToken is not defined');
    }
    if (allowed >= amount) {
      //      console.log('Allowed amount is more ', { allowed, amount });
      return cb(null);
    }

    token = (
      (ref$ =
        wallet != null
          ? (ref1$ = wallet.coin) != null
            ? ref1$.nickname
            : void 8
          : void 8) != null
        ? ref$
        : ''
    ).toUpperCase();

    const UINT_MAX_NUMBER = times(
      4294967295,
      Math.pow(10, wallet.network.decimals)
    );

    const config = {
      to: bridgeToken,
      data: contract.approve.getData(bridge, UINT_MAX_NUMBER),
      network: network,
      amount: '0.0000000000000001',
      feeType: feeType,
      txType: txType,
      token: token,
      account: {
        address: wallet.address,
        privateKey: wallet.privateKey,
      },
      gasPrice: null,
    };

    getTxFee(config, function (err, result) {
      const { calcedFee, gasEstimate, gasPrice } = result;
      const fee = calcedFee.substr(0, 7);

      const feeToken = (
        (ref$ = wallet.network.txFeeIn) != null
          ? ref$
          : store.current.send.coin.nickname || store.current.send.coin.token
      ).toUpperCase();

      var confirmText =
        'To execute this swap please approve that bridge contract can withdraw your ' +
        token +
        ' and automate payments for you. Approving fee ≈ ' +
        fee +
        ' ' +
        feeToken;

      confirm(store, confirmText, function (agree) {
        if (!agree) {
          store.current.send.checkingAllowed = false;
          return cb('Canceled by user');
        }
        const coin = send.coin;
        const gas = send.gas;
        const gasPrice = send.gasPrice;
        const amountSend = send.amountSend;
        const amountSendFee = send.amountSendFee;
        const data = contract.approve.getData(bridge, UINT_MAX_NUMBER);

        const txObj = {
          account: {
            address: wallet.address,
            privateKey: wallet.privateKey,
          },
          recipient: bridgeToken,
          network: network,
          token: token,
          coin: coin,
          amount: '0',
          data: data,
          gas: 150000,
          gasPrice: null,
          feeType: feeType,
        };
        spin(store, 'Approving in process...', (exitLoaderCb) => {
          createTransaction(txObj, function (err, txData) {
            if (err != null) {
              exitLoaderCb();
              return cb(err);
            }

            return pushTx(
              import$(
                {
                  token: token,
                  txType: txType,
                  network: network,
                },
                txData
              ),
              function (err, tx) {
                if (err != null) {
                  exitLoaderCb();
                  store.current.send.checkingAllowed = false;
                  return cb(err);
                }
                checkApprove(
                  {
                    start: Date.now(),
                    token: wallet != null ? wallet.coin.token : void 8,
                    network: wallet.network,
                    tx: tx,
                  },
                  function (err, res) {
                    store.current.send.checkingAllowed = false;
                    exitLoaderCb();
                    if (err != null) {
                      return cb(err);
                    }
                    calcAmount.changeAmount(
                      store,
                      store.current.send.amountSend,
                      false,
                      () => {
                        return cb(null);
                      }
                    );
                  }
                );
              }
            );
          });
        })(function (err, result) {
          console.log('approve fin');
        });
      });
    });
  };

  const getTxFee = function (config, cb) {
    var send = store.current.send;
    send.feeCalculating = true;
    calcFee(config, (err, result) => {
      send.feeCalculating = false;
      if (err !== null) {
        send.error = (err.message || err).toString();
        return cb(err);
      }
      return cb(null, result);
    });
  };

  const checkTxConfirmation = function (config, cb) {
    const { start, token, network, tx } = config;
    return function () {
      if (Date.now() > start + 60000) {
        store.current.send.checkingApproveTx = false;
        return cb(
          'Approve Transaction is still under confirmation. Try to repeat later.'
        );
      }
      return getTransactionInfo(
        {
          token: token,
          network: network,
          tx: tx,
        },
        function (err, moreInfo) {
          console.log('[getTransactisonInfo]', { err, moreInfo });
          var ref$;
          store.current.send.checkingApproveTx = false;
          if (
            (moreInfo != null ? moreInfo.status : void 8) === 'confirmed' ||
            (moreInfo != null
              ? (ref$ = moreInfo.info) != null
                ? ref$.status
                : void 8
              : void 8) === '0x1'
          ) {
            cb(null);
          }
        }
      );
    };
  };

  const checkApprove = function (config, cb) {
    const { start, token, network, tx } = config;
    store.current.send.checkingApproveTx = true;
    const timerCb = function (err, res) {
      clearInterval(checkApprove.timer);
      return cb(err, res);
    };
    return (checkApprove.timer = setInterval(
      checkTxConfirmation(
        {
          start: start,
          token: token,
          network: network,
          tx: tx,
        },
        timerCb
      ),
      1000
    ));
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
      allowedRaw,
      allowed,
      network,
      minPerTxRaw,
      minPerTx,
      maxPerTxRaw,
      maxPerTx;
    if (!(token === 'usdt_erc20' && chosenNetwork.id === 'vlx_usdt')) {
      return cb(null);
    }
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
      .at(FOREIGN_BRIDGE_TOKEN);
    contract.allowance(
      wallet.address,
      FOREIGN_BRIDGE,
      function (err, allowedRaw) {
        if (err !== null) {
          return cb(err);
        }
        allowed = div(allowedRaw, Math.pow(10, 0));
        network = wallet.network;
        contract = web3.eth
          .contract(abis.ForeignBridgeErcToErc)
          .at(FOREIGN_BRIDGE);

        contract.minPerTx(function (err, minPerTxRaw) {
          minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));

          if (+sendValue < +minPerTx) {
            return cb('Min amount per transaction is ' + minPerTx + ' USDT');
          }

          contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
            maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));

            if (+sendValue > +maxPerTx) {
              return cb('Max amount per transaction is ' + maxPerTx + ' USDT');
            }

            /* Check for allowed amount for contract */
            return checkAllowedAmount(
              {
                contract: contract,
                wallet: wallet,
                amount: send.amountSend,
                allowed: allowed,
                bridge: FOREIGN_BRIDGE,
                bridgeToken: FOREIGN_BRIDGE_TOKEN,
              },
              function (err) {
                var data, contractAddress;
                if (err != null) {
                  return cb(err);
                }
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
              }
            );
          });
        });
      }
    );
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
      minPerTxRaw,
      minPerTx,
      maxPerTxRaw,
      maxPerTx,
      data;
    if (!(token === 'vlx_usdt' && chosenNetwork.id === 'usdt_erc20')) {
      return cb(null);
    }
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

    contract.minPerTx(function (err, minPerTxRaw) {
      if (err !== null) {
        return cb('[minPerTx] Error: ' + err);
      }
      minPerTx = div(minPerTxRaw, Math.pow(10, 6));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' USDT');
      }

      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        if (err !== null) {
          return cb('[maxPerTx] Error: ' + err);
        }
        maxPerTx = div(maxPerTxRaw, Math.pow(10, 6));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' USDT');
        }
        data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
        store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
        store.current.send.data = data;
        cb(null, data);
      });
    });
  };

  /*new*/
  /* Swap from VELAS EVM to HECO */
  velas_evm_to_heco_swap = function (token, chosenNetwork, cb) {
    var web3,
      ref$,
      receiver,
      ref1$,
      ref2$,
      ref3$,
      contract,
      network,
      minPerTx,
      maxPerTx,
      data,
      HECO_SWAP__HOME_BRIDGE;
    if (!(token === 'vlx_evm' && chosenNetwork.id === 'vlx_huobi')) {
      return cb(null);
    }
    wallets = store.current.account.wallets;
    chosenNetworkWallet = find(function (it) {
      return it.coin.token === chosenNetwork.id;
    })(wallets);
    if (chosenNetworkWallet == null) {
      return cb('[Swap error]: wallet ' + chosenNetwork.id + ' is not found!');
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
    network = wallet.network;
    contract.minPerTx(function (err, minPerTxRaw) {
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
        data = contract.relayTokens.getData(receiver);
        if (+sendValue < +minPerTx) {
          return cb('Min amount per transaction is ' + minPerTx + ' VLX');
        }
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' VLX');
        }
        send.data = data;
        store.current.send.contractAddress = HECO_SWAP__HOME_BRIDGE;
        cb(null, data);
      });
    });
  };

  /* Swap from HECO to VELAS EVM */
  heco_to_velas_evm_swap = function (token, chosenNetwork, cb) {
    var web3,
      contract,
      network,
      minPerTx,
      maxPerTx,
      data,
      ref4$,
      ref5$,
      ref6$,
      ref7$;
    if (!(token === 'vlx_huobi' && chosenNetwork.id === 'vlx_evm')) {
      return cb(null);
    }
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
      .at(FOREIGN_BRIDGE);
    network = wallet.network;
    /*  Get minPerTx from HomeBridge */
    contract.minPerTx(function (err, minPerTxRaw) {
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      /* Get maxPerTx from HomeBridge */
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
        if (+sendValue < +minPerTx) {
          return cb('Min amount per transaction is ' + minPerTx + ' VLX');
        }
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' VLX');
        }
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
        send.data = data;
        send.contractAddress = FOREIGN_BRIDGE_TOKEN;
        cb(null, data);
      });
    });
  };

  /* Swap from VELAS EVM to BSC */
  velas_evm_to_bsc_swap = function (token, chosenNetwork, cb) {
    var web3,
      contract,
      network,
      contractAddress,
      minPerTx,
      maxPerTx,
      BSC_SWAP__HOME_BRIDGE,
      ERC20BridgeToken,
      ref8$,
      ref9$,
      ref10$,
      ref11$,
      data;
    if (!(token === 'vlx_evm' && chosenNetwork.id === 'bsc_vlx')) {
      return cb(null);
    }

    wallets = store.current.account.wallets;
    chosenNetworkWallet = find(function (it) {
      return it.coin.token === chosenNetwork.id;
    })(wallets);
    if (chosenNetworkWallet == null) {
      return cb('[Swap error]: wallet ' + chosenNetwork.id + ' is not found!');
    }
    value = times(value, Math.pow(10, 18));
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
    network = wallet.network;
    contract.minPerTx(function (err, minPerTxRaw) {
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));

        contractAddress = (function () {
          switch (false) {
            case isSelfSend !== true:
              return ERC20BridgeToken;
            default:
              return BSC_SWAP__HOME_BRIDGE;
          }
        })();

        data = contract.relayTokens.getData(receiver);
        if (+sendValue < +minPerTx) {
          return cb('Min amount per transaction is ' + minPerTx + ' VLX');
        }
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' VLX');
        }
        send.data = data;
        store.current.send.contractAddress = BSC_SWAP__HOME_BRIDGE;
        cb(null, data);
      });
    });
  };

  /* Swap from BSC VELAS to VELAS EVM */
  bsc_velas_to_velas_evm_swap = function (token, chosenNetwork, cb) {
    var ref12$, network, minPerTx, maxPerTx, data;
    if (!(token === 'bsc_vlx' && chosenNetwork.id === 'vlx_evm')) {
      return cb(null);
    }
    value = times(value, Math.pow(10, 18));
    (ref12$ = wallet.network),
      (FOREIGN_BRIDGE = ref12$.FOREIGN_BRIDGE),
      (FOREIGN_BRIDGE_TOKEN = ref12$.FOREIGN_BRIDGE_TOKEN);

    network = wallet.network;
    /* Get minPerTx from HomeBridge */
    const web3Provider = wallet?.network?.api?.web3Provider;
    let web3Providers = commonProvider.getWeb3Providers(
      web3Provider,
      wallet?.network?.api?.extraWeb3Providers
    );

    generateWeb3AndContractForMinPerTxWithAvaliableWeb3Provider(
      {
        web3Providers,
        contractConfig: {
          abi: abis.ForeignBridgeNativeToErc,
          bridge: FOREIGN_BRIDGE,
        },
      },
      function (err, { minPerTxRaw, web3, contractPrev }) {
        minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
        /* Get maxPerTx from HomeBridge */
        contractPrev.maxAvailablePerTx(function (err, maxPerTxRaw) {
          maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
          if (+sendValue < +minPerTx) {
            return cb('Min amount per transaction is ' + minPerTx + ' VLX');
          }
          if (+sendValue > +maxPerTx) {
            return cb('Max amount per transaction is ' + maxPerTx + ' VLX');
          }
          const contract = web3.eth
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
          send.data = data;
          send.contractAddress = FOREIGN_BRIDGE_TOKEN;
          cb(null, data);
        });
      }
    );
  };

  /* Swap from ETH to ETHEREUM (VELAS) */
  eth_to_velas_eth_swap = function (token, chosenNetwork, cb) {
    var web3, contract, network, minPerTx, maxPerTx, data;
    if (!(token === 'eth' && chosenNetwork.id === 'vlx_eth')) {
      return cb(null);
    }
    wallets = store.current.account.wallets;
    chosenNetworkWallet = find(function (it) {
      return it.coin.token === chosenNetwork.id;
    })(wallets);
    if (chosenNetworkWallet == null) {
      return cb('[Swap error]: wallet ' + chosenNetwork.id + ' is not found!');
    }
    value = toHex(times(value, Math.pow(10, 18)));
    HOME_BRIDGE = wallet.network.HOME_BRIDGE;
    web3 = new Web3(
      new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
    );
    web3.eth.providerUrl = wallet.network.api.web3Provider;
    contract = web3.eth.contract(abis.HomeBridgeNativeToErc).at(HOME_BRIDGE);
    store.current.send.contractAddress = HOME_BRIDGE;
    receiver = send.to;
    contract.minPerTx(function (err, minPerTxRaw) {
      network = wallet.network;
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' ETH');
      }
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' ETH');
        }
        data = contract.relayTokens.getData(receiver);
        send.data = data;
        cb(null, data);
      });
    });
  };

  /* Swap from ETH (VELAS) to ETH  */
  velas_eth_to_eth_swap = function (token, chosenNetwork, cb) {
    var web3,
      contract,
      network,
      minPerTxRaw,
      minPerTx,
      maxPerTxRaw,
      maxPerTx,
      data;
    if (!(token === 'vlx_eth' && chosenNetwork.id === 'eth')) {
      return cb(null);
    }
    value = times(value, Math.pow(10, 18));
    network = wallet.network;
    var ref16$ = wallet.network,
      FOREIGN_BRIDGE = ref16$.FOREIGN_BRIDGE,
      FOREIGN_BRIDGE_TOKEN = ref16$.FOREIGN_BRIDGE_TOKEN;
    web3 = new Web3(
      new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
    );
    web3.eth.providerUrl = wallet.network.api.web3Provider;
    contract = web3.eth.contract(abis.ERC20BridgeToken).at(FOREIGN_BRIDGE);

    contract.minPerTx(function (err, minPerTxRaw) {
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' ETH');
      }
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' ETH');
        }

        contract = web3.eth
          .contract(abis.ERC20BridgeToken)
          .at(FOREIGN_BRIDGE_TOKEN);
        data = contract.transferAndCall.getData(FOREIGN_BRIDGE, value, send.to);
        send.data = data;
        send.contractAddress = FOREIGN_BRIDGE_TOKEN;
        cb(null, data);
      });
    });
  };

  /* CHECK */
  /* Swap from VLX ERC20 to COIN VLX */
  vlx_erc20_to_velas_swap = function (token, chosenNetwork, cb) {
    var web3, contract, network, minPerTx, maxPerTx, data;
    if (
      !(
        token === 'vlx_erc20' &&
        ((ref16$ = chosenNetwork.id) === 'vlx_evm' || ref16$ === 'vlx2')
      )
    ) {
      return cb(null);
    }
    value = times(value, Math.pow(10, 18));
    network = wallet.network;
    var ref16$ = wallet.network,
      FOREIGN_BRIDGE = ref16$.FOREIGN_BRIDGE,
      FOREIGN_BRIDGE_TOKEN = ref16$.FOREIGN_BRIDGE_TOKEN;
    web3 = new Web3(
      new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
    );
    web3.eth.providerUrl = wallet.network.api.web3Provider;
    contract = web3.eth
      .contract(abis.ForeignBridgeNativeToErc)
      .at(FOREIGN_BRIDGE);

    /* Get minPerTx */
    contract.minPerTx(function (err, minPerTxRaw) {
      if (err != null) {
        return cb(err);
      }
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' VLX');
      }

      /* Get maxPerTx  */
      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        if (err != null) {
          return cb(err);
        }
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' VLX');
        }

        var sendingTo = (function () {
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
        cb(null, data);
      });
    });
  };

  /* CHECK */
  /* Swap from COIN VLX to VLX ERC20 */
  vlx_evm_to_vlx_erc20_swap = async function (token, chosenNetwork, cb) {
    var network, minPerTx, maxPerTx, data;
    if (
      !(
        (token === 'vlx_evm' || token === 'vlx2') &&
        chosenNetwork.id === 'vlx_erc20'
      )
    ) {
      return cb(null);
    }
    wallets = store.current.account.wallets;
    chosenNetworkWallet = find(function (it) {
      return it.coin.token === chosenNetwork.id;
    })(wallets);
    if (chosenNetworkWallet == null) {
      return cb('[Swap error]: wallet ' + chosenNetwork.id + ' is not found!');
    }
    HOME_BRIDGE = wallet.network.HOME_BRIDGE;
    receiver = store.current.send.to;
    network = wallet.network;

    web3 = new Web3(
      new Web3.providers.HttpProvider(wallet.network.api.web3Provider)
    );
    web3.eth.providerUrl = wallet.network.api.web3Provider;
    contract = web3.eth.contract(abis.HomeBridgeNativeToErc).at(HOME_BRIDGE);
    data = contract.relayTokens.getData(receiver);

    contract.minPerTx(function (err, minPerTxRaw) {
      if (err != null) {
        return cb(err);
      }
      minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
      if (+sendValue < +minPerTx) {
        return cb('Min amount per transaction is ' + minPerTx + ' VLX');
      }

      contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
        if (err != null) {
          return cb(err);
        }
        maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
        if (+sendValue > +maxPerTx) {
          return cb('Max amount per transaction is ' + maxPerTx + ' VLX');
        }

        send.data = data;
        store.current.send.contractAddress = HOME_BRIDGE;
        cb(null, data);
      });
    });
  };

  const getBridgeInfo = function (cb) {
    var chosenNetwork,
      ref$,
      ref1$,
      token,
      ref2$,
      wallet,
      network,
      ref3$,
      ref4$,
      ref5$,
      chosenNetwork =
        store != null
          ? (ref$ = store.current) != null
            ? (ref1$ = ref$.send) != null
              ? ref1$.chosenNetwork
              : void 8
            : void 8
          : void 8;
    if (chosenNetwork == null) {
      return cb(null);
    }
    token = store.current.send.coin.token;
    if (
      chosenNetwork == null ||
      chosenNetwork.referTo === 'vlx_native' ||
      (token === 'vlx_native' &&
        ((ref2$ = chosenNetwork.referTo) === 'vlx' ||
          ref2$ === 'vlx2' ||
          ref2$ === 'vlx_evm')) ||
      ((token === 'vlx' || token === 'vlx_evm') &&
        ((ref2$ = chosenNetwork.referTo) === 'vlx_native' ||
          ref2$ === 'vlx2')) ||
      ((token === 'vlx2' || token === 'vlx_native' || token === 'vlx_evm') &&
        ((ref2$ = chosenNetwork.referTo) === 'vlx_native' ||
          ref2$ === 'vlx2' ||
          ref2$ === 'vlx_evm')) ||
      (token === 'vlx_native' &&
        ((ref2$ = chosenNetwork.referTo) === 'vlx' ||
          ref2$ === 'vlx2' ||
          ref2$ === 'vlx_evm'))
    ) {
      store.current.send.homeFeePercent = 0;
      return cb(null);
    }
    wallet = store.current.send.wallet;
    network = wallet.network;
    const walletEvm = store.current.account.wallets.find(
      (it) => it.coin.token === 'vlx_evm'
    );

    const { web3Provider, extraWeb3Providers } = network.api;
    const web3Providers = commonProvider.getWeb3Providers(
      web3Provider,
      extraWeb3Providers
    );
    const wallets = store.current.account.wallets;
    const walletTo = find(function (it) {
      return it.coin.token === chosenNetwork.referTo;
    })(wallets);

    getHomeFeeWithAvaliableWeb3Provider(
      {
        web3Providers,
        wallet,
        walletEvm,
        ref2$,
        ref3$,
        ref4$,
        ref5$,
        chosenNetwork,
        token,
        walletTo,
      },
      (
        error,
        {
          feeMode,
          homeFeePercent,
          minPerTx,
          maxPerTx,
          remainingDailyLimit,
          homeDailyLimit,
        }
      ) => {
        if (error) {
          return cb(`[getHomeFeeWithAvaliableWeb3Provider] error ${error}`);
        }
        store.current.send.feeMode = feeMode;
        store.current.send.homeFeePercent = homeFeePercent;
        store.current.send.homeDailyLimit = homeDailyLimit;
        importAll$(store.current.networkDetails, {
          dailyLimit: homeDailyLimit,
          homeFeePercent,
          minPerTx: minPerTx,
          maxPerTx: maxPerTx,
          remainingDailyLimit: remainingDailyLimit,
        });
        return cb(null);
      }
    );
  };

  function import$(obj, src) {
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }

  return {
    usdc_to_usdc_velas_swap: usdc_to_usdc_velas_swap,
    usdc_velas_to_usdc_swap: usdc_velas_to_usdc_swap,
    busd_velas_to_busd_swap: busd_velas_to_busd_swap,
    busd_to_busd_velas_swap: busd_to_busd_velas_swap,
    eth_usdtUsdt_velasSwap: eth_usdtUsdt_velasSwap,
    usdt_velasEth_usdtSwap: usdt_velasEth_usdtSwap,
    vlx_evm_to_vlx_erc20_swap: vlx_evm_to_vlx_erc20_swap,
    vlx_erc20_to_velas_swap: vlx_erc20_to_velas_swap,
    eth_to_velas_eth_swap: eth_to_velas_eth_swap,
    velas_eth_to_eth_swap: velas_eth_to_eth_swap,
    bsc_velas_to_velas_evm_swap: bsc_velas_to_velas_evm_swap,
    velas_evm_to_bsc_swap: velas_evm_to_bsc_swap,
    heco_to_velas_evm_swap: heco_to_velas_evm_swap,
    velas_evm_to_heco_swap: velas_evm_to_heco_swap,
    getBridgeInfo: getBridgeInfo,
    isNotBridge: isNotBridge,
  };
};
