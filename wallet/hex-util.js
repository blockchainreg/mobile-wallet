// Generated by LiveScript 1.5.0
(function () {
  var utils,
    toHexString,
    stringToHex,
    hexToString,
    out$ = (typeof exports != 'undefined' && exports) || this;
  utils = require('ethers').utils;
  toHexString = function (byteArray) {
    return Array.from(byteArray, function (byte) {
      return ('0' + (byte & 255).toString(16)).slice(-2);
    }).join('');
  };
  out$.stringToHex = stringToHex = function (str) {
    var bytes;
    bytes = utils.toUtf8Bytes(str);
    return toHexString(bytes);
  };
  out$.hexToString = hexToString = function (hex) {
    return utils.toUtf8String(hex);
  };
}.call(this));
