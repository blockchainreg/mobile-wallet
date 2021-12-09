import React, { Component } from "react";//import react in our code.
import { Dialog } from 'react-native-simple-dialogs';
import { View, Text } from "native-base";
import roundHuman from "../wallet/round-human";
import math from '../wallet/math.js';
import {Platform, ScrollView, StyleSheet} from "react-native";
const times = math.times;

export default ({store, ...props}) => {
  const MAX_LIMIT = ">100,000,000"
	const { homeFeePercent, minPerTx, maxPerTx, remainingDailyLimit, wallet } = props.data;
	const bridgeFeePercent = times(homeFeePercent, 100);

	const $minPerTx = roundHuman(minPerTx, {decimals: 8});
	const $maxPerTx = maxPerTx < 100000000 ? roundHuman(maxPerTx, {decimals: 2}) : MAX_LIMIT;
	const $remaining = remainingDailyLimit < 100000000 ? roundHuman(remainingDailyLimit, {decimals: 2}) : MAX_LIMIT;

	const { referTo } = store.current.send.chosenNetwork;
	const walletTo = (store.current.account.wallets || []).find((it) => {
		return it.coin.token === referTo;
	});
	
	if(!walletTo || !wallet) {
		return null;
	}

	const { name, nickname } = wallet.coin;
	const currency = (nickname || "").toUpperCase();
	const fromNetwork = (name != null ? name : "").toUpperCase();
	const toNetwork = (walletTo ? walletTo.coin.name : "").toUpperCase();
	const title = `Swap from ${fromNetwork} to ${toNetwork}`;

	return (
		<Dialog
			title={title}
			visible={true}
			onTouchOutside= {()=>{store.current.currentNetworkDetails = null}}
			titleStyle={{ color: '#000', fontWeight: "bold"}}
			messageStyle={{fontFamily: "Fontfabric-NexaRegular", color: '#000'}}
		>
			<ScrollView>
				<View style={style.item}>
					<Text style={style.title}>{"Remaining Daily:"}</Text>
					<Text style={style.value}>{$remaining} {currency}</Text>
				</View>
				<View style={style.item}>
					<Text style={style.title}>{"Max Per Trans.:"}</Text>
					<Text style={style.value}>{$maxPerTx} {currency}</Text>
				</View>
				<View style={style.item}>
					<Text style={style.title}>{"Min Per Trans.:"}</Text>
					<Text style={style.value}>{$minPerTx} {currency}</Text>
				</View>
				{bridgeFeePercent > 0 &&
				<View style={style.item}>
					<Text style={style.title}>{"Bridge fee:"}</Text>
					<Text style={style.value}>{bridgeFeePercent}{"%"}</Text>
				</View>
				}
			</ScrollView>
			
		</Dialog>
	);
}

const style = StyleSheet.create({
	container: {
		// display: "flex",
		// flexDirection: 'row',
		// flexWrap: 'wrap',
		// alignItems: 'flex-start'
	},
	item: {
		width: '100%',
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginBottom: 0,
		paddingVertical: 0
	},
	title: {
		width: '50%',
		textAlign: "left",
		color: "black"
	},
 	value: {
		width: '50%',
		// textAlign: "right"
	}
});
