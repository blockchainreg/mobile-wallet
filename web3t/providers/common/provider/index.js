import { post } from '../../superagent';
import ERC20BridgeToken from '../../../contracts/ERC20BridgeToken.json';
import { div } from '../../../math';
const ABI = [
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

const ERC20_ABI = ERC20BridgeToken.abi;

const getWeb3Providers = (web3Provider, extraWeb3Providers) => {
  if (
    !!extraWeb3Providers &&
    Array.isArray(extraWeb3Providers) &&
    extraWeb3Providers.length !== 0
  ) {
    return [web3Provider, ...extraWeb3Providers];
  }
  return [web3Provider];
};

const tryParse = function (data, cb) {
  return setImmediate(function () {
    var err;
    if (data.body.toString().slice(8, -1) === 'Object') {
      return cb(null, data);
    }
    if (
      (data != null ? data.text : void 8).toString().slice(8, -1) !== 'String'
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

/**
 * Recursively makes post request untill find avaliable web3Provider.
 */
const postWithAvaliableWeb3provider = function (web3Providers, query, cb) {
  const [web3Provider, ...extraWeb3Providers] = web3Providers;

  if (web3Provider == null) {
    retrun(cb(null));
  }
  return post(web3Provider, query).end(function (err, data) {
    if (err != null) {
      console.error(
        '[post-postWithAvaliableWeb3provider] err',
        web3Provider,
        err,
        query
      );

      if (extraWeb3Providers.length === 0) {
        return cb(`[post-postWithAvaliableWeb3provider] err ${err}`, null);
      }
    }

    if (err == null && data != null) {
      return cb(null, data);
    }

    return postWithAvaliableWeb3provider(extraWeb3Providers, query, cb);
  });
};

const makeQuery = function (network, method, params, cb) {
  const {
    web3Provider,
    extraWeb3Providers,
    provider: apiProvider,
  } = network.api;

  const query = {
    jsonrpc: '2.0',
    id: 1,
    method: method,
    params: params,
  };

  const web3Providers = getWeb3Providers(web3Provider, extraWeb3Providers);

  return postWithAvaliableWeb3provider(
    web3Providers,
    query,
    function (err, data) {
      var ref$;

      if (err != null) {
        return cb(
          'postWithAvaliableWeb3provider err: ' +
            ((ref$ = err.message) != null ? ref$ : err) +
            ` ${apiProvider}`
        );
      }
      return tryParse(data, function (err, data) {
        var ref$;
        if (err != null) {
          return cb(err);
        }
        if (data.body.toString().slice(8, -1) !== 'Object') {
          return cb('expected object');
        }
        if (((ref$ = data.body) != null ? ref$.error : void 8) != null) {
          return cb(data.body.error);
        }
        return cb(null, data.body.result);
      });
    }
  );
};

const getWeb3 = function (network) {
  var web3Provider;
  web3Provider = network.api.web3Provider;
  return new Web3(new Web3.providers.HttpProvider(web3Provider));
};

const getWeb3ByProvider = function (web3Provider) {
  return new Web3(new Web3.providers.HttpProvider(web3Provider));
};

const getDec = function (network) {
  var decimals;
  decimals = network.decimals;
  return Math.pow(10, decimals);
};

const getContractInstanceWithAbi = (abi) => (web3, address) => {
  if (web3.eth.contract.toString().slice(8, -1) !== 'Function') {
    return web3.eth.contract(abi).at(address);
  }
  return new web3.eth.Contract(abi, address);
};

/**
 * Recursively makes balanceOf request untill find avaliable web3Provider.
 */
const balanceOfWithAvaliableWeb3Provider = function (
  address,
  network,
  web3Providers,
  cb
) {
  const [web3Provider, ...extraWeb3Providers] = web3Providers;

  if (!web3Provider) {
    retrun(cb(null));
  }

  const web3 = getWeb3ByProvider(web3Provider);
  try {
    // TODO: detect abi to create ContractInstance with ABI or ERC20_ABI
    const getContractInstance = getContractInstanceWithAbi(ERC20_ABI);
    const contract = getContractInstance(web3, network.address);

    var balanceOf = (function () {
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
      if (err != null) {
        console.error('[getBalance] err', err);
        if (extraWeb3Providers === 0) {
          return cb(err);
        }
        return balanceOfWithAvaliableWeb3Provider(
          address,
          network,
          extraWeb3Providers,
          cb
        );
      }
      const dec = getDec(network);
      const balance = div(number, dec);
      return cb(null, balance);
    });
  } catch (err) {
    console.error('[getBalance] err in cath', err);
    return cb(err);
  }
};

const getBalance = (arg$, cb) => {
  const { network, address } = arg$;
  const { web3Provider, extraWeb3Providers } = network.api;
  const web3Providers = getWeb3Providers(web3Provider, extraWeb3Providers);

  return balanceOfWithAvaliableWeb3Provider(
    address,
    network,
    web3Providers,
    cb
  );
};

/**
 * Recursively makes web3.eth.getBalance request untill find avaliable web3Provider.
 */
const web3EthGetBalanceWithAvaliableWeb3Provider = (
  address,
  web3Providers,
  cb
) => {
  const [web3Provider, ...extraWeb3Providers] = web3Providers;

  if (!web3Provider) {
    retrun(cb(null));
  }

  const web3 = getWeb3ByProvider(web3Provider);

  return web3.eth.getBalance(address, (err, balance) => {
    if (err != null) {
      console.error('[web3EthGetBalanceWithAvaliableWeb3Provider] err', err);
      if (extraWeb3Providers === 0) {
        return cb(err);
      }

      return web3EthGetBalanceWithAvaliableWeb3Provider(
        address,
        extraWeb3Providers,
        cb
      );
    }
    return cb(null, balance);
  });
};

const web3EthGetBalance = (address, network, cb) => {
  const { web3Provider, extraWeb3Providers } = network.api;
  const web3Providers = getWeb3Providers(web3Provider, extraWeb3Providers);

  return web3EthGetBalanceWithAvaliableWeb3Provider(address, web3Providers, cb);
};

export default {
  makeQuery,
  getBalance,
  getContractInstanceWithAbi,
  getDec,
  getWeb3,
  web3EthGetBalance,
  ABI,
  ERC20_ABI,
};
