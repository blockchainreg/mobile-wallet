// Generated by LiveScript 1.5.0
(function () {
  module.exports = function (value) {
    var ref$, head, dec;
    if (value == null) {
      return '...';
    }
    (ref$ = value.toString().split('.')), (head = ref$[0]), (dec = ref$[1]);
    if ((dec != null ? dec : '').length === 0) {
      return head + '.00';
    }
    return head + '.' + dec.substr(0, 8);
  };
}.call(this));
