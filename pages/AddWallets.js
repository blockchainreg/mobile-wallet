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
  Icon,
  Content,
} from "native-base";
import styles from "../Styles.js";
import { ScrollView} from "react-native";
import RefreshControl from "../components/RefreshControl.js";
import spin from "../utils/spin.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


import dash from "../registry/dash.json";
import etc from "../registry/etc.json";
import eth from "../registry/eth.json";
import ltc from "../registry/ltc.json";
import usdt from "../registry/usdt.json";
import syx from "../registry/syx.json";
import usdt_erc20 from "../registry/usdt_erc20.json";
import bnb from "../registry/bnb-coin.js";
import bscVlx from "../registry/bsc-vlx-coin.js";
import busd from "../registry/busd-coin.js";
import ethLegacy from "../registry/eth-legacy-coin.js";
import huobi from "../registry/huobi-coin.js";
import usdc from "../registry/usdc-coin.js";
import usdtErc20Legacy from "../registry/usdt_erc20_legacy-coin.json";
import vlxEth from "../registry/vlx-eth-coin.js";
import vlxEvmLegacy from "../registry/vlx-evm-legacy-coin.js";
import vlxHuobi from "../registry/vlx-huobi-coin.js";
import vlxUsdt from "../registry/vlx-usdt-coin.js";
import vlxBusd from "../registry/vlx_busd-coin.js";
import vlxUsdc from "../registry/vlx_usdc-coin.js";
import vlxErc20 from "../registry/vlx_erc20-coin.js";


import walletsFuncs from "../wallet/wallets-funcs.js";
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import { LinearGradient } from "expo-linear-gradient";
import Images from '../Images.js';
import Header from '../components/Header'


const coinItems = [
	ltc, usdt, usdt_erc20, syx,
	/*bnb, bscVlx, busd, huobi, usdc, vlxHuobi, vlxUsdt, vlxBusd, vlxUsdc, vlxEth, vlxErc20, vlxEvmLegacy,*/
	ethLegacy, usdtErc20Legacy		
];


const renderCoin = (store, web3t) => item => {
  const tokens = walletsFuncs(store, web3t).wallets.map(x => x.coin.token);
  const isAdded = tokens.indexOf(item.token) > -1;

  const name = item.name || item.token.toUpperCase();

  const addItem = () => {
  const lang = getLang(store);
    spin(store, `${lang.installing || "Installing"} ${name}`, web3t.installQuick.bind(web3t))
      (item, (err, data) => {
      //console.log("install", err, data);
      //store.current.page = "wallets";
    });
  };

  const deleteItem = () => {
  const lang = getLang(store);
    //console.log("Removing coin", name);
    //BUG: This works unstable
    spin(store, `${lang.uninstalling || "Uninstalling"} ${name}`, web3t.uninstall.bind(web3t))(item.token, (err, data) => {
      //console.log("Remove coin result", err, data);
      //store.current.page = "wallets";
    });
  };
  const currentAction = isAdded ? deleteItem : addItem;
  const currentIcon = isAdded ? "ios-remove" : "ios-add";


  return (
    <ListItem
      thumbnail
      style={styles.mbListItem}
      onPress={currentAction}
      key={item.token}
    >
      <Left>
        <Thumbnail square source={{ uri: item.image }} />
      </Left>
      <Body>
        <Text note />
        <Text style={styles.amountView}>{name}</Text>
        <Text note />
      </Body>
      <Right>
        <Button transparent onPress={currentAction}>
          <Icon name={currentIcon} style={styles.iconBtn} />
        </Button>
      </Right>
    </ListItem>
  );
};

export default ({ store, web3t }) => {

  const lang = getLang(store);

  const changePage = tab => () => {
    store.current.page = tab;
  };

  const calcUsd = 0;
  const refreshToken = async bool => {};
  const checkType = type => {
    switch (type) {
      case "USD":
        return <Text style={styles.textCurrency}>$</Text>;
      default:
        return null;
    }
  };

  const back = changePage("wallets");

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
        {RefreshControl({swipeRefresh: refreshToken, store, children: <>
          <Header title={lang.manageWallet} onBack={back}/>
        </>})}
      <View style={[styles.viewMono1, {height: hp("85%")}]}>
      <LinearGradient
            colors={[Images.velasColor4, Images.velasColor4]}
            style={styles.linearGradientBg}
          >
        <View style={styles.viewPt} />
        <ScrollView>
          <Content>
            <List>{coinItems.map(renderCoin(store, web3t))}</List>
          </Content>
        </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};
