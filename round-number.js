module.exports = function(value, config){
  var decimals, digits, maxValue, ref$, head, dec;
  if (value == null) {
	return "0";
  }
  decimals = config.decimals, digits = config.digits, maxValue = config.maxValue;
  if (maxValue != null && +value > +maxValue) {
	return maxValue;
  }
  if (decimals == null) {
	decimals = 10;
  }
  if (+value === 0 && (value + "").length <= decimals) {
	return value;
  }
  ref$ = value.toString().split('.'), head = ref$[0], dec = ref$[1];
  if (digits != null && head.length > digits) {
	head = head.substr(0, digits);
  }
  if (dec == null) {
	return head;
  }
  dec = dec.substr(0, decimals);
  return head + "." + dec;
};