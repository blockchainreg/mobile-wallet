//Fix for bip39 performance
  const bip39 = require('bip39');
  var seedCaches = Object.create(null);
  const originalFunc = bip39.mnemonicToSeed;

  bip39.mnemonicToSeed = function(mnemonic, password){
    //mnemonicToSeed is very slow on mobile wallet
    //So we add caching. I bet it can be done sipmplier with standard ls library

    var key = mnemonic + "_" + password;
    if (!seedCaches[key]) {
      // console.log('Calc seed', mnemonic);
      seedCaches[key] = originalFunc.call(bip39, mnemonic);
    } else {
      // console.log('Seed cache hit', mnemonic);
    }
    return seedCaches[key];
  };
  bip39.mnemonicToSeedHex = function(mnemonic, password){
    //If we'll not override it, It will call original mnemonicToSeed method without caching
    return bip39.mnemonicToSeed(mnemonic, password).toString('hex');
  };
