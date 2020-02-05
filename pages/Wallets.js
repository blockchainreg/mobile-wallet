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
import { ScrollView, TouchableOpacity } from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import RefreshControl from "../components/RefreshControl.js";
import Toast from "@rimiti/react-native-toastify";
import StatusBar from "../components/StatusBar.js";
import Footer from "./Footer.js";
import walletsFuncs from '../wallet/wallets-funcs.js';
import walletFuncs from '../wallet/wallet-funcs.js';


const wallets = (store, web3t) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };



  const wallets = walletsFuncs(store, web3t).wallets;

  const listItem =  (wallet) => {

    const chooseWallet = () => {
      store.current.wallet = wallet;
      store.current.page = "wallet";

    }

    const { active, balance, pending, usdRate } = walletFuncs(store, web3t, wallets, wallet);

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
              {wallet.coin.token.toUpperCase()}
            </Text>
            <Text note>
              ({wallet.coin.token}{" "}{balance})
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
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const calcUsd = store.current.balanceUsd;

  const refreshBalance = () => {
      web3t.refresh((err,data) => {})
  }


  return (
    <View style={styles.container}>
      <View style={styles.viewFlex}>
        <StandardLinearGradient>
          <RefreshControl swipeRefresh={refreshBalance}>
            <Header transparent style={styles.mtIphoneX}>
              <Left style={styles.viewFlex} />
              <Body style={styles.viewFlex}>
                <Title style={styles.title1}>Total Balance</Title>
              </Body>
              <Right style={styles.viewFlex} />
            </Header>
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
