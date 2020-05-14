import React from "react";
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  View,
  Title,
  Icon,
  Content,
  Header
} from "native-base";
import styles from "../Styles.js";
import { ScrollView, TouchableOpacity, Image } from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import RefreshControl from "../components/RefreshControl.js";
import Toast from "@rimiti/react-native-toastify";
import Footer from "./Footer.js";
import walletsFuncs from '../wallet/wallets-funcs.js';
import walletFuncs from '../wallet/wallet-funcs.js';
import applyTransactions from '../wallet/apply-transactions.js';
import { times } from "../wallet/math.js";
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import Images from '../Images.js';



const wallets = (store, web3t) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };


  // const lang = getLang(store);
  const wallets = walletsFuncs(store, web3t).wallets;

  const listItem =  (wallet) => {

    const chooseWallet = () => {
      try {
        store.current.wallet = wallet.coin.token;
        store.current.walletIndex = wallets.indexOf(wallet);
        store.current.filter.length = 0;
        store.current.filter.push("IN");
        store.current.filter.push("OUT");
        store.current.filter.push(wallet.coin.token);
        store.current.filterVal.temp = "";
        store.current.filterVal.apply = "";
        applyTransactions(store);
        store.current.page = "wallet";
      }
      catch(err) {
        console.log(err);
      }


    }

    const { active, balance, balanceUsd, pending, usdRate } = walletFuncs(store, web3t, wallets, wallet);


    return (
      <ListItem
          key={wallet.coin.token}
          thumbnail
          onPress={chooseWallet}
          style={styles.mbListItem}
        >
          <Left>
            <Thumbnail source={{uri: wallet.coin.image}} />
          </Left>
          <Body>
            <Text style={styles.amountView}>
              {wallet.coin.name}
            </Text>
            <Text>
              <Text>{balance}</Text>
              <Text note> ({balanceUsd})</Text>
            </Text>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="ios-arrow-forward" style={styles.iconBtn} />
            </Button>
          </Right>
        </ListItem>
    )
  }
  return (
    <Content>
      <List>
        {wallets.map(listItem)}
      </List>
      <View style={styles.touchableCenter}>
        <TouchableOpacity
          onPress={changePage("add")}
          style={styles.touchableAdd}
        >
          <Icon
            name="md-create"
            style={styles.iconAdd}
          />
        </TouchableOpacity>
      </View>
    </Content>
  );
};


export default ({ store, web3t }) => {
  const lang = getLang(store);

  const calcUsd = store.current.balanceUsd;

  const refreshBalance = () => {
      console.log("refresh balance start");
      web3t.refresh((err,data) => {
        console.log("refresh balance finish");
      })
      return true;
  }


  return (
    <View style={styles.container}>
      <View style={styles.viewFlex}>
        <StandardLinearGradient>
          <RefreshControl swipeRefresh={refreshBalance}>
            <Header transparent style={styles.mtIphoneX}>
              <Left style={styles.viewFlex}/>
              <Body style={styles.viewFlex}>
                <Text style={styles.title1}>{lang.totalBalance}</Text>
              </Body>
              <Right style={styles.viewFlex}>
                <Button
                  transparent
                  style={styles.arrowHeaderLeft}
                  onPress={refreshBalance}
                >
                  <Icon
                    name="ios-sync"
                    style={styles.arrowHeaderIcon}
                  />
                </Button></Right>
            </Header>
            <StatusBar barStyle="light-content" />
            <Text style={styles.textBalanceHeader}>
              <Text style={styles.textCurrency}>
                <Text style={styles.textCurrency}>$</Text>
              </Text>
              {" "}{calcUsd}
            </Text>
            </RefreshControl>
        </StandardLinearGradient>
        <View style={styles.viewMonoWallets}>
          <View style={styles.viewPt} />
          <ScrollView>{wallets(store, web3t)}</ScrollView>
        </View>
      </View>
      <Footer store={store}></Footer>
    </View>
  );
};
