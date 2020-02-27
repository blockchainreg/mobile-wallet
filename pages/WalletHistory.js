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
import { View, ScrollView, Clipboard, Alert, Vibration } from "react-native";
import styles from "../Styles.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import ModalComponent from "react-native-modal-component";
import moment from "moment";
import LoadMoreDate from "../components/LoadMoreDate";
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';

export default ({ store, web3t }) => {
  const changePage = tab => () => {
      store.tab = tab;
  };


  const refreshToken = async bool => {

      web3t.refresh((err,data) => {})

  };

  return (
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
              { LoadMoreDate({ store }) }
              <View style={{ paddingBottom: 100 }} />
            </ScrollView>
          </View>
        </View>
        <Footer store={store}></Footer>
      </View>
    );
}
