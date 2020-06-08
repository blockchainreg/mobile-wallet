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
  return (
    <Footer style={styles.footerHeight}>
      <FooterTab style={styles.footerTab}>
        <Button
          active={store.current.page == "wallets"}
          style={styles.footerButtonStyle}
          onPress={changeTab("wallets")}
        >
          {/* <Ionicons name="ios-wallet" size={32} style={styles.iconFooter} /> */}
          <Thumbnail square small source={Images.btnWallet} style={styles.iconFooter1}/>
          
        </Button>
        <Button
          vertical
          active={store.current.page == "history"}
          style={styles.footerButtonStyle}
          onPress={changeTab("history")}
        >
          {/* <Ionicons name="ios-time" size={32} style={styles.iconFooter} /> */}
          <Thumbnail square small source={Images.btnHistory} style={styles.iconFooter2}/>
        </Button>
        <Button
          vertical
          active={store.current.page == "settings"}
          style={styles.footerButtonStyle}
          onPress={changeTab("settings")}
        >
          {/* <Ionicons name="ios-settings" size={32} style={styles.iconFooter} /> */}
          <Thumbnail square small source={Images.btnSettings} style={styles.iconFooter2}/>
        </Button>
      </FooterTab>
    </Footer>
  );
};
