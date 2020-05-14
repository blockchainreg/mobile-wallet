import React from "react";
import {
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Linking,
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
import BackButton from "../components/BackButton.js";
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

const randOrd = () => {
  return (Math.round(Math.random())-0.5);
}

export default ({ store }) => {
  const changePage = tab => () => {
    if (badSeed(store.current.seed)) return;

    store.current.page = tab;
    store.current.seedIndex = 0;
    store.current.seedIndexes = [...Array(24).keys()].sort(randOrd)
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
            `https://drive.google.com/file/d/1mE53JDe2722D0BY2Mi7qIcXUFtwqSZFx/view`
          );
        }}
      >
        {lang.seedNotifyPrint}
      </Text>
    );
  };

  const back = changePage("newseed");

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <ImageBackground
        style={styles.introBackground}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
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
                width={"40%"}
                radius={10}
                placeholderTextColor="rgba(255,255,255,0.60)"
                onPressAction={changePage("confirmseed")}
              />
              <GradientButton
                style={styles.gradientBtnPh}
                text={lang.back}
                textStyle={{ fontSize: 14 }}
                gradientBegin="gray"
                gradientEnd="gray"
                gradientDirection="diagonal"
                height={50}
                width={"40%"}
                radius={10}
                placeholderTextColor="rgba(255,255,255,0.60)"
                onPressAction={back}
              />
              <Text style={styles.textCard}>
                {lang.seedNotify}, {btnPrint(store)}
              </Text>
                </View>
        </View>
      </ImageBackground>
    </View>
  );
};
