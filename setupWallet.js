import * as SecureStore from 'expo-secure-store';

const terms = require("./terms.js");
import spin from "./utils/spin.js";

import eth from "./registry/eth.json";
import ltc from "./registry/ltc.json";
import usdt from "./registry/usdt.json";
import {installPluginWORefresh} from "./wallet/install-plugin.js";
import getLang from './wallet/get-lang.js';
import initStaking from './initStaking.js';

module.exports = (store, web3t) => {
  function preinstallCoins([coin, ...coins], cb) {
    if (!coin) {
      return cb();
    }
    const name = coin.name || coin.token.toUpperCase();
    console.log(`installing ${name}`);
    if (coins.length > 0) {
        installPluginWORefresh(coin, function(err, data){
          if (err) {
            return cb(err);
          }
          preinstallCoins(coins, cb);
        });
    } else {
        web3t.installQuick(coin, function(err, data){
          if (err) {
            return cb(err);
          }
          preinstallCoins(coins, cb);
        });
    }
  }

  function postInit(cb) {
    web3t.refresh((err) => {
      if (err) {
        return cb(err);
      }
      preinstallCoins([eth, /*ltc, */usdt], cb)
    })
  }
  const lang = getLang(store);

  function initWallet(cb) {
      SecureStore.deleteItemAsync("localAuthToken")
      spin(store, lang.settingUp, (cb) => web3t.init(function(err, data) {
          if (err) {
            return cb(err);
          }
          postInit(cb);
      }))(cb);
  }
  initWallet((err) => {
    if (err) {
        store.current.page = "error";
        store.current.error = err + "";
        return;
    }
    initStaking(store);
    store.current.page = "wallets";
  });
  // store.current.termsMarkdown = terms;
}
