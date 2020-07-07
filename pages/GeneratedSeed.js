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
  Icon,
  Content,
  Button,
  Container,
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
// import { generateMnemonic } from "bip39";
import Images from "../Images.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import style from "../Styles";
import BackButton from "../components/BackButton.js";
import { confirm } from "../wallet/pages/confirmation.js";
import Background from "../components/Background.js";
import {shuffle} from "../utils/array.js";


// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const badSeed = (seed) => {
  blocks = (seed || "").split(" ");
  return blocks.length < 10;
};

const createWordBlock = (store) => (word, index) => {
  return (
    <View key={"word" + word + index} style={styles.createWordBlock}>
      <Text style={styles.inputSize1}>{word}</Text>
      <View style={styles.numberBlock}>
        <Text style={styles.styleIndex}>{index + 1}</Text>
      </View>
    </View>
  );
};

export default ({ store }) => {
  const changePage = (tab) => () => {
    if (badSeed(store.current.seed)) return;

    store.current.page = tab;
    store.current.seedIndex = 0;
    store.current.seedIndexes = shuffle([...Array(24).keys()]);
  };

  const words = store.current.seed.split(" ");
  // console.log("words:", words);

  const seedPhrase = (store) => {
    return (
      <View style={style.styleSeedWrap}>
        {words.map(createWordBlock(store))}
      </View>
    );
  };
  const lang = getLang(store);

  const back = changePage("newseed");

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
      <View style={styles.containerGenerated}>
        <Image source={Images.generate} style={styles.setupImg} />
        <ScrollView style={styles.scrollViewAndroid}>
        {seedPhrase(store)}
        <View style={styles.marginBtn}>
          <View style={styles.containerBtn}>
            <TouchableOpacity onPress={back} style={styles.btnCancel}>
              <Text style={styles.txtBtnBack}>{lang.back}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={changePage("printseed")}
              style={styles.btnNext}
            >
              <Text style={styles.txtBtn}>{lang.continue}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </View>
    </View>
  );
};
