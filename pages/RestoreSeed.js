import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  Input,
  Item,
  Text,
  Button,
  View,
  Icon,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Textarea,
  Toast
} from "native-base";
import bip39 from "bip39";
import styles from "../Styles.js";
import GradientButton from "../components/GradientButton.js";
import Images from "../Images.js";
import setupWallet from "../setupWallet.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import SeedWord from "../components/SeedWord.js";
import { set } from "../wallet/seed.js";
import {confirm} from "../wallet/pages/confirmation.js";

// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const seedContainerStyle = {
  borderWidth: 1,
  borderRadius: 0,
  width: "100%",
  borderColor: "#fff",
  marginTop: 20,
  padding: 10
};

export default ({ store, web3t }) => {
  const changePage = tab => () => {
    store.signUpConfirmSeedField = "";
    store.current.page = tab;
  };

  const onSeedConfirmed = (seed) => {
    store.current.seed = seed;
    set(store.current.seed);
    setupWallet(store, web3t);
  };
  const done = () => {

    if(store.signUpConfirmSeedField == "") return Toast.show({text: "Empty word is not allowed"});

    if (store.current.seedWords.length > 1 && bip39.wordlists.EN.indexOf(store.signUpConfirmSeedField) === -1) {
      return Toast.show({text: "You have mistake in your word"});
    }

    store.current.seedWords[number] = store.signUpConfirmSeedField;
    store.signUpConfirmSeedField = "";
    if(store.current.seedIndex < store.current.seedWords.length - 1) {
      store.current.seedIndex += 1;
      return
    }
    try {
        for(let i = 0; i < store.current.seedWords.length - 11; i += 12) {
            bip39.mnemonicToEntropy(store.current.seedWords.slice(i, i+12).join(" "));
        }
        onSeedConfirmed(store.current.seedWords.join(' '));
    }
    catch (e) {
	  alert(
          "Seed phrase checksum not match. Go back and select custom seed phrase if you need.",
          () => {
            store.current.seedIndex = 0;
            store.current.seedWords = store.current.seedWords.map(() => "");
          }
        );
    }
  };

  const number = store.current.seedIndexes[store.current.seedIndex];
  const changeSeed = (word) => {
    store.signUpConfirmSeedField = word;
  };

  const seedPhrase = (store) => {
      if (store.current.seedIndexes.length === 1) {
        return seedPhraseCustom(store);
      }
      return SeedWord(store, changeSeed, number);
  };
  const seedPhraseCustom = (store) => {
      return (
        <View style={seedContainerStyle}>
          <Textarea
            rowSpan={2}
            placeholder={lang.placeholderSeed}
            placeholderTextColor="rgba(255,255,255,0.60)"
            style={styles.inputSize}
            selectionColor={"#fff"}
            autoCapitalize="none"
            value={store.signUpConfirmSeedField}
            onChangeText={changeSeed}
            keyboardAppearance="dark"
            // returnKeyType={'return'}
            keyboardType="default"
            autoFocus
            blurOnSubmit={true}
          />
        </View>
      );

  };

  const lang = getLang(store);
  const back = changePage("newseed");

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <Background fullscreen={true}/>

        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={back}/>
          </Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? "padding" : null} >
      <ScrollView>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image source={Images.generate} style={[styles.setupImg, {marginBottom: 0}]} />
          <Text style={styles.textH1Seed}>{lang.restoreSeed}</Text>
          <View style={styles.card1}>
            <CardItem style={Platform.OS === 'ios' ? styles.cardItemSeed : styles.cardItemSeedAndroid}>
              <Body>
                {seedPhrase(store)}
                <View style={Platform.OS === 'ios' ? styles.marginBtn : styles.marginBtnAndroid}>
                  {/* <GradientButton
                    style={styles.gradientBtnPh}
                    text={lang.continue}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="98%"
                    radius={0}
                    onPressAction={done}
                  /> */}
                  <Button block style={styles.btnVelasActive} onPress={done}>
                        <Text style={styles.textBtn}>{lang.continue}</Text>
                      </Button>
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
};
