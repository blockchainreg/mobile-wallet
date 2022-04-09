import calcWallet from './calc-wallet';
import loadRates from './load-rates';
import { run, task } from './workflow';

const refreshWallet = async (web3, store, cb) => {
  try {
    store.current.refreshing = true;
    const tasks = [
      task((cb) => loadRates(store, cb)),
      task((cb) => calcWallet(store, cb)),
    ];

    await run(tasks);
  } catch (err) {
    console.err('refreshWallet: err', err);
    return cb(err);
  } finally {
    store.current.refreshing = false;
  }

  return cb(null);
};

module.exports = refreshWallet;
