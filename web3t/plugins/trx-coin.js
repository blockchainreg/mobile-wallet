// Generated by LiveScript 1.5.0
(function(){
  var mainnet, testnet, color, type, enabled, token, image, usdInfo, out$ = typeof exports != 'undefined' && exports || this;
  out$.mainnet = mainnet = {
    decimals: 1,
    txFee: '0.0000001',
    txFeeOptions: {
      fast: '0.000001',
      cheap: '0.0000002'
    },
    mask: 'username',
    api: {
      provider: 'tron',
      nodeUrl: "",
      apiUrl: "",
      explorerUrl: "",
      decimal: 1
    }
  };
  out$.testnet = testnet = {
    txFee: '0.0000001',
    txFeeOptions: {
      fast: '0.000001',
      cheap: '0.0000002'
    },
    decimals: 1,
    mask: 'username',
    api: {
      provider: 'tron',
      nodeUrl: "",
      apiRul: "",
      explorerUrl: "",
      decimal: 1
    }
  };
  out$.color = color = '#000000';
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.token = token = 'trx';
  out$.image = image = 'https://s2.coinmarketcap.com/static/img/coins/200x200/1958.png';
  out$.usdInfo = usdInfo = "url(https://min-api.cryptocompare.com/data/pricemulti?fsyms=TRX&tsyms=USD).TRX.USD";
}).call(this);
