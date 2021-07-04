import React from "react";
import { Footer, FooterTab, Button, Thumbnail } from "native-base";
import { observer } from "mobx-react";
import styles from "../Styles.js";
import applyTransactions from "../wallet/apply-transactions.js";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import { StakeIcon, WalletIcon, HistoryIcon, SettingsIcon } from "../svg/index";
import { StakingStore } from "../staking/staking-store.js";

export default ({ store }) => {
  const changeTab = (tab) => () => {
    store.current.page = tab;
    if (tab == "history") {
      store.current.filter = ["*"];
      store.current.filterVal.temp = "";
      store.current.filterVal.apply = "";
      applyTransactions(store);
    }
  };

  const goToStaking = () => {
    const wallet = store.current.account.wallets.find((it) => it.coin.token === 'vlx_native');
    const walletEvm = store.current.account.wallets.find((it) => it.coin.token === 'vlx2');
    if (wallet == null) {
      return;
    }
    // store.walletBalance = wallet.balance;
    // store.walletEvmBalance = walletEvm.balance;

    const stakingStore = new StakingStore(
      wallet.network.api.apiUrl,
      wallet.privateKey,
      wallet.publicKey,
      walletEvm.address2, //evm address
      walletEvm.privateKey
    );
    store.stakingStore = stakingStore;
    changeTab("stakePage")();
  };
  //DO NOT generate footer if transaction info is visible
  if (store.infoTransaction != null) return null;
  return (
    <Footer style={styles.footerHeight}>
      <FooterTab style={styles.footerTab}>
        <Button
          active={store.current.page == "wallets"}
          style={styles.footerButtonStyle}
          onPress={changeTab("wallets")}
        >
          <WalletIcon
            fill={store.current.page == "wallets" && Images.colorGreen}
            onPress={changeTab("wallets")}
          />
        </Button>
        <Button
          active={store.current.page == "stakePage"}
          style={styles.footerButtonStyle}
          onPress={goToStaking}
        >
          <StakeIcon
            fill={store.current.page == "stakePage" && Images.colorGreen}
            onPress={goToStaking}
          />
        </Button>
        <Button
          vertical
          active={store.current.page == "history"}
          style={styles.footerButtonStyle}
          onPress={changeTab("history")}
        >
          <HistoryIcon
            fill={store.current.page == "history" && Images.colorGreen}
            onPress={changeTab("history")}
          />
        </Button>
        <Button
          vertical
          active={store.current.page == "settings"}
          style={styles.footerButtonStyle}
          onPress={changeTab("settings")}
        >
          <SettingsIcon
            fill={store.current.page == "settings" && Images.colorGreen}
            onPress={changeTab("settings")}
          />
        </Button>
      </FooterTab>
    </Footer>
  );
};
