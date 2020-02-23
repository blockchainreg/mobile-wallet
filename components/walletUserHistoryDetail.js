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
import { View, ScrollView, Clipboard, Alert, Vibration, StatusBar } from "react-native";
import styles from "../Styles.js";
import StandardLinearGradient from "./StandardLinearGradient.js";
import ModalComponent from "react-native-modal-component";
import moment from "moment";
import { observer } from "mobx-react"
import { isObservable, isObservableProp } from "mobx"
import LoadMoreAllDate from "./LoadMoreAllDate";



export default walletUserHistoryDetail = store => {

  const writeToClipboard = async (info) => {
    await Clipboard.setString(
      info
    );
    Vibration.vibrate(10000);
    Alert.alert("Copied to clipboard", "", [
      { text: "OK", onPress: () => console.log("OK Pressed") }
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

  //return (<View> <View style={styles.mbXScroll}/> </View>);
  if (!isObservable(store)) {
    throw new Error('Not observable store');
  }
  if (!isObservableProp(store, "infoTransaction")) {
    throw new Error('Not observable store prop');
  }
  const ObservableDetails = observer(() => {
    if (store && store.infoTransaction)
      return (
        <View>

          <View style={styles.detailsHistory}>

            <View>
              <Badge style={styles.badgeMono}>
                <Text>{store.infoTransaction.type}</Text>
              </Badge>
            </View>

            <View style={styles.lineMono} />

            <Text style={styles.detailInfoAmount}>
              {store.infoTransaction.amount} {store.infoTransaction.token.toUpperCase()}
            </Text>

            <Text>
              {moment(store.infoTransaction.time).format("MMM D YYYY h:mm A")}
            </Text>

          </View>

          <View style={styles.viewPt} />
           <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>Sender:</Text>
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
            <Text style={styles.detail}>Recipient:</Text>
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
            <Text style={styles.detail}>Amount:</Text>
            <Text style={styles.viewPt}>
              {store.infoTransaction.amount}
              {" "}{store.infoTransaction.token.toUpperCase()}
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>Fee:</Text>
            <Text style={styles.viewPt}>
              {store.infoTransaction.fee}
              {" "}{store.infoTransaction.token.toUpperCase()}
            </Text>
          </View>

          <View style={styles.lineMonoRow}>
            <Text style={styles.detail}>External Id:</Text>
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
    );
    return <View><Text>Not found???</Text></View>;
  });
  return <ObservableDetails />;
};
