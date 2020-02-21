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
import {isObservable, isObservableProp} from "mobx";
import {observer} from "mobx-react";
import styles from "../Styles.js";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar
} from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import ModalComponent from "react-native-modal-component";
import moment from "moment";
import Toast from "@rimiti/react-native-toastify";
import RefreshControl from "../components/RefreshControl.js";
import LoadMoreDate from "../components/LoadMoreDate.js";
// import walletFuncs from '../wallet/wallet-funcs.js';
import walletsFuncs from "../wallet/wallets-funcs.js";
import { Linking } from "react-native";

import navigate from "../wallet/navigate.js";
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";


import Images from '../Images.js';



//navigate store, web3t, \sent

const { width, height } = Dimensions.get("window");

const showToast = message => {
  this.toastify.show(message, 3000);
};


class Wallet extends React.Component {
  modal = React.createRef();

  onClick = () => {
    return this.modal.current.dismiss();
  };

  render(){
    const {web3t, store} = this.props;
    //const wallets = walletsFuncs(store, web3t).wallets;
    //const wallet = ;

    const wallets = walletsFuncs(store, web3t).wallets;
    const wallet = wallets.find((x) => x.coin.token === store.current.wallet);

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
        <View style={{ paddingTop: 30 }}>
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
      web3t.refresh((err,data) => {
        this.forceUpdate();
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
          {wallet.coin.token}
        </Text>
      </Text>
    );

    const prefix = hardCodedStrategyGetAddessPrefix();

    const addressExplorerLink = wallet.network.api.url + "/" + prefix + "/" + wallet.address;


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
            <StatusBar hidden={true} />
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
                        source={Images.sendImage}
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
                        source={Images.receiveImage}
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
  }
};

export default ({ store, web3t }) => <Wallet store={store} web3t={web3t} />;
