import React from "react";
import {
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
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
//import { generateMnemonic } from 'bip39';
//import { refreshAccount } from '../wallet/refresh-account.js';

const showToast = message => {
  this.toastify.show(message, 3000);
};

const number = 4;

export default ({ store, web3t }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const continueProcess = () => {
    expectedWord = store.current.seed.split(" ")[number - 1];

    if (expectedWord !== store.signUpConfirmSeedField) {
      return showToast("Your word does not match to expected word");
    }

    web3t.init(function(err, data) {
      //console.log("refresh", err, data);

      if (err) {
          store.current.page = "error";
          store.current.error = err + "";
      }

      store.current.page = "terms";
      web3t.refresh(function(err, data){

          if (err) {
              store.current.page = "error";
              store.current.error = err + "";
          }

      });
    });
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
        source={require("../assets/intro-bg.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex}>
            <Button
              transparent
              style={styles.arrowHeaderLeft}
              onPress={changePage("newseed")}
            >
              <Icon name="ios-arrow-back" style={styles.arrowIcon} />
            </Button>
          </Left>
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <View style={styles.containerFlexStart}>
          <Image
            source={require("../assets/velas-logo.png")}
            style={styles.styleLogo}
          />
          <Text style={styles.textH1Seed}>Confirmation!</Text>
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
                      placeholder="word from seed"
                      placeholderTextColor="#707070"
                      style={styles.inputSize}
                      selectionColor={"#fff"}
                    />
                  </Item>
                </View>
                <View style={styles.marginBtnSeed}>
                  <Text style={styles.textCard}>
                    Please enter the {number} word to confirm that you saved it
                    in a safe place
                  </Text>
                </View>
              </Body>
            </CardItem>
          </View>
          <TouchableOpacity onPress={continueProcess}>
            <Text style={styles.textLoginStyle}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
