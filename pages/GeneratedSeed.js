import React from "react";
import {
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Linking
} from "react-native";
import {
  Text,
  View,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Button,
  Icon
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
// import { generateMnemonic } from "bip39";
import Images from "../Images.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import style from "../Styles";
// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const badSeed = seed => {
  blocks = (seed || "").split(" ");
  return blocks.length < 10;
};

const createWordBlock = store => (word, index) => {
  var i = 1;
  return (
    <View key={"word" + word + i} style={styles.createWordBlock}>
      <Text style={styles.inputSize}>{word}</Text>
      <View style={styles.numberBlock}>
        <Text style={styles.styleIndex}>{i + index++}</Text>
      </View>
    </View>
  );
};

export default ({ store }) => {
  const changePage = tab => () => {
    if (badSeed(store.current.seed)) return;

    store.current.page = tab;
  };

  const words = store.current.seed.split(" ");
  // console.log("words:", words);

  const seedPhrase = store => {
    return (
      <View style={style.styleSeedWrap}>{words.map(createWordBlock(store))}</View>
    );
  };
  const lang = getLang(store);

  const btnPrint = store => {
    return (
      <Text
        style={styles.textCardLine}
        onPress={() => {
          Linking.openURL(
            `https://drive.google.com/file/d/117CIN7TkLcJFWRQkPYRbU4BK6JOnRgPf/view`
          );
        }}
      >
        {lang.seedNotifyPrint}
      </Text>
    );
  };

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex}>
            <Button
              transparent
              style={styles.arrowHeaderLeft}
              onPress={changePage("newseed")}
            >
              <Icon
                name="ios-arrow-back"
                style={[styles.arrowHeaderIconBlack, { color: "#fff" }]}
              />
            </Button>
          </Left>
          <Body style={styles.viewFlex}>
            <Text style={styles.textH1Seed2}>{lang.newSeedPhrase}</Text>
          </Body>
          <Right style={styles.viewFlex} />
        </Header>
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                {seedPhrase(store)}
                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text={lang.continue}
                    textStyle={{ fontSize: 14 }}
                    gradientBegin="#9d41eb"
                    gradientEnd="#9d41eb"
                    gradientDirection="diagonal"
                    height={50}
                    width={"100%"}
                    radius={10}
                    placeholderTextColor="rgba(255,255,255,0.60)"
                    onPressAction={changePage("confirmseed")}
                  />
                  <Text style={styles.textCard}>
                    {lang.seedNotify}, {btnPrint(store)}
                  </Text>
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
