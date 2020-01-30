import React from "react";
import {
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
  Header,
  Badge
} from "native-base";
import styles from "../Styles.js";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  Alert,
  Vibration,
  Image
} from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import ModalComponent from "react-native-modal-component";
import moment from "moment";
import Toast from "@rimiti/react-native-toastify";
import RefreshControl from "../components/RefreshControl.js";
import LoadMoreDate from "../components/LoadMoreDate.js";
// import walletFuncs from '../wallet/wallet-funcs.js';
// import walletsFuncs from '../wallet/wallets-funcs.js';
import { Linking } from "react-native";

import navigate from '../wallet/navigate.js';

//navigate store, web3t, \sent

const { width, height } = Dimensions.get("window");

const showToast = message => {
  this.toastify.show(message, 3000);
};

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
            {store.infoTransaction.details.source_account}
            {"  "}
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
            {store.infoTransaction.details.destination_account}
            {"  "}
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

export default ({ store, web3t }) => {




  //const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = store.current.wallet;
  //const { send } = walletFuncs(store, web3t, wallets, wallet);

  const usdRate = wallet.usdRate || 0;
  const sendLocal = () => {

        //send wallet
        //web3t[]
        //{ send-transaction } = web3t[wallet.coin.token]
        //to = ""
        //value = 0
        //err <- send-transaction { to, value }
        //console.log err if err?
        store.current.send.wallet = wallet;
        store.current.send.coin = wallet.coin;
        store.current.send.network = wallet.network;
        //console.log("wallet,", store.current.send.wallet)
        //store.current.page = "send";
        //the true way to use store.current.page = '...'
        navigate(store, web3t, "send", x=> {
            
        });

  }



  const changePage = (tab) => () => {
    store.current.page = tab;
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
  const refreshToken = () => {
    web3t.refresh((err,data) => {})
  }
  const addressExplorerLink = wallet.network.api.url + "/address/" + wallet.address;
  

  return (
    <ModalComponent
      ref={modal => {
        this.modal = modal;
      }}
      content={content}
      showCloseButton={false}
    >
      <View style={styles.viewFlex}>
        <StandardLinearGradient>
          <Toast
            ref={c => (this.toastify = c)}
            position={"top"}
            style={styles.toastStyle}
          />

          <Header style={styles.mtAndroid}>
            <Left style={styles.viewFlex}>
              <Button
                transparent
                style={styles.arrowHeaderLeft}
                onPress={changePage("wallets")}
              >
                <Icon
                  name="ios-arrow-back"
                  style={styles.arrowHeaderIconBlack}
                />
              </Button>
            </Left>
            <Body style={styles.viewFlex}>
              <Title style={styles.titleBlack}>
                {wallet.coin.token}
              </Title>
            </Body>
            <Right style={styles.viewFlex}>
              <Thumbnail small source={require("../assets/btc-ethnamed.png")} />
            </Right>
          </Header>

          <RefreshControl transparent swipeRefresh={refreshToken}>
            <View style={styles.bodyBlockWallet}>
              <View style={styles.bodyBlock3}>
                <Text style={styles.nameTokenSwiper1}>Total Balance</Text>
              </View>
              <View style={styles.bodyBlock3}>
                <Text style={styles.totalBalance}>
                  {wallet.balance}{" "}
                  <Text style={styles.nameToken}>
                    {wallet.coin.token}
                  </Text>
                </Text>
              </View>

              <View style={styles.viewTouchablesWallet}>

                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={sendLocal}
                    style={styles.touchables}
                  >
                    <Image
                      source={require("../assets/WITHDRAWAL-btn.png")}
                      style={styles.sizeIconBtn}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textTouchable}>Send</Text>
                </View>

                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                        Linking.openURL(addressExplorerLink);
                      }}
                    style={styles.touchables}
                  >
                    <Image
                      source={require("../assets/SEND-btn.png")}
                      style={styles.sizeIconBtn}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textTouchable}>Explorer</Text>
                </View>

                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={changePage("invoice")}
                    style={styles.touchables}
                  >
                    <Image
                      source={require("../assets/RECEIVE-btn.png")}
                      style={styles.sizeIconBtn}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textTouchable}>Receive</Text>
                </View>
              </View>
            </View>
          </RefreshControl>
        </StandardLinearGradient>
        <View style={styles.viewMono}>
          <View style={styles.bodyBlockTitle}>
            <Text style={styles.titleHistory}>Last Transactions</Text>
          </View>
          <ScrollView>
            <View style={styles.viewPt} />
            <LoadMoreDate store={store} modalRef={this.modal} currency={wallet.coin.token} />
            <View style={{ paddingBottom: 150 }} />
          </ScrollView>
        </View>
      </View>
    </ModalComponent>
  );
};
