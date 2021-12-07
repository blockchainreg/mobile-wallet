// Generated by LiveScript 1.6.0
import React, {Component, useEffect, useState, useCallback} from "react";
import {Platform, StyleSheet, View} from "react-native";
import styles from "../../Styles";
import icons from "../../wallet/icons.js";
import tokenNetworks from "../../wallet/swapping/networks.js";
import { map, find, objToPairs, filter, pairsToObj } from "prelude-ls";
import {Button, Input, Text} from "native-base";
import Images from "../../Images.js";
import {Ionicons} from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import getLang from "../../wallet/get-lang";
import {ifIphoneX} from "react-native-iphone-x-helper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { modal } from "../../wallet/pages/confirmation";
import contracts from "../../wallet/contracts";
import spin from "../../utils/spin";
import roundHuman from "../../wallet/round-human";

const NetworkChooser = (props) => {
	
	const { store, web3t, wallet, onChange } = props;
	let   { chosenNetwork, isSwap } = store.current.send;
	const { networks } = wallet.network;
	const { wallets } = store.current.account;
	const lang = getLang(store);
	var swaps = contracts({store, web3t});
	
	function importAll$(obj, src){
		for (var key in src) obj[key] = src[key];
		return obj;
	}
	
	if (chosenNetwork == null) return null;

	if (!(isSwap != null && isSwap)) {
		return null;
	}
	if (networks == null || Object.keys(networks).length === 0) {
		return null;
	}

	const $wallets = pairsToObj(
		map(function(it){
			return [it.coin.token, it];
		})(wallets));

  const availableNetworks = pairsToObj(
    filter(function (it) {
      return (
        $wallets[it[1].referTo] != null &&
        (it[1].disabled == null || it[1].disabled === false)
      );
    })(objToPairs(networks))
  );
  
  function getNetworkById(id) {
    return availableNetworks[id + ""];
  };
  
	const items = objToPairs(availableNetworks).map((pair) => {
		const [ id, data ] = pair;
		return { label: data.name, value: id };
	});
	
  function getDefaultRecipientAddress(){
		if (!store.current.send.chosenNetwork) {
			return "";
		}
		const token = store.current.send.chosenNetwork.referTo;
		const wallet = find(function(it){
			return it.coin.token === token;
		})(wallets);
		if (wallet == null) {
			return "";
		}
		return wallet.address;
	};
	
	const onValueChangeValue = (walletToken) => {
		Platform.OS === "android"
			? changeNetwork(walletToken)
			: changeNetwork(walletToken);
	};
	
	const onValueChangeIos = (walletToken) => {
		const { referTo } = chosenNetwork;
		if (store.current.refreshing) {
			return;
		}
		if (referTo === walletToken) {
			store.current.switchNetwork = false;
			return;
		}
		
		store.current.send.chosenNetwork = getNetworkById(walletToken);
		
		store.current.send.to = getDefaultRecipientAddress();
		store.current.send.error = '';
		store.current.send.data = null;	
		return true;
	}
	// for IOS
	const onDone = () => {
		console.log("onDone");
		swaps.getBridgeInfo((err) => {
			if (err) {
				console.error(err);
			}
			store.current.refreshing = false;
			store.current.switchNetwork = false;
			return true;
		});
	};
	
	const changeNetwork = walletToken => {
		const { referTo } = chosenNetwork;
		if (store.current.refreshing) {
			return;
		}
		if (referTo === walletToken) {
			store.current.switchNetwork = false;
			return;
		}
		
		store.current.send.chosenNetwork = getNetworkById(walletToken);
	
		store.current.send.to = getDefaultRecipientAddress();
		store.current.send.error = '';
		store.current.send.data = null;
		
		swaps.getBridgeInfo((err) => {
			if (err) {
				console.error(err);
			}
			store.current.refreshing = false;
			store.current.switchNetwork = false;
		});
	};
	
	const isNotBridge = function(){
		var token, chosenNetwork, ref$;
		token = store.current.send.wallet.coin.token;
		chosenNetwork = store.current.send.chosenNetwork;
		return ((ref$ = chosenNetwork.referTo) === 'vlx_evm' || ref$ === 'vlx2' || ref$ === 'vlx_native') && (token === 'vlx_evm' || token === 'vlx2' || token === 'vlx_native');
	};
	
	const openBridgeDetailsModal = () => {
		if (isNotBridge()) {
			return;
		}
		if (!store.current.send.wallet){
			return;
		}
		const {dailyLimit,homeFeePercent,minPerTx,maxPerTx,remainingDailyLimit}  = store.current.networkDetails;
		store.current.currentNetworkDetails = {};
		store.current.currentNetworkDetails.remainingDailyLimit = remainingDailyLimit;
		store.current.currentNetworkDetails.homeFeePercent = homeFeePercent;
		store.current.currentNetworkDetails.minPerTx = minPerTx;
		store.current.currentNetworkDetails.maxPerTx = maxPerTx;
		store.current.currentNetworkDetails.wallet = store.current.send.wallet;
	
		// store.current.currentNetworkDetails = importAll$(store.current.networkDetails, {
		// 	wallet: wallet
		// });
		modal(store, function () {});
	}
	
	const pickerSelectStyles = {
		paddingTop: 10,
		inputIOS: {
			color: 'white',
			fontSize: 17,
			paddingLeft: 2,
			paddingTop: 5,
			paddingBottom: 2,
			marginTop: 8,
			borderBottomColor: "#fff",
			borderBottomWidth: 0.4,
		},
		inputAndroid: {
			color: 'white',
			fontSize: 17,
			paddingLeft: 2,
			paddingTop: 5,
			paddingBottom: 2,
			marginTop: 8,
			borderBottomColor: "#fff",
			borderBottomWidth: 0.4,
			fontFamily: "Fontfabric-NexaBold",
		},
		placeholderColor: 'white',
		underline: {
			borderTopWidth: 0
		}
	};
	console.log("store.current.currentNetworkDetails", store.current.currentNetworkDetails != null)
  return (
		<View style={{marginBottom: 10}}>
			<View style={[style.alignHorizontal, {marginBottom: 5}]} >
				<View style={[styles.titleInputSend, style.itemWidth70]}>
					<Text style={style.headerBg}>{lang.chosenNetwork || "Choose network"}:</Text>
				</View>
				{!isNotBridge() &&
					<Text
						onPress={openBridgeDetailsModal}
						style={[style.itemWidth30, style.limitsStyle, {textAlign: "right"}]}>
						{lang.limits || "(?) LIMITS"}
					</Text>
				}
			</View>
			
			
			<RNPickerSelect
				placeholder={{}}
				onValueChange={(value) => {
					onValueChangeValue(value);
				}}
				onDonePress={onDone}
				useNativeAndroidPickerStyle={false}
				value={store.current.send.chosenNetwork.referTo}
				items={items}
				Icon = {() => <Icon name='sort-down' size={15} color="white" style={[{right: 5, top: 15, position: 'absolute'}]} />}
				style={pickerSelectStyles}
			/>
		</View>
  );
};


