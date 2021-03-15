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
import { ScrollView, TouchableOpacity, Image,  RefreshControl, Alert, Vibration, } from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import CustomRefreshControl from "../components/RefreshControl.js";
import Footer from "./Footer.js";
import walletsFuncs from "../wallet/wallets-funcs.js";
import walletFuncs from "../wallet/wallet-funcs.js";
import applyTransactions from "../wallet/apply-transactions.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import Background from "../components/StandardLinearGradient.js";
import { LinearGradient } from "expo-linear-gradient";
import Images from "../Images.js";
import Modal from 'react-native-modal';
import navigate from "../wallet/navigate.js";
import spin from "../utils/spin.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DemoMode from "../components/DemoMode.js"
import roundNumber from "../round-number";
import roundHuman from "../wallet/round-human";




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

    const send = () => {
          if(wallet.balance == "..") return;
          store.current.wallet = wallet.coin.token;
          store.current.walletIndex = wallets.indexOf(wallet);
          store.current.filter.length = 0;
          store.current.filter.push("IN");
          store.current.filter.push("OUT");
          store.current.filter.push(wallet.coin.token);
          store.current.filterVal.temp = "";
          store.current.filterVal.apply = "";
          applyTransactions(store);
          store.current.send["to"] = "";
          store.current.send.amountSend = '0';
          store.current.send.amountSendUsd = '0';
          store.current.send.amountSendFee = '0';
          store.current.send.amountSendFeeUsd = '0';
          store.current.send.error = "";
          store.current.send.wallet = wallet;
          store.current.send.coin = wallet.coin;
          store.current.send.network = wallet.network;
          navigate(store, web3t, "send", () => {});
    }
    const deleteCoin = () => {
      spin(store, `Uninstalling ${wallet.coin.name}`, web3t.uninstall.bind(web3t))(wallet.coin.token, (err, data) => {
      });
    };
    const canRemove = !!global.localStorage[`plugin-${wallet.coin.token}`];
    const buttons = (canRemove
      ? [
        {text: 'Send', onPress: send},
        {text: 'Remove', onPress: deleteCoin},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ]
      : [
        {text: 'Send', onPress: send},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ]);
    const actions =()=>{
      Vibration.vibrate(500);
      Alert.alert(
        'Actions',
        '',
        buttons,
        // { cancelable: false }
      );
    };
    let balanceLayout = null;
	const r_balance = roundNumber(balance, {decimals: 6});
	const walletBalance = roundHuman(r_balance);
    if (wallet.balance !== "..") {
      balanceLayout = (
        <Text>
          <Text style={{ color: "#fff", fontFamily: "Fontfabric-NexaRegular" }}>{walletBalance}</Text>
          <Text note style={{ fontFamily: "Fontfabric-NexaRegular" }}> ({parseFloat(balanceUsd).toFixed(2)} USD)</Text>
        </Text>
      );
    } else {
      balanceLayout = (
        <Text>
          <Text style={{ color: "#fff" }}>-</Text>
          <Text note style={{ fontFamily: "Fontfabric-NexaRegular"}}> (pull to reload)</Text>
        </Text>
      );
    }
  // It opens dialog on scroll - should be fixed
  //    onLongPress={actions}

    return (
      <ListItem
        key={wallet.coin.token}
        thumbnail
        underlayColor={Images.velasColor2}
        onPress={chooseWallet}
        style={styles.mbListItem}
      >
        <Left>
          <Thumbnail square source={{ uri: wallet.coin.image }} />
        </Left>
        <Body>
          <Text style={styles.amountView}>{wallet.coin.name}</Text>
          {balanceLayout}
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
  let calcUsd = parseFloat(store.current.balanceUsd);
  if (isNaN(calcUsd)) {
    calcUsd = store.current.balanceUsd;
  } else {
	const r_calcUsd = roundNumber(calcUsd, {decimals: 2});
	calcUsd = roundHuman(r_calcUsd);
  }

  const refreshBalance = () => {
    store.current.refreshingBalances = true;
    console.log("refresh balance start");
    web3t.refresh((err, data) => {
      store.current.refreshingBalances = false;
      console.log("refresh balance finish");
    });
    return true;
  };

  const isDemoMode = !!localStorage.getItem("is-demo-mode");
  const renderDemoMode = () => {
    if (!isDemoMode) {
      return null;
    }
    return (
      <DemoMode store={store}/>
    );
  };

  const walletListStyle = Object.assign({}, styles.viewMonoWallets);
  if (isDemoMode) {
    if (typeof walletListStyle.height === "string") {
      walletListStyle.height = (walletListStyle.height.substr(0, walletListStyle.height.length - 1) - 3) + "%";
    } else {
      walletListStyle.height -= 50;
    }
  }
  return (
    <View style={styles.container}>
<View style={styles.viewFlex}>
      <Background fullscreen={true}>
        <View style={[styles.topView, {backgroundColor: "transparent", height: "20%", marginTop: hp("5%"), marginHorizontal: "17%", width: "66%", zIndex: 999}]}>
        {CustomRefreshControl({swipeRefresh: refreshBalance, store, children: <>
        </>
          })}
        </View>
        <View style={styles.topView}>
            <Header transparent style={styles.mtIphoneX}>
              <Left style={styles.viewFlexHeader}/>
              <Body style={styles.viewFlexHeader}>
                <Text style={styles.titleWallets}>{lang.yourWallets}</Text>
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


          <View style={styles.viewWalletAbsolute}>
            <Text style={styles.titleAbsolute}>{lang.totalBalance}</Text>
            <Text style={styles.textBalanceAbsolute}>
              {calcUsd} <Text style={styles.textCurrency}>$</Text>
            </Text>
          </View>

        </View>

        <View style={walletListStyle}>

          <LinearGradient
            colors={[Images.velasColor4, Images.velasColor4]}
            style={styles.linearGradientBg}
          >
            <View style={styles.viewPt} />
            <ScrollView
            // onScrollBeginDrag={refreshBalance}


              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={refreshBalance}
                  tintColor="#fff"
                />
              }
            >{wallets(store, web3t)}</ScrollView>
          </LinearGradient>
        </View>

      </Background>
      </View>
            <Footer store={store}></Footer>
            {renderDemoMode()}
    </View>
  );
};
