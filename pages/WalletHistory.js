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
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";


const openInfoModal = (store, transaction) => {
  store.infoTransaction = transaction;
  return this.modal.show();
};



onClick = () => {
  return this.modal.dismiss();
};
export default ({ store, web3t }) => {
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

    web3t.refresh((err,data) => {})

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
              <Text style={styles.title}>History</Text>
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
