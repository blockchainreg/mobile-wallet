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
  // Header,
  Toast,
} from "native-base";
import StatusBar from "../components/StatusBar.js";
import styles from "../Styles.js";
import { ScrollView, TouchableOpacity, Image,  RefreshControl, Alert, Vibration, StyleSheet} from "react-native";
import CustomRefreshControl from "../components/RefreshControl.js";
import Footer from "./Footer.js";
import walletsFuncs from "../wallet/wallets-funcs.js";
import walletFuncs from "../wallet/wallet-funcs.js";
import applyTransactions from "../wallet/apply-transactions.js";
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
import Header from "../components/Header.js"

function import$(obj, src){
	var own = {}.hasOwnProperty;
	for (var key in src) if (own.call(src, key)) obj[key] = src[key];
	return obj;
}

const wallets = (store, web3t) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const lang = getLang(store);
  const wallets = walletsFuncs(store, web3t).wallets;

	const listItem = (wallet) => {
		const chooseWallet = () => {
			store.current.wallet = wallet.coin.token;
			store.current.walletIndex = wallets.indexOf(wallet);
			store.current.filter.length = 0;
			store.current.filter.filterTxsTypes = ['IN', 'OUT'];
			store.current.filter = {
				token: wallet.coin.token
			};
			store.current.filterVal.temp = "";
			store.current.filterVal.apply = "";
			store.current.page = "wallet";
			try {
				applyTransactions(store);
			} catch (err) {
				return Toast.show({text: err + ""});
			}
		};

    const { active, balance, balanceUsd, pending, usdRate, token } = walletFuncs(
      store,
      web3t,
      wallets,
      wallet
    );

    const send = () => {
      	console.log("send")
          if(wallet.balance == "..") return;
          store.current.wallet = wallet.coin.token;
          store.current.walletIndex = wallets.indexOf(wallet);
          store.current.filter.length = 0;
          if (store.current.filter.push) {
            store.current.filter.push("IN");
            store.current.filter.push("OUT");
            store.current.filter.push(wallet.coin.token);
          }
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
	const balanceRounded = roundNumber(balance, {decimals: 6});
	const walletBalance = roundHuman(balanceRounded);
	const balanceUsdRounded = roundNumber(balanceUsd, {decimals: 2});
	const walletBalanceUsd = roundHuman(balanceUsdRounded);
    
	if (wallet.balance !== "..") {
      balanceLayout = (
        <Text>
          <Text style={{ color: "#fff", fontFamily: "Fontfabric-NexaRegular" }}>{walletBalance} {token}</Text>
          <Text note style={{ fontFamily: "Fontfabric-NexaRegular" }}> ({walletBalanceUsd} USD)</Text>
        </Text>
      );
    } else {
      balanceLayout = (
        <Text>
          <Text style={{ color: "#fff" }}>-</Text>
          <Text note style={{ fontFamily: "Fontfabric-NexaRegular"}}> {lang.pullToReload || "(Pull to reload)"}</Text>
        </Text>
      );
    }
  // It opens dialog on scroll - should be fixed
  //    onLongPress={actions}
	var walletContainerStyle = isNaN(wallet.balance) ? import$({ opacity: 0.4 }, styles.mbListItem ) : styles.mbListItem;

    return (
      <ListItem
        key={wallet.coin.token}
        thumbnail
        underlayColor={Images.velasColor2}
        onPress={chooseWallet}
        style={ walletContainerStyle }
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
  
  // console.log('store.current.network', store.current.network)
  // const walletListStyle = Object.assign({}, style.viewMonoWallets);
  // if (isDemoMode) {
  //   if (typeof walletListStyle.height === "string") {
  //     walletListStyle.height = (walletListStyle.height.substr(0, walletListStyle.height.length - 1) - 3) + "%";
  //   } else {
  //     walletListStyle.height -= 50;
  //   }
  // }
  return (
      <View style={styles.viewFlex}>
        <View style={{backgroundColor: "transparent", height: "18%", marginTop: hp("5%"), alignSelf: 'center', width: "66%", zIndex: 999, position: "absolute"}}>
        {CustomRefreshControl({swipeRefresh: refreshBalance, store, children: <>
        </>
          })}
        </View>
        <View style={style.topView}>
        <Header title={lang.yourWallets} addWalletIcon onForward={changePage("add")} transparent/>
          <View style={style.viewWallet}>
            <Text style={style.balance}>{lang.totalBalance}</Text>
            <Text style={style.balanceAmount}>
              {calcUsd} <Text style={style.balanceAmount}>$</Text>
            </Text>
          </View>

        </View>

        <View style={style.viewMonoWallets}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={refreshBalance}
                  tintColor="#fff"
                />
              }
            >{wallets(store, web3t)}</ScrollView>
        </View>

      <View style={{position: "absolute", bottom: 0, left: 0, right: 0}}>
        <Footer store={store}></Footer>
        {renderDemoMode()}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  topView: {
    flex: 0.25,
  },
  viewWallet: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginBottom: 15,
    flex: 1
  },
  viewMonoWallets: {
    flex: 0.75,
    backgroundColor: Images.velasColor4,
  },
  balance: {
    fontSize: 18, color: "#fff", fontFamily: "Fontfabric-NexaRegular"
  },
  balanceAmount: {
    fontSize: 28, color: "#fff", fontFamily: "Fontfabric-NexaRegular"
  }

});
