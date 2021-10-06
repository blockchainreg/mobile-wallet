import React, { useState, useEffect } from "react";
import {
  Image,
  Clipboard,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { View, TextInput, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import {
  Input,
  Item,
  Text,
  Button,
  Icon,
  CardItem,
  Body,
  Left,
  Right,
  Textarea,
  Toast,
  Content,
  Container
} from "native-base";
import bip39 from "bip39";
import styles from "../Styles.js";
import Images from "../Images.js";
import setupWallet from "../setupWallet.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import SeedWord from "../components/SeedWord.js";
import { set } from "../wallet/seed.js";
import {confirm} from "../wallet/pages/confirmation.js";
import Header from '../components/Header';

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
  // const ImageHideShow = () => {
  //   useEffect(() => {
  //     Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
  //     Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
  
  //     // cleanup function
  //     return () => {
  //       Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
  //       Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
  //     };
  //   }, []);
  
  //   const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  //   const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
  //   const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");
  //   return (
  //     keyboardStatus === "Keyboard Shown" ? null : 
  //     <View style={{alignSelf: "center"}}>
  //     <Image source={Images.generate} style={[styles.setupImg, {marginBottom: 0}]} /> 
  //     <Text style={styles.textH1Seed}>{lang.restoreSeed}</Text>
  //     </View>
  //   )
  // }
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

    if(store.signUpConfirmSeedField == "") return Toast.show({text: lang.emptyWord});

    if (store.current.seedWords.length > 1 && bip39.wordlists.EN.indexOf(store.signUpConfirmSeedField) === -1) {
      return Toast.show({text: lang.youHaveMistake});
    }

    store.current.seedWords[number] = store.signUpConfirmSeedField;
    store.signUpConfirmSeedField = "";
    if(store.current.seedIndex < store.current.seedWords.length - 1) {
      store.current.seedIndex += 1;
      return
    }
		/* First check mnemonic generated with 256 bits length seed */
		try {
			bip39.mnemonicToEntropy(store.current.seedWords.join(" "));
			return onSeedConfirmed(store.current.seedWords.join(' '));
		}
		catch (e) {}

		/* Second check mnemonic generated with 2 seeds by 128 bits length */
    try {
			for(let i = 0; i < store.current.seedWords.length - 11; i += 12) {
				bip39.mnemonicToEntropy(store.current.seedWords.slice(i, i+12).join(" "));
			}
			onSeedConfirmed(store.current.seedWords.join(' '));
		}
		catch (e) {
	  	alert(
          "Seed phrase checksum does not match. Go back and select custom seed phrase if you need.",
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
            selectionColor={Platform.OS === "ios" ? "#fff" : "rgba(255,255,255,0.60)"}
            autoCapitalize="none"
            value={store.signUpConfirmSeedField}
            onChangeText={changeSeed}
            keyboardAppearance="dark"
            returnKeyType={'return'}
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
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={style.container}
      >
      <Header onBack={back} transparent/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style.inner}>
          <View style={{alignSelf: "center"}}>
            <Image source={Images.generate} style={[styles.setupImg, {marginBottom: 0}]} /> 
            <Text style={styles.textH1Seed}>{lang.restoreSeed}</Text>
          </View>

          <View style={{paddingHorizontal: 20, paddingTop: 20}}>
            {seedPhrase(store)}
            <View style={style.marginBtn}>
              <Button block style={styles.btnVelasActive} onPress={done}>
                <Text style={styles.textBtn}>{lang.continue}</Text>
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
};

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    flex: 0.7,
    justifyContent: "center",
  },
  marginBtn: {
    alignItems: "center",
    width: "100%",
  },
});