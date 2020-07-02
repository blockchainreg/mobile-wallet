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
  Header,
} from "native-base";
import styles from "../Styles.js";
import { ScrollView, TouchableOpacity, Image } from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import RefreshControl from "../components/RefreshControl.js";
import Toast from "@rimiti/react-native-toastify";
import Footer from "./Footer.js";
import walletsFuncs from "../wallet/wallets-funcs.js";
import walletFuncs from "../wallet/wallet-funcs.js";
import applyTransactions from "../wallet/apply-transactions.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import Background from "../components/StandardLinearGradient.js";
import { LinearGradient } from "expo-linear-gradient";
import Images from "../Images.js";

const wallets = (store, web3t) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  // const lang = getLang(store);
  const wallets = walletsFuncs(store, web3t).wallets;

  const listItem = (wallet) => {
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
      } catch (err) {
        console.log(err);
      }
    };

    const { active, balance, balanceUsd, pending, usdRate } = walletFuncs(
      store,
      web3t,
      wallets,
      wallet
    );

    return (
      <ListItem
        key={wallet.coin.token}
        thumbnail
        underlayColor={Images.color1}
        onPress={chooseWallet}
        style={styles.mbListItem}
      >
        <Left>
          <Thumbnail square source={{ uri: wallet.coin.image }} />
        </Left>
        <Body>
          <Text style={styles.amountView}>{wallet.coin.name}</Text>
          <Text>
            <Text style={{ color: "#fff" }}>{balance}</Text>
            <Text note> ({balanceUsd})</Text>
          </Text>
        </Body>
        <Right>
          <Button transparent onPress={chooseWallet}>
            <Icon name="ios-arrow-forward" style={styles.iconBtn} />
          </Button>
        </Right>
      </ListItem>
    );
  };
  return (
    <Content>
      <List>{wallets.map(listItem)}</List>
      <View style={styles.touchableCenter} />
    </Content>
  );
};


export default ({ store, web3t }) => {
  const lang = getLang(store);
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const calcUsd = store.current.balanceUsd;

  const refreshBalance = () => {
    console.log("refresh balance start");
    web3t.refresh((err, data) => {
      console.log("refresh balance finish");
    });
    return true;
  };

  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={[Images.color4, Images.color5]}
        style={styles.linearGradientBg}> */}
      <Background fullscreen={true}>
        <View style={styles.topView}>
          <RefreshControl swipeRefresh={refreshBalance}>
            <Header transparent style={styles.mtIphoneX}>
              <Left style={styles.viewFlexHeader}/>
              <Body style={styles.viewFlexHeader}>
                <Text style={styles.title1}>{lang.yourWallets}</Text>
              </Body>
              <Right style={styles.viewFlexHeader}>
                <Button
                  transparent
                  style={styles.arrowHeaderLeft}
                  onPress={changePage("add")}
                >
                  <Icon name="md-create" style={styles.refreshHeaderIcon} />
                </Button>
              </Right>
            </Header>
            <StatusBar
              barStyle="light-content"
              translucent={true}
              backgroundColor={"transparent"}
            />
            {/* <View style={styles.viewMt1} /> */}
            {/* <Text style={styles.title2}>{lang.totalBalance}</Text>
            <Text style={styles.textBalanceHeader}>
              {calcUsd} <Text style={styles.textCurrency}>$</Text>
            </Text> */}
          </RefreshControl>
        </View>

        <View style={styles.viewMonoWallets}>
          <View style={styles.viewWalletBalance}>
          <Text style={styles.title2}>{lang.totalBalance}</Text>
            <Text style={styles.textBalanceHeader}>
              {calcUsd} <Text style={styles.textCurrency}>$</Text>
            </Text>
          </View>
          <LinearGradient
            colors={[Images.color1, Images.color1, Images.color2]}
            style={styles.linearGradientBg}
          >
            <View style={styles.viewPt} />
            <ScrollView>{wallets(store, web3t)}</ScrollView>
          </LinearGradient>
        </View>
      </Background>
      {/* </View> */}
      {/* </LinearGradient> */}
      <Footer store={store}></Footer>
    </View>
  );
};
