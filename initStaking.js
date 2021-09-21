import { StakingStore } from "./staking/staking-store.js";

module.exports = (store) => {
    const wallet = store.current.account.wallets.find((it) => it.coin.token === 'vlx_native');
      const walletEvm = store.current.account.wallets.find((it) => it.coin.token === 'vlx2');
      if (wallet == null) {
        return;
      }

      const stakingStore = new StakingStore(
        wallet.network.api.apiUrl,
        wallet.privateKey,
        wallet.publicKey,
        walletEvm.address2, //evm address
        walletEvm.privateKey
      );
      store.stakingStore = stakingStore;
};
