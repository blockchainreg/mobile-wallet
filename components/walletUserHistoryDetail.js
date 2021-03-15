import React from "react";
import {
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  Item,
  List,
  ListItem,
  Header,
  Thumbnail,
  Badge
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { View, ScrollView, Clipboard, Alert, Vibration, Linking, Platform } from "react-native";
import styles from "../Styles.js";
// import StandardLinearGradient from "./StandardLinearGradient.js";
import moment from "moment";
//import LoadMoreAllDate from "./LoadMoreAllDate";
import getLang from '../wallet/get-lang.js';
import { LinearGradient } from "expo-linear-gradient";
import Images from '../Images.js';
import walletsFuncs from "../wallet/wallets-funcs.js";
import roundNumber from "../round-number";
import roundHuman from "../wallet/round-human"


export default (store, web3t) => {

  const lang = getLang(store);
  const writeToClipboard = async (info) => {
    await Clipboard.setString(
      info
    );
    Vibration.vibrate(100);
    Alert.alert(lang.copied, "", [{ text: lang.ok }]);
  };


  const writeToClipboardId = async () => {
    writeToClipboard(store.infoTransaction.tx);
  };

  const writeToClipboardDestAcc = async () => {
    writeToClipboard(store.infoTransaction.to);
  };

  const writeToClipboardSourceAcc = async () => {
    writeToClipboard(store.infoTransaction.from);
  };
  const index = type => {
    if (type === "IN") return <Text style={styles.detailInfoIn}>+</Text>;
    else if (type === "OUT") return <Text style={styles.detailInfoOut}>-</Text>;
  };
  const amountStyle = type => {
    if (type === "IN") return styles.detailInfoIn;
    else if (type === "OUT") return styles.detailInfoOut;
  };
  const thumbnail = type => {
    switch (type) {
      case "IN":
        return <Thumbnail small square source={Images.depositImage} />;
      case "OUT":
        return (
          <Thumbnail small square source={Images.withdrawImage2} />
        );
      default:
        return null;
    }
  };
  //const txurl = `https://explorer.velas.com/tx/${store.infoTransaction.tx}`;
  const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = wallets.find((x) => x.coin.token === store.infoTransaction.token);
  const {linktx, url} = wallet.network.api;
  const {tx} = store.infoTransaction;
  const txurl = linktx ? linktx.replace(":hash", tx) : `${url}/tx/${tx}`;
  let token = store.infoTransaction.token === 'vlx2' ? "vlx" : store.infoTransaction.token;
  const tokenLabel = token.toUpperCase();
  const r_amount = roundNumber(store.infoTransaction.amount, {decimals: 4});
  const amount = roundHuman(r_amount);
  return (
        <View style={styles.container}>
          <View style={styles.detailsHistory}>
            <View>
              <View style={styles.badge}>
              {thumbnail(store.infoTransaction.type)}
              </View>
            </View>

            <View style={{ width: "auto", textAlign: "center", paddingHorizontal: 20, paddingVertical: 5}}>
            <Text style={amountStyle(store.infoTransaction.type)}>
              {index(store.infoTransaction.type)}
              {amount} {tokenLabel}
            </Text>
            </View>
            <Text style={{color: "rgba(255, 255, 255, 0.70)", fontFamily: "Fontfabric-NexaRegular", lineHeight: 20}}>
              {moment(store.infoTransaction.time * 1000).format( "MMM D YYYY h:mm A")}
            </Text>

          </View>

          <View style={styles.viewPt} />
          <ScrollView>
           <View style={styles.lineMonoRow}>

            <Text style={styles.detail}>{lang.sender}:</Text>
            <View style={styles.userHistoryRow}>
            <Icon
                name="ios-copy"
                onPress={writeToClipboardSourceAcc}
                style={[styles.viewPt, {fontSize: 20,} ]}
            />
              <Text style={[styles.viewPt, {marginLeft: 10}]} onPress={writeToClipboardSourceAcc}>
              {store.infoTransaction.from}
            </Text>
            </View>
          </View>
          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.recipient}:</Text>
            <View style={styles.userHistoryRow}>
            <Icon
                name="ios-copy"
                onPress={writeToClipboardDestAcc}
                style={[styles.viewPt, {fontSize: 20} ]}
            />
              <Text style={[styles.viewPt, {marginLeft: 10}]} onPress={writeToClipboardDestAcc}>
              {store.infoTransaction.to}
            </Text>
            </View>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.amount}:</Text>
            <Text style={styles.viewPt}>
              {store.infoTransaction.amount}
              {" "}{token.toUpperCase()}
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.fee}:</Text>
            <Text style={styles.viewPt}>
              {store.infoTransaction.fee}
              {" "}{token.toUpperCase()}
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.externalId}:</Text>
            <View style={styles.userHistoryRow1}>
            <Icon
                name="md-open"
                onPress={() => {Linking.openURL(txurl)}}
                onLongPress={writeToClipboardId}
                style={[styles.viewPt, {fontSize: 20} ]}
            />
              <Text style={[styles.viewPt, {marginLeft: 10, textDecorationLine: 'underline' }]} onPress={() => {Linking.openURL(txurl)}} onLongPress={writeToClipboardId}>
              {store.infoTransaction.tx}
            </Text>
            </View>

          </View>
          <View style={styles.mbXScroll}/>
          </ScrollView>


        </View>
  )
};
