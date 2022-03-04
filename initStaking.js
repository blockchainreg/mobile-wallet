import { StakingStore } from './staking/staking-store.js';

module.exports = (store) => {
  const wallet = store.current.account.wallets.find(
    (it) => it.coin.token === 'vlx_native'
  );
  const walletEvm = store.current.account.wallets.find(
    (it) => it.coin.token === 'vlx_evm'
  );
  if (wallet == null || walletEvm == null) {
    return;
  }

  const stakingStore = new StakingStore(
    wallet.network.api.web3Provider,
    walletEvm.network.api.web3Provider,
    wallet.network.api.validatorsBackend,
    wallet.privateKey,
    wallet.publicKey,
    walletEvm.address, //evm address
    walletEvm.privateKey,
    store.current.network
  );
  store.stakingStore = stakingStore;
};
