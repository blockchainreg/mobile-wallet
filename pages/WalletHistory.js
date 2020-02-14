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
import Footer from "./Footer.js";
import { View, ScrollView, Clipboard, Alert, Vibration, StatusBar } from "react-native";
import styles from "../Styles.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import ModalComponent from "react-native-modal-component";
import moment from "moment";
import LoadMoreAllDate from "../components/LoadMoreAllDate";
// import StatusBar from "../components/StatusBar.js"


const openInfoModal = (store, transaction) => {
  store.infoTransaction = transaction;
  return this.modal.show();
};

const walletUserHistoryDetail = store => {
  const checkType = type => {
    switch (type) {
      case "DEPOSIT":
        return <Text style={styles.colorTxtBadge}>Receive</Text>;
      case "WITHDRAWAL":
        return <Text style={styles.colorTxtBadge}>Sent</Text>;
      case "EXCHANGE":
        return <Text style={styles.colorTxtBadge}>Exchange</Text>;
      case "INTERNAL_MOVEMENT":
        return <Text style={styles.colorTxtBadge}>Internal Movement</Text>;
      default:
        return null;
    }
  };
  const index = type => {
    if (type === "DEPOSIT")
      return <Text style={styles.detailInfoAmount}>+</Text>;
    else if (type === "WITHDRAWAL")
      return <Text style={styles.detailInfoAmount}>-</Text>;
  };

  const currency_to_spend_amount = store => {
    if (store.infoTransaction.order_type === "EXCHANGE")
      return (
        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>Spend:</Text>
          <Text style={styles.viewPt}>
            {store.infoTransaction.details.currency_to_spend_amount.toFixed(8)}{" "}
            {store.infoTransaction.currency.split("_").pop()}
          </Text>
        </View>
      );
  };
  const currency_to_get_amount = store => {
    if (store.infoTransaction.order_type === "EXCHANGE")
      return (
        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>Get:</Text>
          <Text style={styles.viewPt}>
            {" "}
            {store.infoTransaction.details.currency_to_get_amount.toFixed(
              8
            )}{" "}
            {store.infoTransaction.currency.slice(
              0,
              store.infoTransaction.currency.lastIndexOf("_")
            )}
          </Text>
        </View>
      );
  };
  const price = store => {
    if (store.infoTransaction.order_type === "EXCHANGE")
      return (
        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>Price:</Text>
          <Text style={styles.viewPt}>
            {store.infoTransaction.details.price.toFixed(8)}
          </Text>
        </View>
      );
  };

  const hash = store => {
    if (store.infoTransaction.order_type === "DEPOSIT")
      return (
        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>Hash:</Text>
          <Text style={styles.viewPt} onPress={writeToClipboardHash}>
            {store.infoTransaction.tr_hash}
            {"  "}
            <Icon
              name="ios-copy"
              onPress={writeToClipboardHash}
              style={styles.iconCopy}
            ></Icon>
          </Text>
        </View>
      );
  };
  const source_account = store => {
    if (store.infoTransaction.order_type === "INTERNAL_MOVEMENT")
      return (
        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>Sender:</Text>
          <Text style={styles.viewPt} onPress={writeToClipboardSourceAcc}>
            {store.infoTransaction.details.source_account}{"  "}
            <Icon
              name="ios-copy"
              onPress={writeToClipboardSourceAcc}
              style={styles.iconCopy}
            ></Icon>
          </Text>
        </View>
      );
  };
  const destination_account = store => {
    if (store.infoTransaction.order_type === "INTERNAL_MOVEMENT")
      return (
        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>Recipient:</Text>
          <Text style={styles.viewPt} onPress={writeToClipboardDestAcc}>
            {store.infoTransaction.details.destination_account}{"  "}
            <Icon
              name="ios-copy"
              onPress={writeToClipboardDestAcc}
              style={styles.iconCopy}
            ></Icon>
          </Text>
        </View>
      );
  };

  const DURATION = 10000;
  const writeToClipboardHash = async () => {
    await Clipboard.setString(store.infoTransaction.tr_hash);
    Vibration.vibrate(DURATION);
    Alert.alert("Copied to clipboard", "", [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  };
  const writeToClipboardId = async () => {
    await Clipboard.setString(store.infoTransaction.external_id);
    Vibration.vibrate(DURATION);
    Alert.alert("Copied to clipboard", "", [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  };
  const writeToClipboardDestAcc = async () => {
    await Clipboard.setString(
      store.infoTransaction.details.destination_account
    );
    Vibration.vibrate(DURATION);
    Alert.alert("Copied to clipboard", "", [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  };
  const writeToClipboardSourceAcc = async () => {
    await Clipboard.setString(store.infoTransaction.details.source_account);
    Vibration.vibrate(DURATION);
    Alert.alert("Copied to clipboard", "", [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  };

  if (store && store.infoTransaction)
    return (
      <View>
        <View style={styles.detailsHistory}>
          <View>
            <Badge style={styles.badgeMono}>
              <Text>{checkType(store.infoTransaction.order_type)}</Text>
            </Badge>
          </View>
          <View style={styles.lineMono} />

          <Text style={styles.detailInfoAmount}>
            {index(store.infoTransaction.order_type)}
            {store.infoTransaction.amount} {store.infoTransaction.currency}
          </Text>
          <Text>
            {moment(store.infoTransaction.dt).format("MMM D YYYY h:mm A")}
          </Text>
        </View>
        <View style={styles.viewPt} />
        {source_account(store)}
        {destination_account(store)}
        {hash(store)}
        {price(store)}
        {currency_to_spend_amount(store)}
        {currency_to_get_amount(store)}

        <View style={styles.lineMonoRow}>
          <Text style={styles.detail}>External Id:</Text>
          <Text style={styles.viewPt} onPress={writeToClipboardId}>
            {store.infoTransaction.external_id}
            {"  "}
            <Icon
              name="ios-copy"
              onPress={writeToClipboardId}
              style={styles.iconCopy}
            ></Icon>
          </Text>
        </View>

        <View style={styles.lineMonoRowLast}>
          <Text style={styles.detail}>Status transaction:</Text>
          <Text style={styles.viewPt}>{store.infoTransaction.status}</Text>
        </View>
        <View style={styles.mbXScroll}/>
      </View>
    );
  return <View> </View>;
};
onClick = () => {
  return this.modal.dismiss();
};
export default ({ store }) => {
  const changePage = tab => () => {
    store.tab = tab;
  };

  const content = (
    <View style={styles.viewMonoHistory}>
      <View style={{ paddingTop: 50 }}>
        <Button
          onPress={() => {
            this.onClick();
          }}
          transparent
        >
          <Text>Done</Text>
        </Button>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {walletUserHistoryDetail(store)}
        </ScrollView>
      </View>
    </View>
  );
  const refreshToken = async bool => {
    if (bool === true) {
      const params = {
        email: store.settingsInputMailField,
        password: store.settingsInputPasswordField
      };

      

      console.log("userToken 😀", store.userToken);

    }
  };

  return (
    <ModalComponent
      ref={modal => {
        this.modal = modal;
      }}
      content={content}
      showCloseButton={false}
    >
    <View style={styles.container}>
      <View style={styles.viewFlex}>
        <StandardLinearGradient>
          <Header transparent style={styles.mtIphoneX}>
            <Left style={styles.viewFlex} />
            <Body style={styles.viewFlex}>
              <Title style={styles.title}>History</Title>
            </Body>
            <Right style={styles.viewFlex} />
          </Header>
          <StatusBar barStyle="light-content" />
        </StandardLinearGradient>
        <View style={styles.viewMonoWallets}>
          <View style={styles.viewPt} />
          <ScrollView>
            <View style={styles.viewPt} />
            <LoadMoreAllDate store={store} modalRef={this.modal} />
            <View style={{ paddingBottom: 100 }} />
          </ScrollView>
        </View>
      </View>
      <Footer store={store}></Footer>
    </View>
    </ModalComponent>

  );
};
