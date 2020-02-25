import React from "react";
import { Footer, FooterTab, Button } from "native-base";
import { observer } from "mobx-react";
import styles from "../Styles.js";
import { Ionicons } from "@expo/vector-icons";
import applyTransactions from "../wallet/apply-transactions.js";

export default ({ store }) => {
  const changeTab = (tab) => () => {
    store.current.page = tab;
    if(tab == "history") {
      store.current.filter = [ '*' ]
      applyTransactions(store);
    }
  };
  return (
    <Footer style={styles.footerHeight}>
      <FooterTab style={styles.footerTab}>
        <Button
          active={store.current.page == "wallets"}
          style={styles.footerButtonStyle}
          onPress={changeTab("wallets")}
        >
          <Ionicons name="ios-wallet" size={32} style={styles.iconFooter} />
        </Button>
        <Button
          vertical
          active={store.current.page == "history"}
          style={styles.footerButtonStyle}
          onPress={changeTab("history")}
        >
          <Ionicons name="ios-time" size={32} style={styles.iconFooter} />
        </Button>
        <Button
          vertical
          active={store.current.page == "settings"}
          style={styles.footerButtonStyle}
          onPress={changeTab("settings")}
        >
          <Ionicons name="ios-settings" size={32} style={styles.iconFooter} />
        </Button>
      </FooterTab>
    </Footer>
  );
};
