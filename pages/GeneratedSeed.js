import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  Badge,
  ScrollView,
  TextInput
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
  Textarea,
  ListItem
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import SaveSeedModal from "../components/SaveSeedModal.js";
import { generateMnemonic } from "bip39";
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
    <View
      style={styles.createWordBlock}
    >
      <Text style={styles.inputSize}>{word}</Text>
      <View
        style={styles.numberBlock}
      >
        <Text
          style={styles.styleIndex}
        >
          {i + index++}
        </Text>
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
  console.log("words:", words);

  const seedPhrase = store => {
    return (
      <ScrollView style={styles.seedContainerStyle}>
        <View style={style.styleSeedWrap}>
          {words.map(createWordBlock())}
        </View>
      </ScrollView>
    );
  };
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
          <Image source={Images.logo} style={styles.styleLogo} />
          <Text style={styles.textH1Seed}>{lang.newSeedPhrase}!</Text>
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
                  <Text style={styles.textCard}>{lang.seedNotify}</Text>
                </View>
              </Body>
            </CardItem>
          </View>
          <TouchableOpacity onPress={changePage("newseed")}>
            <Text style={styles.textLoginStyle}>{lang.back}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
