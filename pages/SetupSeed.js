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
  Container,
  Content,
  Item,
  Input,
  Card,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Form,
  Textarea
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import SaveSeedModal from "../components/SaveSeedModal.js";
import { generateMnemonic } from "bip39";
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';

// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const badSeed = (seed) => {
  blocks = (seed || "").split(' ')
  return blocks.length < 10;
}

const seedContainerStyle = {
  borderWidth: 1,
  borderRadius: 5,
  width: "100%",
  borderColor: "#fff",
  marginTop: 20,
  padding: 10
};

const randOrd = () => {
  return (Math.round(Math.random())-0.5);
}

export default ({ store }) => {
  const changePage = (tab) => () => {

    if (badSeed(store.current.seed))
      return;

    store.current.page = tab;
  };

  const generateRandom = async () => {
    store.current.seed = /*"demand time hero together space blur test fatal mistake leaf rigid that";*/generateMnemonic() + ' ' + generateMnemonic();
    store.current.page = "generatedseed";
    //store.curren.newseedstep = "ganarate";
    //
    //send to text address VLV8jDEudTEF6m3JGkjPAXrGWnHzwYHETsE - it is index 0 address of test mnemonic phrase
  };

  const restoreSeed = async () => {
    store.current.seed = "";
    from = 24;
    store.current.seedIndex = 0;
    store.current.seedIndexes = [...Array(from).keys()].sort(randOrd)
    store.current.seedWords = [...Array(from).keys()].map(x=> { return "" } )
    store.current.page = "restoreseed";
  }

  const changeSeed = async (seed) => {
    store.current.seed = seed;
  }

  const lang = getLang(store);



  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex} />
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text={lang.restoreSeed}
                    textStyle={{ fontSize: 14 }}
                    gradientBegin="#9d41eb"
                    gradientEnd="#9d41eb"
                    gradientDirection="diagonal"
                    height={50}
                    width={"100%"}
                    radius={10}
                    onPressAction={restoreSeed}
                  />
                  <View style={{ padding: 10 }}></View>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text={lang.generate}
                    textStyle={{ fontSize: 14 }}
                    gradientBegin="#9d41eb"
                    gradientEnd="#9d41eb"
                    gradientDirection="diagonal"
                    height={50}
                    width={"100%"}
                    radius={10}
                    onPressAction={generateRandom}
                  />
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