const style = StyleSheet.create({
	pauseButton: {
		
	},
	headerBg: {
		color: "white",
		opacity: 0.3,
		fontSize: 13,
		textTransform: "uppercase",
		fontFamily: "Fontfabric-NexaRegular",
	},
	alignHorizontal: {
		display: "flex",
		flexDirection: "row",
		alignItems: "baseline"
	},
	limitsStyle:{
		color: Images.colorGreen,
		fontFamily: "Fontfabric-NexaBold",
		fontSize: 14,
		textDecorationLine: "underline",
	},
	itemWidth70: {
		width:"70%",
	},
	itemWidth30: {
		width:"30%",
	},
	titleInput1: {
		fontSize: 15,
		...ifIphoneX(
			{
				marginTop: 10,
				fontSize: 15,
				fontFamily: "Fontfabric-NexaRegular",
				opacity: 0.7,
				// fontWeight: "bold",
			},
			{
				...Platform.select({
					ios: {
						marginTop: 5,
						fontSize: 15,
						fontWeight: "bold",
						fontFamily: "Fontfabric-NexaRegular",
					},
					android: {
						marginTop: 5,
						fontSize: 15,
						fontWeight: Platform.OS === 'ios' ? "bold" : null,
						fontFamily: "Fontfabric-NexaRegular",
					},
				}),
			}
		),
	}
});

export default NetworkChooser;
