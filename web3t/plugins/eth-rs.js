// Generated by LiveScript 1.6.0
(function(){
  var url, mainnet, testnet, color, type, nickname, enabled, token, image, usdInfo, out$ = typeof exports != 'undefined' && exports || this;
  url = 'https://royalswap.com';
  out$.mainnet = mainnet = {
    decimals: 2,
    txFee: 50,
    messagePrefix: 'Ethereum',
    mask: '0x0000000000000000000000000000000000000000',
    api: {
      provider: 'eth',
      url: url + "/fiat/explorer",
      apiUrl: url + "/fiat-token/eth_rs",
      web3Provider: url + "/fiat-token/eth_rs"
    }
  };
  out$.testnet = testnet = {
    disabled: true
  };
  out$.color = color = '#5838B8';
  out$.testnet = testnet = ropsten;
  out$.type = type = 'coin';
  out$.nickname = nickname = 'eth';
  out$.enabled = enabled = true;
  out$.token = token = 'eth_rs';
  out$.image = image = './res/eth-ethnamed.png';
  out$.usdInfo = usdInfo = "url(https://explorer.velas.com/ticker).eth_price";
}).call(this);
