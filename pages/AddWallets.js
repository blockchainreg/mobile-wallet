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
import { ScrollView} from "react-native";
import RefreshControl from "../components/RefreshControl.js";
import spin from "../utils/spin.js";
import StatusBar from "../components/StatusBar.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

//
import dash from "../registry/dash.json";
import etc from "../registry/etc.json";
import eth from "../registry/eth.json";
import ltc from "../registry/ltc.json";
import usdt from "../registry/usdt.json";
import syx from "../registry/syx.json";
import usdt_erc20 from "../registry/usdt_erc20.json";
import walletsFuncs from "../wallet/wallets-funcs.js";
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import { LinearGradient } from "expo-linear-gradient";
import Images from '../Images.js';
//

const coinItems = [/*etc, */eth, ltc, /*dash, */usdt, usdt_erc20, syx];

const renderCoin = (store, web3t) => item => {
  const tokens = walletsFuncs(store, web3t).wallets.map(x => x.coin.token);
  const isAdded = tokens.indexOf(item.token) > -1;

  const name = item.name || item.token.toUpperCase();


  const addItem = () => {
    spin(store, `Installing ${name}`, web3t.installQuick.bind(web3t))
      (item, (err, data) => {
      //console.log("install", err, data);
      //store.current.page = "wallets";
    });
  };

  const deleteItem = () => {
    //console.log("Removing coin", name);
    //BUG: This works unstable
    spin(store, `Uninstalling ${name}`, web3t.uninstall.bind(web3t))(item.token, (err, data) => {
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
      {/* <StatusBar /> */}
      <Background fullscreen={true}/>
        {RefreshControl({swipeRefresh: refreshToken, store, children: <>
          <Header transparent style={styles.mtIphoneX}>
            <Left style={styles.viewFlexHeader}>
              <BackButton onBack={back}/>
            </Left>
            <Body style={styles.viewFlexHeader}>
              <Text style={styles.title1}>{lang.manageWallet}</Text>
            </Body>
            {/* <Right style={styles.viewFlexHeader}><Button transparent><Icon name="ios-add" style={{color: '#fff'}}></Icon></Button></Right> */}
            <Right style={styles.viewFlex} />
          </Header>
          <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
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
