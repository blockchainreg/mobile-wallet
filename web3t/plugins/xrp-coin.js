// Generated by LiveScript 1.6.0
(function () {
  var mainnet,
    testnet,
    type,
    enabled,
    token,
    image,
    out$ = (typeof exports != 'undefined' && exports) || this;
  out$.mainnet = mainnet = {
    decimals: 8,
    txFee: '0.0000004',
    mask: '1000000000000000000000000000000000',
    api: {
      provider: 'ripple',
      url: 'https://bithomp.com/explorer',
      apiUrl: 'http://s2.ripple.com:51234/',
      decimal: 8,
    },
  };
  out$.testnet = testnet = {
    txFee: 0.0001,
    decimals: 8,
    mask: '1000000000000000000000000000000000',
    api: {
      provider: 'ripple',
      url: 'https://bithomp.com/explorer',
      apiUrl: 'https://s.altnet.rippletest.net:51234',
      decimal: 8,
    },
    topup: 'https://testnet.manu.backend.hamburg/faucet',
  };
  out$.type = type = 'coin';
  out$.enabled = enabled = false;
  out$.token = token = 'xrp';
  out$.image = image = './res/xrp-ethnamed.png';
}.call(this));
