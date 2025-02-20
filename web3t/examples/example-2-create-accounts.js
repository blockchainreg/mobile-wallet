// Generated by LiveScript 1.6.0
(function () {
  var ref$,
    initWeb3t,
    mnemonic,
    createBtcAccount,
    createLtcAccount,
    createDashAccount,
    createEthAccount,
    createXemAccount,
    createRemAccount,
    createSttAccount,
    createSprklAccount,
    out$ = (typeof exports != 'undefined' && exports) || this;
  (ref$ = require('./example-1-core.ls')),
    (initWeb3t = ref$.initWeb3t),
    (mnemonic = ref$.mnemonic);
  out$.createBtcAccount = createBtcAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.btc.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createLtcAccount = createLtcAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.ltc.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createDashAccount = createDashAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.dash.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createEthAccount = createEthAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.eth.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createXemAccount = createXemAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.xem.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createRemAccount = createRemAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.rem.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createSttAccount = createSttAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.stt.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
  out$.createSprklAccount = createSprklAccount = function (index, cb) {
    return initWeb3t(function (err, web3t) {
      if (err != null) {
        return cb(err);
      }
      return web3t.sprkl.createAccount(
        {
          mnemonic: mnemonic,
          index: index,
        },
        cb
      );
    });
  };
}.call(this));
