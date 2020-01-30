// Inject node globals into React Native global scope.
import {getRandomBytesAsync} from 'expo-random';
import {YellowBox} from 'react-native'

global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.document = global.document || Object.create(null);

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

if (typeof Buffer.prototype.reverse === 'undefined') {
  var bufferReverse = require('buffer-reverse');

  Buffer.prototype.reverse = function () {
    return bufferReverse(this);
  };
}

if (!global.crypto) {
   global.mycrypto = global.crypto = {};
   console.log('Creating crypto object');
}
global.crypto.randomBytes = window.randomBytes = getRandomBytesAsync;
global.self = global;

const prevConsoleWarn = console.warn;
YellowBox.ignoreWarnings([
  "The provided value 'ms-stream' is not a valid 'responseType'",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'."
]);
