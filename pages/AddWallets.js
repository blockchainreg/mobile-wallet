import React from 'react';
import {
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  View,
  Icon,
} from 'native-base';
import styles from '../Styles.js';
import {SectionList, StyleSheet} from 'react-native';
import RefreshControl from '../components/RefreshControl.js';
import spin from '../utils/spin.js';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { filter, groupBy, keys } from 'prelude-ls';

import dash from "../registry/dash.json";
import etc from "../registry/etc.json";
import eth from "../registry/eth.json";
import ltc from "../web3t/plugins/ltc-coin";
import usdt from "../web3t/plugins/usdt-coin";
import syx from "../web3t/plugins/symblox";
import usdt_erc20 from "../web3t/plugins/usdt_erc20.json";
import bnb from "../web3t/plugins/bnb-coin.js";
import bscVlx from "../web3t/plugins/bsc-vlx-coin.js";
import busd from "../web3t/plugins/busd-coin.js";
import ethLegacy from "../web3t/plugins/eth-legacy-coin.js";
import huobi from "../web3t/plugins/huobi-coin.js";
import usdc from "../web3t/plugins/usdc-coin.js";
import usdtErc20Legacy from "../web3t/plugins/usdt_erc20_legacy-coin.json";
import vlxEth from "../web3t/plugins/vlx-eth-coin.js";
import vlxEvmLegacy from "../web3t/plugins/vlx-evm-legacy-coin.js";
import vlxHuobi from "../web3t/plugins/vlx-huobi-coin.js";
import vlxUsdt from "../web3t/plugins/vlx-usdt-coin.js";
import vlxBusd from "../web3t/plugins/vlx_busd-coin.js";
import vlxUsdc from "../web3t/plugins/vlx_usdc-coin.js";
import vlxErc20 from "../web3t/plugins/vlx_erc20-coin.js";

import walletsFuncs from '../wallet/wallets-funcs.js';
import getLang from '../wallet/get-lang.js';
import Background from '../components/Background.js';
import { LinearGradient } from 'expo-linear-gradient';
import Images from '../Images.js';
import Header from '../components/Header';

let coinItems = [
	ltc, usdt, usdt_erc20, syx, bnb,
	bscVlx, busd, huobi, usdc, vlxHuobi,
	vlxUsdt, vlxBusd, vlxUsdc,
	vlxEth, vlxErc20, vlxEvmLegacy,
	ethLegacy, usdtErc20Legacy		
];


const renderCoin = (store, web3t, item) => {
	const { token, name, image } = item;
  const tokens = walletsFuncs(store, web3t).wallets.map(x => x.coin.token);
  const isAdded = tokens.indexOf(token) > -1;
  const tokenName = name || token.toUpperCase();

  const addItem = () => {
  const lang = getLang(store);
    spin(
      store,
      `${lang.installing || "Installing"} ${tokenName}`,
      web3t.installQuick.bind(web3t)
    )(item, (err, data) => {
    });
  };

  const deleteItem = () => {
  const lang = getLang(store);
    //BUG: This works unstable
    spin(
      store,
      `${lang.uninstalling || 'Uninstalling'} ${name}`,
      web3t.uninstall.bind(web3t)
    )(item.token, (err, data) => {});
  };
  const currentAction = isAdded ? deleteItem : addItem;
  const currentIcon = isAdded ? 'ios-remove' : 'ios-add';
	const signColor = isAdded ?  '#ff675d' :  Images.colorGreen;

  return (
    <ListItem
      thumbnail
			noBorder
      style={style.listItem}
      onPress={currentAction}
      key={token}
    >
      <Left>
        <Thumbnail square source={{ uri: image }} />
      </Left>
      <Body>
        <Text style={style.tokenName}>{tokenName}</Text>
      </Body>
      <Right>
        <Button transparent onPress={currentAction}>
          <Icon name={currentIcon} style={[style.iconBtn, {color: signColor}]} />
        </Button>
      </Right>
    </ListItem>
  );
};

export default ({ store, web3t }) => {
  const lang = getLang(store);

  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const currentNetwork = store.current.network;
	coinItems = coinItems.filter((it)=> {
		return !it[currentNetwork].disabled
	});
  const refreshToken = async bool => {};
  const back = changePage("wallets");

	function getWalletsGroups({wallets}){
		return groupBy(function(it){
			return it[currentNetwork].group
		})(
			filter(function(arg$){
				var network = arg$[currentNetwork];
				return network.disabled !== true
			})(wallets));
	}
	const walletsGroups = getWalletsGroups({wallets: coinItems});
	const groups = keys(walletsGroups);
	groups.splice(groups.indexOf('Velas'),1);
	groups.unshift('Velas');

	const listData =
		groups.map(function (groupName) {
			const title = groupName;
			const data = walletsGroups[groupName];
			return { title, data };
		});

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
      {RefreshControl({
        swipeRefresh: refreshToken,
        store,
        children: (
          <>
            <Header title={lang.manageWallet} onBack={back}/>
          </>
        ),
      })}
      <View style={[styles.viewMono1, { height: hp('85%') }]}>
        <SectionList
          style={[{marginBottom: 50}]}
          sections={listData}
          keyExtractor={(item, index) => item.token + index}
          renderItem={({ item }) => renderCoin(store, web3t, item)}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={style.header}>{title}{" "}Network</Text>
          )}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
	header:{
		backgroundColor: Images.velasColor4,
		paddingHorizontal: 10,
		color: "white",
		fontFamily: "Fontfabric-NexaBold",
		paddingBottom: 10,
		paddingTop: 30
	},
	listItem:{
		height: 'auto',
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255,255,255,0.1)",
		paddingVertical: 5,
		backgroundColor: Images.velasColor5,
		marginLeft: 0,
		paddingLeft: 10
	},
	iconBtn: {
		color: "#fff",
		fontSize: 26,
		fontFamily: "Fontfabric-NexaRegular"
	},
	tokenName:{
		fontSize: 18,
		color: "#fff",
		fontFamily: "Fontfabric-NexaRegular",
	}
});
