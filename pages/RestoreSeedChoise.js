import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  Text,
  Button,
  View,
  Icon,
  CardItem,
  Body,
  Header,
  Left,
  Right,
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import { generateMnemonic } from "bip39";
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";


const randOrd = () => {
  return (Math.round(Math.random())-0.5);
}


export default ({ store, web3t }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const makeRange = (from)=> {
    store.current.seed = "";
    store.current.seedIndex = 0;
    store.current.seedIndexes = [...Array(from).keys()].sort(randOrd)
    store.current.seedWords = [...Array(from).keys()].map(x=> { return "" } )
  }

  const restoreSeed12 = async () => {
    store.current.seed = "";
    makeRange(12)
    store.current.page = "restoreseed";
    // store.seedCheck = "restoreseed1";
    // console.log('store.seedCheck', store.seedCheck)
  }

  const restoreSeed24 = async () => {
    store.current.seed = "";
    makeRange(24)
    store.current.page = "restoreseed";
  }
  const lang = getLang(store);

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={changePage("newseed")}/>
          </Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={styles.card1}>
          <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.from}</Text>
            </View>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.viewMt}
                    text={lang.words12}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={5}
                    onPressAction={restoreSeed12}
                  />
                  <View style={{ padding: 10 }}></View>
                  <GradientButton
                    style={styles.viewMt}
                    text={lang.words24}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={5}
                    onPressAction={restoreSeed24}
                  />
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
