import React from "react";
import { Footer, FooterTab, Button,Thumbnail } from "native-base";
import { observer } from "mobx-react";
import styles from "../Styles.js";
import { Ionicons } from "@expo/vector-icons";
import applyTransactions from "../wallet/apply-transactions.js";
import getLang from '../wallet/get-lang.js';
import Images from "../Images.js";



export default ({ store }) => {
  const changeTab = (tab) => () => {
    store.current.page = tab;
    if(tab == "history") {
      store.current.filter = [ '*' ]
      store.current.filterVal.temp = "";
      store.current.filterVal.apply = "";
      applyTransactions(store);
    }
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
          <Thumbnail square small source={Images.btnWallet} style={styles.iconFooter1} onPress={changeTab("wallets")}/>

        </Button>
        <Button
          vertical
          active={store.current.page == "history"}
          style={styles.footerButtonStyle}
          onPress={changeTab("history")}
        >
          <Thumbnail square small source={Images.btnHistory} style={styles.iconFooter2} onPress={changeTab("history")}/>
        </Button>
        <Button
          vertical
          active={store.current.page == "settings"}
          style={styles.footerButtonStyle}
          onPress={changeTab("settings")}
        >
          <Thumbnail square small source={Images.btnSettings} style={styles.iconFooter2} onPress={changeTab("settings")}/>
        </Button>
      </FooterTab>
    </Footer>
  );
};
