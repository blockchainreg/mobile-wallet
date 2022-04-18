import { find, map, pairsToObj, foldl, filter } from 'prelude-ls';

import { getBalance } from './api';
import { times, plus } from './math';
import { run, task } from './workflow';
import round5 from './round5';

const FETCH_BALANCE_TIMEOUT = 10000;
const EUR_RATE = 0.893191;
const NO_BALANCE_PLACEHOLDER = '..';

const fetchBalanceFromApi = (cb, wallet, token, usdRate, state) => {
  let requestHasBeenHandled = false;
  let requestTimeoutID;

  const balanceApiResponseHandler = (err, balance) => {
    if (requestHasBeenHandled) {
      return;
    }

    requestHasBeenHandled = true;
    clearTimeout(requestTimeoutID);

    if (err) {
      console.warn(`fetchBalanceFromApi failed for ${token} with err:`, err);
    }

    const pendingSent = 0;
    // map(function(it){
    //   return it.amount;
    // })(
    // filter(function(it){
    //   return it.pending === true;
    // })(
    // filter(function(it){
    //   return it.token === token;
    // })(
    // store.transactions.all))));
    wallet.pendingSent = pendingSent;

    wallet.balance = (() => {
      switch (false) {
        case !isNaN(balance):
          return NO_BALANCE_PLACEHOLDER;
        default:
          return balance + '';
      }
    })();

    wallet.balanceUsd = (() => {
      switch (false) {
        case !isNaN(balance) && !isNaN(usdRate):
          return NO_BALANCE_PLACEHOLDER;
        default:
          return times(balance + '', usdRate + '');
      }
    })();
    const walletBalanceUSD = isNaN(wallet.balanceUsd) ? 0 : wallet.balanceUsd;
    state.balanceUsd = plus(state.balanceUsd, walletBalanceUSD);

    return cb();
  };

  requestTimeoutID = setTimeout(
    () =>
      balanceApiResponseHandler(
        new Error(`getBalance ${FETCH_BALANCE_TIMEOUT}ms timeout exceed`)
      ),
    FETCH_BALANCE_TIMEOUT
  );

  return getBalance(
    {
      address: wallet.address,
      network: wallet.network,
      token,
      account: {
        address: wallet.address,
        privateKey: wallet.privateKey,
      },
    },
    balanceApiResponseHandler
  );
};

async function calcWallet(store, cb) {
  const start = Date.now();
  console.log('calcWallet.......');
  if (store == null) {
    return cb('Store is required');
  }

  const wallets = store.current.account.wallets;
  const rates = store.rates;
  const state = {
    balanceUsd: 0,
  };

  const createBalanceLoaderTask = (wallet) => {
    return task((cb) => {
      const token = wallet.coin.token.toLowerCase();
      const usdRate = rates[token] || NO_BALANCE_PLACEHOLDER;

      wallet.usdRate = (() => {
        if (usdRate === NO_BALANCE_PLACEHOLDER) {
          return NO_BALANCE_PLACEHOLDER;
        }

        return round5(usdRate);
      })();

      wallet.eurRate = (() => {
        if (usdRate === NO_BALANCE_PLACEHOLDER) {
          return NO_BALANCE_PLACEHOLDER;
        }

        return round5(times(usdRate, EUR_RATE));
      })();

      return fetchBalanceFromApi(cb, wallet, token, usdRate, state);
    });
  };

  const tasks = wallets.map(createBalanceLoaderTask);

  try {
    await run(tasks);
    store.current.balanceUsd = round5(state.balanceUsd);
  } catch (err) {
    console.error('calcWallet failed with err:', err);
    return cb(err);
  }

  const end = Date.now();
  console.log(`calcWallet took ${end - start}ms`);

  return cb(null);
}

module.exports = calcWallet;
