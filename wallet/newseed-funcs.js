// Generated by LiveScript 1.5.0
(function () {
  var navigate,
    set,
    generateMnemonic,
    confirm,
    ref$,
    words,
    map,
    filter,
    join,
    getLang,
    clean,
    fix;
  navigate = require('./navigate.js');
  set = require('./seed.js').set;
  generateMnemonic = require('bip39').generateMnemonic;
  confirm = require('./pages/confirmation.js').confirm;
  (ref$ = require('prelude-ls')),
    (words = ref$.words),
    (map = ref$.map),
    (filter = ref$.filter),
    (join = ref$.join);
  getLang = require('./get-lang.js');
  clean = function (it) {
    var ref$;
    return (ref$ = it.match(/[a-z]+/)) != null ? ref$[0] : void 8;
  };
  fix = compose$(
    words,
    map(clean),
    filter(function (it) {
      return it != null;
    }),
    join(' ')
  );
  module.exports = function (store, web3t) {
    var lang,
      generateSeed,
      performChangeSeed,
      changeSeed,
      weekSeed,
      save,
      hasIssue,
      fixIssue;
    if (store == null || web3t == null) {
      return null;
    }
    lang = getLang(store);
    generateSeed = function () {
      store.current.seed = generateMnemonic();
      return (store.current.seedTemp = store.current.seed);
    };
    performChangeSeed = function () {
      return (store.current.seed = store.current.seedTemp);
    };
    changeSeed = function (event) {
      return (store.current.seedTemp = event.target.value);
    };
    weekSeed = function (cb) {
      if (store.current.seedTemp.length > 20) {
        return cb(null);
      }
      return confirm(
        store,
        'Please confirm to have week seed?',
        function (confirmed) {
          if (confirmed !== true) {
            return cb('not confirmed');
          }
          return cb(null);
        }
      );
    };
    save = function () {
      return weekSeed(function (err) {
        if (err != null) {
          return;
        }
        performChangeSeed();
        return confirm(store, lang.phraseSafePlace, function (confirmed) {
          if (confirmed !== true) {
            return;
          }
          store.current.savedSeed = true;
          set(store.current.seed);
          return navigate(store, web3t, ':init');
        });
      });
    };
    hasIssue = function () {
      if (store.current.seed.length === 0) {
        return false;
      }
      return store.current.seed.match(/^([a-z]+[ ]){0,11}([a-z]+)$/) == null;
    };
    fixIssue = function () {
      store.current.seed = fix(store.current.seed);
      return (store.current.seedTemp = store.current.seed);
    };
    return {
      save: save,
      changeSeed: changeSeed,
      generateSeed: generateSeed,
      hasIssue: hasIssue,
      fixIssue: fixIssue,
    };
  };
  function compose$() {
    var functions = arguments;
    return function () {
      var i, result;
      result = functions[0].apply(this, arguments);
      for (i = 1; i < functions.length; ++i) {
        result = functions[i](result);
      }
      return result;
    };
  }
}.call(this));
