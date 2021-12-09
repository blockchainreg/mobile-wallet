// Generated by LiveScript 1.6.0
(function(){
  var bignumber, ref$, map, pairsToObj, math, BN, bufferToHex, _;
  bignumber = require('bignumber.js');
  BN = require('ethereumjs-util').BN;
  bufferToHex = require('ethereumjs-util').bufferToHex;
  _ = require('lodash');
  ref$ = require('prelude-ls'), map = ref$.map, pairsToObj = ref$.pairsToObj;
  math = function($){
    return function(x, y){
      var err;
      if (x === '..' || y === '..') {
        return '..';
      }
      try {
        return new bignumber(x + '')[$](y + '').toFixed();
      } catch (e$) {
        err = e$;
        throw x + " " + $ + " " + y + " = " + err;
      }
    };
  };
  module.exports = pairsToObj(
  map(function(it){
    return [it, math(it)];
  })(
  ['plus', 'minus', 'times', 'div']));
  module.exports.fromHex = function(hex){
    return new bignumber(hex + '', 16).toFixed();
  };

  module.exports.$toHex = function (v) {
    if (_.isNumber(v))
      return '0x'+(new BN(v).toString(16));
    if (_.isString(v)) {
      if (v.startsWith('0x'))
        return v.toLowerCase();
      return '0x'+(new BN(v).toString(16));
    }
    if (_.isBuffer(v) || _.isArrayLike(v))
      return bufferToHex(v);
    throw new Error(`Can't convert value to hex: ${v}`);
  }

}).call(this);
