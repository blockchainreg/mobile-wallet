import React from "react";
import {
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar
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
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import Images from '../Images.js';
import setupWallet from '../setupWallet.js';
//import { generateMnemonic } from 'bip39';
//import { refreshAccount } from '../wallet/refresh-account.js';



const showToast = message => {
  this.toastify.show(message, 3000);
};

const number = 4;

export default ({ store, web3t }) => {
  //loadTerms(store);
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const continueProcess = () => {
    expectedWord = store.current.seed.split(" ")[number - 1];

    if (expectedWord !== store.signUpConfirmSeedField) {
      return showToast("Your word does not match to expected word");
    }

    setupWallet(store, web3t);


  };



  const handleConfirmSeedField = async text => {
    store.signUpConfirmSeedField = text;
  };

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
          <Text style={styles.textH1Seed}>Confirmation</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.bodyConfirm}>
                  <Item regular style={styles.borderItemSeed}>
                    <Input
                      // autoFocus
                      value={store.signUpConfirmSeedField}
                      onChangeText={text => handleConfirmSeedField(text)}
                      autoCapitalize="none"
                      secureTextEntry={false}
                      returnKeyType="done"
                      placeholder="word from seed"
                      placeholderTextColor="rgba(255,255,255,0.60)"
                      style={styles.inputSize}
                      selectionColor={"#fff"}
                    />
                  </Item>
                </View>
                <View style={styles.marginBtnSeed}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text="Confirm"
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
                  <Text style={styles.textCard}>
                    Please enter the {number}th word to confirm that you saved it
                    in a safe place
                  </Text>
                </View>
              </Body>
            </CardItem>
          </View>
          <TouchableOpacity onPress={changePage('generatedseed')}>
            <Text style={styles.textLoginStyle}>Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
