import React from "react";
import {
  Image,
  ImageBackground,
} from "react-native";
import GradientButton from "react-native-gradient-buttons";
import {
  Text,
  Button,
  View,
  Icon,
  Item,
  Input,
  CardItem,
  Body,
  Header,
  Left,
  Right
} from "native-base";
import StatusBar from "../components/StatusBar.js";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import Images from '../Images.js';
import setupWallet from '../setupWallet.js';
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
//import { generateMnemonic } from 'bip39';
//import { refreshAccount } from '../wallet/refresh-account.js';



const showToast = message => {
  this.toastify.show(message, 3000);
};



export default ({ store, web3t }) => {
  //loadTerms(store);

  const lang = getLang(store);

  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const number = store.current.seedIndexes[store.current.seedIndex];
  const placeholderConfirmSeed = (number + 1) + " " + lang.placeholderConfirmSeed;
  const continueProcess = () => {
    expectedWord = store.current.seed.split(" ")[number];

    if (expectedWord !== store.signUpConfirmSeedField) {
      return showToast(lang.inconsistency);
    }

    if (store.current.seedIndex < 23) {
      store.signUpConfirmSeedField = "";
      store.current.seedIndex += 1;
      return;
    }

    setupWallet(store, web3t);


  };


  const handleConfirmSeedField = async text => {
    store.signUpConfirmSeedField = text;
  };
  const back = ()=> {

    if (store.current.seedIndex > 0) {
      store.signUpConfirmSeedField = "";
      store.current.seedIndex -= 1;
      return;
    }

    store.current.page = "generatedseed";
  }

  return (
    <View style={styles.viewFlex}>
      <Toast
        ref={c => (this.toastify = c)}
        position={"top"}
        style={styles.toastStyle}
      />
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={back}/>
          </Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <Text style={styles.textH1Seed}>{lang.confirmation}</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.bodyConfirm}>
                  <Item regular style={styles.borderItemSeed}>
                    <Input
                      autoFocus
                      value={store.signUpConfirmSeedField}
                      onChangeText={text => handleConfirmSeedField(text)}
                      autoCapitalize="none"
                      secureTextEntry={false}
                      returnKeyType="done"
                      placeholder={placeholderConfirmSeed}
                      placeholderTextColor="rgba(255,255,255,0.60)"
                      style={styles.inputSize}
                      selectionColor={"#fff"}
                      keyboardAppearance="dark"
                    />
                  </Item>
                </View>
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
                    onPressAction={continueProcess}
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
