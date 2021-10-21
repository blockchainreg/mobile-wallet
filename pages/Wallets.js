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
	Toast, Container,
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
import Modal from "react-native-modal";
import navigate from "../wallet/navigate.js";
import spin from "../utils/spin.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DemoMode from "../components/DemoMode.js";
import roundNumber from "../round-number";
import roundHuman from "../wallet/round-human";
import Header from "../components/Header.js";
import { Observer } from "mobx-react";
import { formatAmount } from "../utils/format-value";
import { keys, groupBy, filter, objToPairs, map } from "prelude-ls";
import WalletItem from "../components/WalletItem.js";


function import$(obj, src){
	var own = {}.hasOwnProperty;
	for (var key in src) if (own.call(src, key)) obj[key] = src[key];
	return obj;
}
//
// function walletGroup(store, web3t, wallets, groups){
//	
// }
//
// function getWalletsGroups(wallets){
// 	const walletsGroups = keys(
// 		groupBy(function(it){
// 			return it.network.group;
// 		})(
// 			filter(function(arg$){
// 				var coin, network;
// 				coin = arg$.coin, network = arg$.network;
// 				return (coin.name + coin.token).toLowerCase().indexOf(store.current.search.toLowerCase()) !== -1 && network.disabled !== true;
// 			})(wallets != null ? wallets : [])));
// 	return walletsGroups;
// }

