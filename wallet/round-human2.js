var addCommas;
addCommas = function(x){
  var pattern;
  x = x.toString();
  pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) {
	x = x.replace(pattern, "$1,$2");
  }
  return x;
};
module.exports = function(value, config){
  const MIN_VALUE_LEAVE_TWO_DECIMAL = 1000;
  const MIN_VALUE_REMOVE_DECIMAL = 100;
  var ref$, head, dec, firstHead;
  if (value == null) {
		return '..';
  }
  if (value === '..') {
		return '..';
  }
  ref$ = value.toString().split('.'), head = ref$[0], dec = ref$[1];
  firstHead = addCommas(head);
  if (+value >= MIN_VALUE_REMOVE_DECIMAL){
    return firstHead;
  }
  if ((dec != null ? dec : "").length === 0) {
	return firstHead + ".00";
  }
  const decimals = config && config.decimals && +config.decimals > 4 ? +config.decimals : 10;
  // if ((+value > 0) && (+head === 0) && (+dec.substr(0, decimals) === 0)) {
  // 	return "0.00000.."
	// }
  return firstHead + "." + dec.substr(0, decimals);
};