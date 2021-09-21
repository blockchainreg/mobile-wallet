import React from "react";
import { View, Text, Footer, FooterTab, Button, Thumbnail } from "native-base";
import { observer } from "mobx-react";
import styles from "../Styles.js";
import applyTransactions from "../wallet/apply-transactions.js";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import { StakeIcon, WalletIcon, HistoryIcon, SettingsIcon } from "../svg/index";
import initStaking from "../initStaking.js";

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
    initStaking(store);
    changeTab("stakePage")();
  };
  const goToWallets = () => {
    // initStaking(store);
    changeTab("wallets")();
  }
  const renderNetwork = () => {
	if (store.current.network === 'mainnet') {
	  return null;
	}
	return (
	  <View style={styles.demoView}>
		<Text style={styles.demoTxt}>
			The default network for all transactions is Testnet
		</Text>
		<Text/>
	  </View>
	)
  }
  //DO NOT generate footer if transaction info is visible
  if (store.infoTransaction != null) return null;
  return (
    <>
    <Footer style={styles.footerHeight}>
      <FooterTab style={styles.footerTab}>
        <Button
          active={store.current.page == "wallets"}
          style={styles.footerButtonStyle}
          onPress={goToWallets}
        >
          <WalletIcon
            fill={store.current.page == "wallets" && Images.colorGreen}
            onPress={goToWallets}
          />
        </Button>
        <Button
          active={store.current.page == "stakePage"}
          style={styles.footerButtonStyle}
          onPress={goToStaking}
          // onPress={changeTab("stakePage")}
        >
          <StakeIcon
            fill={store.current.page == "stakePage" && Images.colorGreen}
            onPress={goToStaking}
            // onPress={changeTab("stakePage")}
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
      {renderNetwork()}
      </>
  );
};
