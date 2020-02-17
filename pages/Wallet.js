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
  Image,
  StatusBar
} from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import ModalComponent from "react-native-modal-component";
import moment from "moment";
import { isObservable, isObservableProp } from "mobx"
import Toast from "@rimiti/react-native-toastify";
import RefreshControl from "../components/RefreshControl.js";
import LoadMoreDate from "../components/LoadMoreDate.js";
// import walletFuncs from '../wallet/wallet-funcs.js';
import walletsFuncs from '../wallet/wallets-funcs.js';
import { Linking } from "react-native";

import navigate from '../wallet/navigate.js';
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";

//navigate store, web3t, \sent

const { width, height } = Dimensions.get("window");

class Wallet extends React.Component {
  onClick = () => {
    return this.modal.current.dismiss();
  };

  modal = React.createRef();

  render()
  {
    const wallets = walletsFuncs(this.props.store, this.props.web3t).wallets;

    const wallet = wallets.find((x) => x.coin.token === this.props.store.current.wallet);

    const usdRate = wallet.usdRate || 0;
    const sendLocal = () => {
          if(wallet.balance == "..") {
            return;
          }

          //send wallet
          //web3t[]
          //{ send-transaction } = web3t[wallet.coin.token]
          //to = ""
          //value = 0
          //err <- send-transaction { to, value }
          //console.log err if err?
          this.props.store.current.send.wallet = wallet;
          this.props.store.current.send.coin = wallet.coin;
          this.props.store.current.send.network = wallet.network;
          //console.log("wallet,", store.current.send.wallet)
          //store.current.page = "send";
          //the true way to use store.current.page = '...'
          navigate(store, this.props.web3t, "send", x=> {});
    }

    const changePage = (tab) => () => {
      this.props.store.current.page = tab;
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
            {walletUserHistoryDetail(this.props.store)}
          </ScrollView>
        </View>
      </View>
    );
    const refreshToken = () => {
      this.props.web3t.refresh((err,data) => {})
    }
    const addressExplorerLink = wallet.network.api.url + "/address/" + wallet.address;

    return (
      <ModalComponent
        ref={this.modal}
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
                  {wallet.coin.name}
                </Title>
              </Body>
              <Right style={styles.viewFlex}>
                <Thumbnail small source={{uri: wallet.coin.image}} />
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
              <LoadMoreDate store={this.props.store} modalRef={this.modal} currency={wallet.coin.token} />
              <View style={{ paddingBottom: 150 }} />
            </ScrollView>
          </View>
        </View>
      </ModalComponent>
    );
  }
};

export default ({ store, web3t }) => {
  if (!isObservableProp(store, "infoTransaction")) {
    throw new Error('Not observable store prop!!!!!!!!!!!!!!!!');
  }
  return <Wallet store={store} web3t={web3t}/>
};
