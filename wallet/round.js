// Generated by LiveScript 1.5.0
(function () {
  var ref$, times, div;
  (ref$ = require('./math.js')), (times = ref$.times), (div = ref$.div);
  module.exports = function (val) {
    var r;
    r = Math.round(times(val, 100));
    return div(r, 100);
  };
}.call(this));
