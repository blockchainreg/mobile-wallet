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
import Background from "../components/Background.js";
import Images from '../Images.js';
import { LinearGradient } from "expo-linear-gradient";


export default ({ store, web3t }) => {

  const lang = getLang(store);
  const changePage = tab => () => {
      store.tab = tab;
  };


  const refreshToken = async bool => {

      web3t.refresh((err,data) => {})

  };

  return (
      <View style={styles.container}>
        <View style={styles.viewFlex}>
          <Background/>
            <Header transparent style={styles.mtIphoneX}>
              <Left style={styles.viewFlexHeader} />
              <Body style={styles.viewFlexHeader}>
              <Text style={styles.title}>{lang.history}</Text>
              </Body>
              <Right style={styles.viewFlexHeader} />
            </Header>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
          <View style={styles.viewMono1}>
          <LinearGradient
            colors={[Images.color1, Images.color1, Images.color2]}
            style={styles.linearGradientBg}>
            <View style={styles.viewPt} />
            <ScrollView>
              <View style={styles.viewPt} />
              { LoadMoreDate({ store }) }
              <View style={{ paddingBottom: 100 }} />
            </ScrollView>
          </LinearGradient>
          </View>
        </View>
        <Footer store={store}></Footer>
      </View>
    );
}
