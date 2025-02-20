// Generated by LiveScript 1.6.0
(function () {
  var mainnet,
    testnet,
    txTypes,
    color,
    branding,
    links,
    type,
    enabled,
    name,
    token,
    image,
    usdInfo,
    out$ = (typeof exports != 'undefined' && exports) || this;
  out$.mainnet = mainnet = {
    decimals: 8,
    txFee: '0.00001',
    txFeeAutoMode: 'per-byte',
    txFeeOptions: {
      auto: '0.00001',
      cheap: '0.00001',
      instantPerInput: '0.0001',
      instantServicePrice: 0,
      privatePerInput: '0.005',
      privateServicePrice: '0.025',
      feePerByte: '0.00000001',
    },
    mask: '1000000000000000000000000000000000',
    api: {
      provider: 'insight',
      url: 'https://insight.gobyte.network',
      apiName: 'insight-api-gobyte',
      mixingList: 'https://explorer.gobyte.network:5002/api/masternodelist',
      decimal: 8,
    },
    messagePrefix: '\x18GoByte Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x488b21e,
      private: 0x488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0x10,
    wif: 0xc6,
    dustThreshold: 5460,
  };
  out$.testnet = testnet = {
    txFee: '0.00005',
    txFeeOptions: {
      fast: '0.00005',
      cheap: '0.00001',
      instantPerInput: '0.0001',
      privatePerInput: '0.005',
      feePerByte: '0.00000001',
    },
    decimals: 8,
    mask: 'n000000000000000000000000000000000',
    api: {
      provider: 'insight',
      url: 'https://texplorer.gobyte.network:4001',
      apiName: 'insight-api-gobyte',
      decimal: 8,
    },
    messagePrefix: '\x18GoByte Signed Message:\n',
    topup: 'https://testnet.manu.backend.hamburg/faucet',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x70,
    scriptHash: 0x14,
    wif: 0xf0,
    dustThreshold: 5460,
  };
  out$.txTypes = txTypes = ['regular', 'instant'];
  out$.color = color = '#545DF1';
  out$.branding = branding = {
    logo: 'https://www.gobyte.network/img/logo.svg',
    title: 'GoByte Multicurrency Wallet',
    important: true,
    topup: 'gobyte',
  };
  out$.links = links = [
    {
      image: 'https://www.gobyte.network/img/fb.png',
      href: 'https://wwww.facebook.com/gobytenetwork',
    },
    {
      image: 'https://www.gobyte.network/img/twitter.png',
      href: 'https://twitter.com/gobytenetwork',
    },
    {
      image: 'https://www.gobyte.network/img/reddit.png',
      href: 'https://www.reddit.com/r/gobytenetwork/',
    },
    {
      image: 'https://www.gobyte.network/img/slack.png',
      href: 'https://gobyte.slack.com/',
    },
    {
      image: 'https://www.gobyte.network/img/discordapp.png',
      href: 'https://discord.gobyte.network/',
    },
    {
      image: 'https://www.gobyte.network/img/telegram.png',
      href: 'https://t.me/gobytenetwork',
    },
    {
      image: 'https://www.gobyte.network/img/github.png',
      href: 'https://github.com/gobytecoin/gobyte',
    },
  ];
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.name = name = 'Gobyte';
  out$.token = token = 'gbx';
  out$.image = image =
    'https://res.cloudinary.com/nixar-work/image/upload/v1548537659/gobyte.png';
  out$.usdInfo = usdInfo = 'url(https://explorer.velas.com/ticker).gbx_price';
}.call(this));
