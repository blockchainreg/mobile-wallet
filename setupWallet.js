const terms = require("./terms.js");
import spin from "./utils/spin.js";

import eth from "./registry/eth.json";
import ltc from "./registry/ltc.json";
import usdt from "./registry/usdt.json";
import {installPluginWORefresh} from "./wallet/install-plugin.js";
async function loadTerms(store) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/askucher/expo-web3/dev/TERMS.md');
    store.current.termsMarkdown = await response.text();
  }catch(e) {
    console.error(e);
    setTimeout(loadTerms.bind(this, store), 1000);
  }
}


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
      preinstallCoins([eth, ltc, usdt], cb)
    })
  }
  // store.current.termsMarkdown = terms;
	loadTerms(store);
  store.current.page = "terms";
  web3t.init(function(err, data) {
      if (err) {
          store.current.page = "error";
          store.current.error = err + "";
          return;
      }
      spin(store, `Setting up your wallet`, postInit)(function(err){
        if (err) {
          store.current.page = "error";
          store.current.error = err + "";
        }
      });
    });
}
