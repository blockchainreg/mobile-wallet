// Generated by LiveScript 1.6.0
(function () {
  console.log('locad coins');
  var btc,
    dash,
    eth,
    etc,
    symblox,
    vlxSol,
    ltc,
    usdt,
    ref$,
    objToPairs,
    pairsToObj,
    filter,
    onlyCoins,
    extendCoins,
    toString$ = {}.toString;
  btc = require('./plugins/btc-coin.js');
  dash = require('./plugins/dash-coin.js');
  eth = require('./plugins/eth-coin.js');
  etc = require('./plugins/etc-coin.js');
  symblox = require('./plugins/symblox.js');
  symblox = require('./plugins/symblox-v2.js');
  ltc = require('./plugins/ltc-coin.js');
  usdt = require('./plugins/usdt-coin.js');
  sol = require('./plugins/sol-coin.js');
  vlx_erc20 = require('./plugins/vlx_erc20-coin.js');
  (ref$ = require('prelude-ls')),
    (objToPairs = ref$.objToPairs),
    (pairsToObj = ref$.pairsToObj),
    (filter = ref$.filter);
  onlyCoins = function (plugins) {
    return pairsToObj(
      filter(function (it) {
        var ref$;
        return ((ref$ = it[1]) != null ? ref$.type : void 8) === 'coin';
      })(objToPairs(plugins))
    );
  };
  extendCoins = function (coins, config) {
    if (toString$.call(config.plugins).slice(8, -1) !== 'Object') {
      return;
    }
    return importAll$(coins, onlyCoins(config.plugins));
  };
  module.exports = function (config, cb) {
    var def;
    def = {
      sol: sol,
      vlx_erc20: vlx_erc20,
      btc: btc,
      dash: dash,
      eth: eth,
      ltc: ltc,
      usdt: usdt,
      etc: etc,
      symblox: symblox,
    };
    extendCoins(def, config);
    return cb(null, def);
  };
  function importAll$(obj, src) {
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}.call(this));
