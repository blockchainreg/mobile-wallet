// Generated by LiveScript 1.5.0
(function () {
  var ref$,
    filter,
    find,
    cut,
    money,
    seed,
    useNetwork,
    check,
    navigate,
    getPrimaryInfo,
    copyToClipboard,
    confirm,
    prompt,
    getLang,
    bip39,
    generateWallet,
    state,
    adjustColor,
    buildSchema,
    out$ = (typeof exports != 'undefined' && exports) || this;
  (ref$ = require('prelude-ls')), (filter = ref$.filter), (find = ref$.find);
  (ref$ = require('./tools.js')), (cut = ref$.cut), (money = ref$.money);
  seed = require('./seed.js');
  useNetwork = require('./use-network.js');
  check = require('./pin.js').check;
  navigate = require('./navigate.js');
  getPrimaryInfo = require('./get-primary-info.js');
  copyToClipboard = require('copy-to-clipboard');
  (ref$ = require('./pages/confirmation.js')),
    (confirm = ref$.confirm),
    (prompt = ref$.prompt);
  getLang = require('./get-lang.js');
  bip39 = require('bip39');
  out$.generateWallet = generateWallet = function () {
    return bip39.generateMnemonic();
  };
  state = {
    timeout: null,
  };
  adjustColor = function (col, amt) {
    var usePound, num, r, b, g;
    usePound = false;
    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }
    num = parseInt(col, 16);
    r = (num >> 16) + amt;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    b = ((num >> 8) & 255) + amt;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }
    g = (num & 255) + amt;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
  };
  buildSchema = function (firstColor) {
    var secondColor, thirdColor;
    secondColor = adjustColor(firstColor, 50);
    thirdColor = adjustColor(firstColor, 100);
    return {
      backgroundImage:
        'linear-gradient(90deg, ' +
        firstColor +
        ' 0%, ' +
        secondColor +
        ' 89%, ' +
        thirdColor +
        ' 100%)',
    };
  };
  module.exports = function (store, web3t) {
    var current,
      lock,
      refresh,
      changeSeed,
      saveSeed,
      lang,
      editSeed,
      cancelTry,
      enterPin,
      generate,
      switchNetwork,
      activateS,
      activateS1,
      activateS2,
      activateS3,
      info,
      primaryColor,
      walletStyle,
      openAccount,
      closeAccount,
      accountLeft,
      accountRight,
      changeAccountIndex,
      exportPrivateKey;
    if (store == null || web3t == null) {
      return null;
    }
    current = store.current;
    lock = function () {
      return navigate(store, web3t, 'locked');
    };
    refresh = function () {
      return web3t.refresh(function () {});
    };
    changeSeed = function (event) {
      state.timeout = clearTimeout(state.timeout);
      current.seed = event.target.value;
      return (state.timeout = setTimeout(refresh, 2000));
    };
    saveSeed = function () {
      seed.set(current.seed);
      return (current.savedSeed = true);
    };
    lang = getLang(store);
    editSeed = function () {
      return confirm(store, lang.secretPhraseChange, function (agree) {
        if (agree == null) {
          return;
        }
        store.current.pin = '';
        return (current.tryEditSeed = true);
      });
    };
    cancelTry = function () {
      return (current.tryEditSeed = false);
    };
    enterPin = function (e) {
      store.current.pin = e.target.value;
      if (!check(store.current.pin)) {
        return;
      }
      cancelTry();
      return (current.savedSeed = false);
    };
    generate = function () {
      return confirm(
        store,
        'Are you sure you want to override the current seed?',
        function (agree) {
          if (agree == null) {
            return;
          }
          current.seed = generateWallet();
          return createAccount();
        }
      );
    };
    switchNetwork = function () {
      var network;
      network = (function () {
        switch (false) {
          case store.current.network !== 'mainnet':
            return 'testnet';
          default:
            return 'mainnet';
        }
      })();
      return useNetwork(web3t, store, network, function () {});
    };
    activateS = curry$(function (name, event) {
      return (store.menu.active = name);
    });
    activateS1 = activateS('s1');
    activateS2 = activateS('s2');
    activateS3 = activateS('s3');
    info = getPrimaryInfo(store);
    primaryColor = info.color;
    walletStyle = (function () {
      switch (false) {
        case primaryColor != null:
          return {};
        default:
          return buildSchema(primaryColor);
      }
    })();
    openAccount = function () {
      var accountName;
      accountName = store.current.account.accountName;
      return (store.current.manageAccount = true);
    };
    closeAccount = function () {
      return (store.current.manageAccount = false);
    };
    accountLeft = function () {
      if (store.current.accountIndex === 0) {
        return alert('0 is smallest account index');
      }
      store.current.accountIndex -= 1;
      return refresh();
    };
    accountRight = function () {
      if (store.current.accountIndex > 999999999) {
        return alert('999999999 is highest account index');
      }
      store.current.accountIndex += 1;
      return refresh();
    };
    changeAccountIndex = function (event) {
      var val, ref$;
      if (!(event != null && event.target)) {
        return;
      }
      val = (ref$ = event.target.value) != null ? ref$ : '1';
      if (val.match(/[0-9]+/) == null) {
        return;
      }
      store.current.accountIndex = +val;
      changeAccountIndex.timer = clearTimeout(changeAccountIndex.timer);
      return (changeAccountIndex.timer = setTimeout(refresh, 2000));
    };
    exportPrivateKey = function () {
      return prompt(store, lang.privateKeyEnterPin, function (pin) {
        var index;
        if (!check(pin)) {
          return;
        }
        index = store.current.accountIndex;
        return prompt(store, lang.privateKeyEnterCoin, function (tokenInput) {
          var token,
            wallets,
            ref$,
            ref1$,
            wallet,
            message,
            this$ = this;
          if (typeof token == 'undefined' || token === null) {
            return;
          }
          token = (tokenInput != null ? tokenInput : '').toLowerCase();
          wallets =
            (ref$ =
              (ref1$ = current.account) != null ? ref1$.wallets : void 8) !=
            null
              ? ref$
              : [];
          wallet = find(function (it) {
            var ref$;
            return ((ref$ = it.coin) != null ? ref$.token : void 8) === token;
          })(wallets);
          if (wallet == null) {
            return alert('Wallet not found for ' + token);
          }
          message = 'This is your Private KEY';
          return copyToClipboard(wallet.privateKey, {
            message: message,
          });
        });
      });
    };
    return {
      exportPrivateKey: exportPrivateKey,
      changeAccountIndex: changeAccountIndex,
      accountLeft: accountLeft,
      accountRight: accountRight,
      openAccount: openAccount,
      closeAccount: closeAccount,
      current: current,
      walletStyle: walletStyle,
      info: info,
      activateS1: activateS1,
      activateS2: activateS2,
      activateS3: activateS3,
      switchNetwork: switchNetwork,
      generate: generate,
      enterPin: enterPin,
      cancelTry: cancelTry,
      editSeed: editSeed,
      saveSeed: saveSeed,
      changeSeed: changeSeed,
      refresh: refresh,
      lock: lock,
    };
  };
  function curry$(f, bound) {
    var context,
      _curry = function (args) {
        return f.length > 1
          ? function () {
              var params = args ? args.concat() : [];
              context = bound ? context || this : this;
              return params.push.apply(params, arguments) < f.length &&
                arguments.length
                ? _curry.call(context, params)
                : f.apply(context, params);
            }
          : f;
      };
    return _curry();
  }
}.call(this));
