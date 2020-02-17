// Generated by LiveScript 1.5.0
(function(){
  var mainnet, testnet, color, type, enabled, token, image, usdInfo, out$ = typeof exports != 'undefined' && exports || this;
  out$.mainnet = mainnet = {
    decimals: 1,
    txFee: '0',
    mask: 'username',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    registerAccountLink: 'https://www.zeos.co/en/home?public-key=:public-key',
    api: {
      provider: 'eos',
      nodeUrl: ['https://api.eosnewyork.io', 'https://api.eosio.cr:80', 'https://api.eosdetroit.io:443', 'https://eos.greymass.com:443', 'https://api.eosmetal.io:18890', 'http://api.hkeos.com:80', 'https://eosapi.blockmatrix.network:443', 'https://fn.eossweden.se:443', 'http://api.blockgenicbp.com:8888', 'http://mainnet.eoscalgary.io:80', 'https://node1.eosphere.io', 'https://eos.saltblock.io', 'http://eos-api.worbli.io:80', 'https://eos-api.worbli.io:443', 'http://mainnet.eoscalgary.io:80', 'http://user-api.eoseoul.io:80', 'https://node2.liquideos.com:8883', 'https://api.eosuk.io:443', 'http://api1.eosdublin.io:80', 'http://api.eosvibes.io:80', 'http://api.cypherglass.com:8888', 'http://bp.cryptolions.io:8888', 'http://dc1.eosemerge.io', 'https://api.eosio.cr:443', 'https://api.eosn.io', 'https://eu1.eosdac.io:443', 'https://api.main.alohaeos.com:443', 'https://rpc.eosys.io'],
      apiUrl: 'https://api.eospark.com',
      explorerUrl: 'https://eospark.com',
      decimal: 1
    }
  };
  out$.testnet = testnet = {
    txFee: '0',
    decimals: 1,
    mask: 'username',
    registerAccountLink: 'https://www.google.com/search?q=eos+account+jungle',
    api: {
      provider: 'eos',
      nodeUrl: 'https://jungle.eosio.cr:443',
      apiRul: 'https://api.jungle.eospark.com',
      explorerUrl: 'https://jungle.eospark.com',
      decimal: 1
    }
  };
  out$.color = color = '#272431';
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.token = token = 'eos';
  out$.image = image = 'https://res.cloudinary.com/nixar-work/image/upload/v1550938232/EOS.png';
  out$.usdInfo = usdInfo = "url(https://min-api.cryptocompare.com/data/pricemulti?fsyms=EOS&tsyms=USD).EOS.USD";
}).call(this);
