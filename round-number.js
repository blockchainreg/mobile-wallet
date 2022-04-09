module.exports = function (value, config = null) {
  const MIN_VALUE_LEAVE_TWO_DECIMAL = 1000;
  const MIN_VALUE_REMOVE_DECIMAL = 1000000;
  var decimals, digits, maxValue, ref$, head, dec;
  try {
    if (value == null) {
      return '0';
    }
    (decimals = config.decimals),
      (digits = config.digits),
      (maxValue = config.maxValue);
    if (maxValue != null && +value > +maxValue) {
      return maxValue;
    }
    if (
      +value >= MIN_VALUE_LEAVE_TWO_DECIMAL &&
      +value < MIN_VALUE_REMOVE_DECIMAL
    ) {
      (ref$ = value.toString().split('.')), (head = ref$[0]), (dec = ref$[1]);
      if (!dec) {
        return head;
      }
      var dec_ = dec.substr(0, 2);
      return head + '.' + dec_;
    }
    if (+value >= MIN_VALUE_REMOVE_DECIMAL) {
      (ref$ = value.toString().split('.')), (head = ref$[0]);
      return head;
    }
    if (decimals == null) {
      decimals = 10;
    }
    if (+value === 0 && (value + '').length <= decimals) {
      return value;
    }
    (ref$ = value.toString().split('.')), (head = ref$[0]), (dec = ref$[1]);
    if (digits != null && head.length > digits) {
      head = head.substr(0, digits);
    }
    if (dec == null) {
      return head;
    }
    dec = dec.substr(0, decimals);
    return head + '.' + dec;
  } catch (e) {
    console.error(e);
    return '-';
  }
};
