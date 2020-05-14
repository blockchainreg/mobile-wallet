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
import { transaction } from "mobx";
import {observer} from "mobx-react";
import styles from "../Styles.js";
import {
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
//import ModalComponent from "react-native-modal-component";
import moment from "moment";
import Toast from "@rimiti/react-native-toastify";
import RefreshControl from "../components/RefreshControl.js";
import LoadMoreDate from "../components/LoadMoreDate.js";
// import walletFuncs from '../wallet/wallet-funcs.js';
import walletsFuncs from "../wallet/wallets-funcs.js";
import { Linking } from "react-native";

import navigate from "../wallet/navigate.js";
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';

import Images from '../Images.js';


export default ({ store, web3t }) => {

    const lang = getLang(store);
    const wallets = walletsFuncs(store, web3t).wallets;
    const wallet = wallets.find((x) => x.coin.token === store.current.wallet);

    const usdRate = wallet.usdRate || 0;
    const sendLocal = () => {

          if(wallet.balance == "..") {
            return;
          }

          store.current.send.wallet = wallet;
          store.current.send.coin = wallet.coin;
          store.current.send.network = wallet.network;
          navigate(store, web3t, "send", x=> {

          });

    }

    const changePage = (tab) => () => {
      store.current.page = tab;
    };

    const refreshToken = () => {
      web3t.refresh((err,data) => {
        console.log("refresh done", err, data);
      })
    }

    //TODO: Refactor this piece of shit later.
    const hardCodedStrategyGetAddessPrefix = () => {
        const mapping = {
          vlx: "wallet"
        }
        return mapping[wallet.coin.token] || 'address';
    }

    const Balance = observer(({wallet}) =>
      <Text style={styles.totalBalance}>
        {wallet.balance}{" "}
        <Text style={styles.nameToken}>
          {wallet.coin.token.toUpperCase()}
        </Text>
      </Text>
    );

    const prefix = hardCodedStrategyGetAddessPrefix();

    const addressExplorerLink = wallet.network.api.url + "/" + prefix + "/" + wallet.address;


    const expand = () => {
          transaction(function() {
            store.history.filterOpen = true;
          })
    }

    const collapse = () => {
          store.history.filterOpen = false;
    }

    const getTxContainer = () => {
      if (store.history.filterOpen == true)
        //return { ...styles.viewMono, height: '80%' }
        return (
            <View style={{ ...styles.viewMono, height: '80%' }}>
              <View style={styles.bodyBlockTitle} onStartShouldSetResponder={collapse}>
                <Text style={styles.titleHistory}>{lang.txLast}</Text>
              </View>
              <ScrollView>
                <View style={styles.viewPt} />
                {LoadMoreDate({ store })}
                <View style={{ paddingBottom: 150 }} />
              </ScrollView>
            </View>
        )

      return (
          <View style={styles.viewMono}>
            <View style={styles.bodyBlockTitle} onStartShouldSetResponder={expand}>
              <Text style={styles.titleHistory}>{lang.txLast}</Text>
            </View>
            <ScrollView>
              <View style={styles.viewPt} />
              {LoadMoreDate({ store })}
              <View style={{ paddingBottom: 150 }} />
            </ScrollView>
          </View>
        )
    }

    return (
      <View style={styles.viewFlex}>
          <StandardLinearGradient>
            <StatusBar />
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
                <Thumbnail square small source={{uri: wallet.coin.image}} />
              </Right>
            </Header>
            <RefreshControl transparent swipeRefresh={refreshToken}>
              <View style={styles.bodyBlockWallet}>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.nameTokenSwiper1}>{lang.totalBalance}</Text>
                </View>
                <View style={styles.bodyBlock3}>
                  <Balance wallet={wallet}/>
                </View>

                <View style={styles.viewTouchablesWallet}>

                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={sendLocal}
                      style={styles.touchables}
                    >
                      <Image
                        source={Images.withdrawImage}
                        style={styles.sizeIconBtn}
                      />
                    </TouchableOpacity>
                    <Text style={styles.textTouchable}>{lang.send}</Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                          Linking.openURL(addressExplorerLink);
                        }}
                      style={styles.touchables}
                    >
                      <Image
                        source={Images.sendImage}
                        style={styles.sizeIconBtn}
                      />
                    </TouchableOpacity>
                    <Text style={styles.textTouchable}>{lang.explorer}</Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={changePage("invoice")}
                      style={styles.touchables}
                    >
                      <Image
                        source={Images.receiveImage}
                        style={styles.sizeIconBtn}
                      />
                    </TouchableOpacity>
                    <Text style={styles.textTouchable}>{lang.receive}</Text>
                  </View>
                </View>
              </View>
            </RefreshControl>
          </StandardLinearGradient>
          {getTxContainer()}
      </View>
    );
};

//export default ({ store, web3t }) => <Wallet store={store} web3t={web3t} />;
