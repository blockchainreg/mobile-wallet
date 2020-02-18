import React from "react";
import {
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar
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

let isLoading = false;
async function loadTerms(store) {
  if (isLoading) {
    return;
  }
  isLoading = true;
  try {
    const response = await fetch('https://raw.githubusercontent.com/web3space/wallet/master/TERMS.md');
    store.current.termsMarkdown = await response.text();
    store.current.loading = false;
  }catch(e) {
    console.error(e);
    setTimeout(loadTerms.bind(this, store), 1000);
  }
}

const showToast = message => {
  this.toastify.show(message, 3000);
};

const number = 4;

export default ({ store, web3t }) => {
  loadTerms(store);
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const continueProcess = () => {
    expectedWord = store.current.seed.split(" ")[number - 1];

    if (expectedWord !== store.signUpConfirmSeedField) {
      return showToast("Your word does not match to expected word");
    }

    store.current.loading = true;
    web3t.init(function(err, data) {
      //console.log("refresh", err, data);

      if (err) {
          store.current.page = "error";
          store.current.error = err + "";
          return;
      }

      store.current.page = "terms";
      web3t.refresh(function(err, data){
        if (store.current.termsMarkdown) {
          store.current.loading = false;
        }

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
        style={styles.introBackground}
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
        <StatusBar barStyle="light-content" />
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
