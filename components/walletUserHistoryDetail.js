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
import { View, ScrollView, Clipboard, Alert, Vibration } from "react-native";
import styles from "../Styles.js";
// import StandardLinearGradient from "./StandardLinearGradient.js";
import moment from "moment";
//import LoadMoreAllDate from "./LoadMoreAllDate";
import getLang from '../wallet/get-lang.js';
import { LinearGradient } from "expo-linear-gradient";
import Images from '../Images.js';



export default (store) => {

  const lang = getLang(store);
  const writeToClipboard = async (info) => {
    await Clipboard.setString(
      info
    );
    Vibration.vibrate(10000);
    Alert.alert("Copied to clipboard", "", [
      { text: lang.ok, onPress: () => console.log("OK Pressed") }
    ]);
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
    if (type === "IN") return null;
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

  return (
        <View>
          <View style={styles.detailsHistory}>
            <View>
              <View style={styles.badge}>
              {thumbnail(store.infoTransaction.type)}
              </View>
            </View>


            <Text style={amountStyle(store.infoTransaction.type)}>
              {index(store.infoTransaction.type)}
              {store.infoTransaction.amount} {store.infoTransaction.token.toUpperCase()}
            </Text>

            <Text style={{color: "rgba(255, 255, 255, 0.70)"}}>
              {moment(store.infoTransaction.time * 1000).format( "MMM D YYYY h:mm A")}
            </Text>

          </View>

          <View style={styles.viewPt} />
           <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.sender}:</Text>
            <Text style={styles.viewPt} onPress={writeToClipboardSourceAcc}>
              {store.infoTransaction.from}{"  "}
              <Icon
                name="ios-copy"
                onPress={writeToClipboardSourceAcc}
                style={styles.iconCopy}
              ></Icon>
            </Text>
          </View>
          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.recipient}:</Text>
            <Text style={styles.viewPt} onPress={writeToClipboardDestAcc}>
              {store.infoTransaction.to}{"  "}
              <Icon
                name="ios-copy"
                onPress={writeToClipboardDestAcc}
                style={styles.iconCopy}
              ></Icon>
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.amount}:</Text>
            <Text style={styles.viewPt}>
              {store.infoTransaction.amount}
              {" "}{store.infoTransaction.token.toUpperCase()}
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.fee}:</Text>
            <Text style={styles.viewPt}>
              {store.infoTransaction.fee}
              {" "}{store.infoTransaction.token.toUpperCase()}
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>{lang.externalId}:</Text>
            <Text style={styles.viewPt} onPress={writeToClipboardId}>
              {store.infoTransaction.tx}
              {"  "}
              <Icon
                name="ios-copy"
                onPress={writeToClipboardId}
                style={styles.iconCopy}
              ></Icon>
            </Text>
          </View>


          <View style={styles.mbXScroll}/>
        </View>
  )
};
