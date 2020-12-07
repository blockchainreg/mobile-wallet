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
import GradientButton from "../components/GradientButton.js";
import { generateMnemonic } from "bip39";
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import {shuffle} from "../utils/array.js";

export default ({ store, web3t }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const makeRange = (from)=> {
    store.current.seed = "";
    store.current.seedIndex = 0;
    store.current.seedIndexes = shuffle([...Array(from).keys()])
    store.current.seedWords = [...Array(from).keys()].map(() => "")
  }

  const restoreSeed12 = () => {
    store.current.seed = "";
    makeRange(12);
    store.current.page = "restoreseed";
  }

  const restoreSeed24 = () => {
    store.current.seed = "";
    makeRange(24);
    store.current.page = "restoreseed";
  }

  const restoreCustom = () => {
    store.current.seed = "";
    makeRange(1);
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
                  {/* <GradientButton
                    style={styles.viewMt}
                    text={lang.words12}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={0}
                    onPressAction={restoreSeed12}
                  /> */}
                  <Button block style={styles.btnVelasRestore} onPress={restoreSeed12}>
                    <Text style={styles.textBtn}>{lang.words12}</Text>
                  </Button>
                  <View style={{ padding: 10 }}></View>
                  {/* <GradientButton
                    style={styles.viewMt}
                    text={lang.words24}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={0}
                    onPressAction={restoreSeed24}
                  /> */}
                  <Button block style={styles.btnVelasRestore} onPress={restoreSeed24}>
                    <Text style={styles.textBtn}>{lang.words24}</Text>
                  </Button>
                  <View style={{ padding: 10 }}></View>
                  {/* <GradientButton
                    style={styles.viewMt}
                    text="Custom"
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={0}
                    onPressAction={restoreCustom}
                  /> */}
                  <Button block style={styles.btnVelasRestore} onPress={restoreCustom}>
                    <Text style={styles.textBtn}>Custom</Text>
                  </Button>
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