const wallets = (store, web3t) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const lang = getLang(store);
  const wallets = walletsFuncs(store, web3t).wallets;
	// const walletsGroups = this.getWalletsGroups(wallets);
	
	
	
	const listItem = (wallet) => {
    const { active, balance, balanceUsd, pending, usdRate, token } =
      walletFuncs(store, web3t, wallets, wallet);
		
		const chooseWallet = () => {
			if (isNaN(wallet.balance)) return;
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

    const send = () => {
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
			store.current.send.amountSend = '';
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
    const buttons = canRemove
      ? [
          { text: "Send", onPress: send },
          { text: "Remove", onPress: deleteCoin },
          { text: "Cancel", onPress: () => {}, style: "cancel" },
        ]
      : [
          { text: "Send", onPress: send },
          { text: "Cancel", onPress: () => {}, style: "cancel" }
        ];
    const actions = () => {
      Vibration.vibrate(500);
      Alert.alert(
        "Actions",
        "",
        buttons
        // { cancelable: false }
      );
    };
    let balanceLayout = null;
    const balanceRounded = roundNumber(balance, { decimals: 6 });
    const walletBalance = !isNaN(wallet.balance) ? roundHuman(balanceRounded) : lang.pullToReload || "(Pull to reload)";
    const balanceUsdRounded = roundNumber(balanceUsd, { decimals: 2 });
    const walletBalanceUsd = roundHuman(balanceUsdRounded);
    if (wallet.balance !== "..") {
      balanceLayout = (
        <Text>
          <Text style={{ color: "#fff", fontFamily: "Fontfabric-NexaRegular" }}>
            {walletBalance} {token}
          </Text>
          <Text note style={{ fontFamily: "Fontfabric-NexaRegular" }}>
            {" "}
            ({walletBalanceUsd} USD)
          </Text>
        </Text>
      );
    } else {
      balanceLayout = (
        <Text>
          <Text style={{ color: "#fff" }}>-</Text>
          <Text note style={{ fontFamily: "Fontfabric-NexaRegular" }}>
            {" "}
            {lang.pullToReload || "(Pull to reload)"}
          </Text>
        </Text>
      );
    }
  // It opens dialog on scroll - should be fixed
  //    onLongPress={actions}
		var typeBadge = !isNaN(wallet.balance) ? "active" : "inactive";

    return (
			<WalletItem
				key={wallet.coin.token}
				wallet={wallet}
				active={!isNaN(wallet.balance)}
				name={wallet.coin.name}
				token={wallet.coin.nickname}
				usdRate={roundHuman(usdRate)}
				balanceUsd={walletBalanceUsd}
				balance={walletBalance}
				thumbnail
				underlayColor={Images.velasColor2}
				onPress={chooseWallet}
				typeBadge={typeBadge}
				address={wallet.address}
				store={store}
			/>
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
  const { stakingStore } = store;

  const lang = getLang(store);
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
 
  const refreshBalance = () => {
    store.current.refreshingBalances = true;
    //TODO: make reloadWithRetry query non-blocking main thread
    //stakingStore.reloadWithRetry();
    web3t.refresh((err, data) => {
      store.current.refreshingBalances = false;
    });
    return true;
  };

  const isDemoMode = !!localStorage.getItem("is-demo-mode");
  const renderDemoMode = () => {
    if (!isDemoMode) {
      return null;
    }
    return <DemoMode store={store} />;
  };

  const totalBalance = () => {
    // const filterStake = stakingStore.getStakedValidators();
    // if (!filterStake || stakingStore.isRefreshing) {
    //   return (
    //     <Text style={style.balanceAmount}>
    //       ... <Text style={style.balanceAmount}>$</Text>{" "}
    //     </Text>
    //   );
    // }
    // let myStakeBalance = filterStake.map((el) => formatAmount(el.myStake));
    // console.log("myStakeBalance", myStakeBalance);
    function arraySum(arr) {
      let sum = 0;
      if (arr.length) {
        sum = arr.reduce((a, b) => {
          return (parseFloat(a) || 0) + (parseFloat(b) || 0);
        });
      } else {
        sum = 0;
      }
      return sum;
    }
    // let arraySumStake = arraySum(myStakeBalance);
    // arraySumStake = Math.floor(arraySumStake * 100) / 100;
    // const arraySumStakeUsd = arraySumStake * store.rates.vlx2;

    let calcUsd = parseFloat(store.current.balanceUsd);
    if (isNaN(calcUsd)) {
      calcUsd = store.current.balanceUsd;
    } else {
      // const r_calcUsd = roundNumber(calcUsd + arraySumStakeUsd, {
	  const r_calcUsd = roundNumber(calcUsd, {
        decimals: 2,
      });
      calcUsd = roundHuman(r_calcUsd);
      // console.log("calcUsd", calcUsd);
    }
    return (
      <Observer>
        {() => {
          return (
            <Text style={style.balanceAmount}>
							<Text style={style.balanceAmount}>$</Text>{" "}
              {!calcUsd ? "..." : calcUsd}
              
            </Text>
          );
        }}
      </Observer>
    );
  };

  return (
    <View style={styles.viewFlex}>
      <View
        style={{
          backgroundColor: "transparent",
          height: "18%",
          marginTop: hp("5%"),
          alignSelf: "center",
          width: "66%",
          zIndex: 999,
          position: "absolute",
        }}
      >
        {CustomRefreshControl({
          swipeRefresh: refreshBalance,
          store,
          children: <></>,
        })}
      </View>
      <View style={style.topView}>
        <Header
          title={lang.yourWallets}
          addWalletIcon
          onForward={changePage("add")}
          transparent
        />
        <View style={style.viewWallet}>
          <Text style={style.balance}>{lang.totalBalance}</Text>
          {totalBalance()}
          {/* <Text style={style.balanceAmount}>
            {calcUsd} <Text style={style.balanceAmount}>$</Text>{" "}
          </Text> */}
        </View>
      </View>

      <View style={style.viewMonoWallets}>
        <ScrollView
					style={[{marginBottom: 30}]}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refreshBalance}
              tintColor="#fff"
            />
          }
        >
          {wallets(store, web3t)}
        </ScrollView>
      </View>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
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
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    marginBottom: 15,
    flex: 1,
  },
  viewMonoWallets: {
    flex: 0.75,
    backgroundColor: Images.velasColor4,
  },
  balance: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
		marginBottom: 5,
		opacity: 0.7
  },
  balanceAmount: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
  },
  balanceStake: {
    fontSize: 14,
    color: "#ffffff65",
    fontFamily: "Fontfabric-NexaRegular",
  },
});
