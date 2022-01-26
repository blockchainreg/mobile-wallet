import binanceBscRpc from './commonTokenConfigs/binanceBscRpc';

// Generated by LiveScript 1.6.0
(function () {
  var mainnet,
    testnet,
    color,
    type,
    enabled,
    name,
    token,
    nickname,
    image,
    usdInfo,
    out$ = (typeof exports != 'undefined' && exports) || this;
  out$.mainnet = mainnet = {
    disabled: false,
    decimals: 18,
    txFee: '0.0006',
    txFeeOptions: {
      auto: '0.0006',
      cheap: '0.0006',
    },
    api: {
      provider: 'bsc_vlx',
      apiUrl: 'https://api.bscscan.com/api',
      url: 'https://bscscan.com',
      web3Provider: 'https://bsc-dataseed.binance.org',
      ...binanceBscRpc.mainnet.api,
    },
    address: '0xE9C803F48dFFE50180Bd5B01dC04DA939E3445Fc',
    FOREIGN_BRIDGE_TOKEN: '0xE9C803F48dFFE50180Bd5B01dC04DA939E3445Fc',
    FOREIGN_BRIDGE: '0x145Fb39C9776516E455b7B050330776a1EC2Fd02',
    /* Used in getHomeFee wallet method */ HOME_BRIDGE:
      '0x7E0e1810A5Eb891C6Df07a585d94c79f854BFa9e',
    txFeeIn: 'bnb',
    txBridgeFeeIn: 'bnb',
    group: 'BSC',
    networks: {
      vlx_evm: {
        id: 'vlx_evm',
        name: 'Velas EVM (VLX)',
        referTo: 'vlx_evm',
      },
    },
  };
  out$.testnet = testnet = {
    disabled: false,
    decimals: 18,
    txFee: '0.0007',
    txFeeOptions: {
      auto: '0.0007',
      cheap: '0.0007',
    },
    api: {
      provider: 'bsc_vlx',
      url: 'https://testnet.bscscan.com',
      apiUrl: 'https://api-testnet.bscscan.com/api',
      ...binanceBscRpc.testnet.api,
    },
    address: '0x77622c2f95846ddab1300f46685cc953c17a78df',
    FOREIGN_BRIDGE_TOKEN: '0x77622C2F95846dDaB1300F46685CC953C17A78df',
    FOREIGN_BRIDGE: '0x719C8490730ADBBA514eec7173515a4A572dA736',
    /* Used in getHomeFee wallet method */ HOME_BRIDGE:
      '0x97B7eb15cA5bFa82515f6964a3EAa1fE71DFB7A7',
    txFeeIn: 'bnb',
    txBridgeFeeIn: 'bnb',
    group: 'BSC',
    networks: {
      vlx_evm: {
        id: 'vlx_evm',
        name: 'Velas EVM (VLX)',
        referTo: 'vlx_evm',
      },
    },
  };
  out$.color = color = '#9E4FEB';
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.name = name = 'Velas BEP-20';
  out$.token = token = 'bsc_vlx';
  out$.nickname = nickname = 'vlx';
  out$.image = image =
    'data:image/png;base64,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';
  out$.usdInfo = usdInfo = 'url(https://explorer.velas.com/ticker).price_usd';
}.call(this));
