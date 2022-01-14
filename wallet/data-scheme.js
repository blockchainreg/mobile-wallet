// Generated by LiveScript 1.5.0
(function () {
  var ref$,
    map,
    pairsToObj,
    saved,
    location,
    en,
    ru,
    ua,
    getDevice,
    savedSeed,
    createSend,
    store;
  (ref$ = require('prelude-ls')),
    (map = ref$.map),
    (pairsToObj = ref$.pairsToObj);
  saved = require('./seed.js').saved;
  location = require('./browser/location.js');
  en = require('./langs/en.js');
  ru = require('./langs/ru.js');
  ua = require('./langs/ua.js');
  zh = require('./langs/zh.js');
  es = require('./langs/es.js');
  ko = require('./langs/ko.js');
  ar = require('./langs/ar.js');
  id = require('./langs/id.js');
  ph = require('./langs/ph.js');
  yr = require('./langs/yr.js');
  vn = require('./langs/vn.js');
  hi = require('./langs/hi.js');
  getDevice = require('./get-device.js');
  savedSeed = saved();
  createSend = function () {
    return {
      id: '',
      to: '',
      proposeEscrow: false,
      address: '',
      value: '0',
      feeType: 'auto',
      txType: 'regular',
      amountSend: '',
      amountCharged: '0',
      amountChargedUsd: '0',
      amountSendUsd: '0',
      amountSendEur: '0',
      amountSendFee: '0',
      amountSendFeeUsd: '0',
      amountObtain: '0',
      checkingAllowed: false,
      checkingApproveTx: false,
      data: '',
      decodedData: '',
      showDataMode: 'encoded',
      error: '',
      errorParse: null,
      sending: false,
      chekingBalance: null,
      chosenNetwork: null,
      gasPrice: null,
      gasPriceAuto: null,
      gasPriceCustomAmount: '0',
      gasPriceType: 'auto',
    };
  };
  store = {
    root: null,
    theme: 'velas',
    lang: 'en',
    langs: {
      en: en,
      ru: ru,
      ua: ua,
      zh: zh,
      es: es,
      ko: ko,
      ar: ar,
      id: id,
      ph: ph,
      yr: yr,
      vn: vn,
      hi: hi,
    },
    registry: [],
    terms: 'Loading...',
    preference: {
      settingsVisible: true,
      invoiceVisible: true,
      usernameVisible: false,
      refreshVisible: true,
      lockVisible: true,
    },
    receive: {
      wallet: null,
    },
    menu: {
      active: 's2',
    },
    ask: {
      text: '',
      enabled: false,
      callback: null,
      image: '',
      type: '',
    },
    contractAddress: '',
    transactions: {
      all: [],
      applied: [],
    },
    current: {
      account: { wallets: [] },
      device: getDevice(),
      filterTxsTypes: ['IN', 'OUT'],
      filter: {
        from: null,
        to: null,
        token: null,
      },
      list: 0,
      promptAnswer: '',
      prompt: false,
      sendMenuOpen: false,
      addCoin: false,
      walletIndex: 0,
      accountIndex: 1,
      account: {},
      manageAccount: false,
      filterPlugins: '',
      confirmation: null,
      creatingTransaction: false,
      demo: location.href.indexOf('web3.space/wallet') > -1,
      network: 'mainnet',
      pin: '',
      // pinSave: "",
      lastTxUrl: '',
      tryEditSeed: false,
      pinTrial: 0,
      refreshing: false,
      copied: '',
      page: 'locked',
      sendToMask: '',
      status: 'main',
      nickname: '',
      nicknamefull: 'nickname@domain.com',
      message: '',
      customDomain: false,
      canBuy: false,
      checkingName: false,
      seed: '',
      seedTemp: '',
      savedSeed: savedSeed,
      balanceUsd: '...',
      filter: ['IN', 'OUT'],
      send: createSend(),
      invoice: createSend(),
      transaction: null,
    },
    history: {
      filterOpen: false,
    },
    rates: {},
    coins: [],
    infoTransaction: null,
  };
  module.exports = store;
}.call(this));
