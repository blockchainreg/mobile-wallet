// Generated by LiveScript 1.6.0
(function () {
  var testCoinNonZero,
    mnemonic,
    index,
    toString$ = {}.toString;
  testCoinNonZero = require('./test-coin-non-zero.ls');
  mnemonic = require('./mnemonic.ls');
  index = 0;
  module.exports = function (type, coin, cb) {
    var createAccount, getBalance, calcFee;
    console.log(type);
    (createAccount = coin.createAccount),
      (getBalance = coin.getBalance),
      (calcFee = coin.calcFee);
    if (toString$.call(createAccount).slice(8, -1) !== 'Function') {
      return cb('Create Account is not a function');
    }
    if (toString$.call(getBalance).slice(8, -1) !== 'Function') {
      return cb('Get Balance is not a function');
    }
    return createAccount(
      {
        mnemonic: mnemonic,
        index: index,
      },
      function (err, account) {
        if (account.address == null) {
          return cb('Address is not found');
        }
        if (account.privateKey == null) {
          return cb('Private Key is not found');
        }
        if (err != null) {
          return cb(err);
        }
        return getBalance(
          {
            account: account,
          },
          function (err, balance) {
            if (err != null) {
              return cb(err);
            }
            if (balance == null) {
              return cb('Balance is wrong');
            }
            if (+balance === 0) {
              return cb(null);
            }
            return cb(null);
          }
        );
      }
    );
  };
}.call(this));
