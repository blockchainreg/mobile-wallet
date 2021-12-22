var addCommas;
addCommas = function (x) {
  var pattern;
  x = x.toString();
  pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) {
    x = x.replace(pattern, '$1,$2');
  }
  return x;
};
module.exports = function (value) {
  const MIN_VALUE_LEAVE_TWO_DECIMAL = 1000;
  const MIN_VALUE_REMOVE_DECIMAL = 1000;
  var ref$, head, dec, firstHead;
  if (value == null) {
    return '..';
  }
  if (value === '..') {
    return '..';
  }
  (ref$ = value.toString().split('.')), (head = ref$[0]), (dec = ref$[1]);
  firstHead = addCommas(head);
  if (+value >= MIN_VALUE_REMOVE_DECIMAL) {
    return firstHead;
  }
  if ((dec != null ? dec : '').length === 0) {
    return firstHead + '.00';
  }
  if (dec != null && +dec > 0 && +dec.substr(0, 4) === 0) {
    return firstHead + '.00..';
  }
  if (+value > 0 && +firstHead === 0 && +dec.substr(0, 4) === 0) {
    return '0.00..';
  }
  return firstHead + '.' + dec.substr(0, 4);
};
