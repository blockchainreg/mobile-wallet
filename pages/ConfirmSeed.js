import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground
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
  Textarea
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import SaveSeedModal from "../components/SaveSeedModal.js";
import Toast from "@rimiti/react-native-toastify";
//import { generateMnemonic } from 'bip39';
//import { refreshAccount } from '../wallet/refresh-account.js';

const showToast = message => {
  this.toastify.show(message, 3000);
};

const number = 4;

export default ({ store, web3t }) => {

  const continueProcess = () => {
    expectedWord = store.current.seed.split(" ")[number - 1];

    if (expectedWord !== store.signUpConfirmSeedField) {

      return showToast("Your word does not match to expected word");
    }

    web3t.init(function(err, data) {
        //console.log("refresh", err, data);

        if (err) {
          return showToast(err + "");
        }

        store.current.page = "wallets";
        console.log("refresh start from confirm");
        web3t.refresh(function(err, data){
            console.log("refresh end from confirm", err);
        });

    })

    
  };


  const handleConfirmSeedField = async text => {
      store.signUpConfirmSeedField = text;
  }

  return (
    <View style={styles.viewFlex}>
        <Toast
          ref={c => (this.toastify = c)}
          position={"top"}
          style={styles.toastStyle}
        />

      {/* <View style={styles.viewLogin}> */}
      <ImageBackground
        source={require("../assets/intro-bg.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex} />
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
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    width: "100%",
                    borderColor: "#fff",
                    marginTop: 20
                  }}
                >
                  <View style={{ padding: 10 }}>
                          <Item regular style={styles.borderItem}>
                              <Input
                                value={store.signUpConfirmSeedField}
                                onChangeText={text => handleConfirmSeedField(text)}
                                secureTextEntry={false}
                                returnKeyType="done"
                                placeholder="{number} word from seed"
                                placeholderTextColor="#707070"
                                style={styles.inputSize}
                                selectionColor={"#fff"}
                              />
                            </Item>
                  </View>
                </View>

                <View style={styles.marginBtn}>
                  <Text style={styles.textCard}>
                    Please enter the {number} word to confirm that you saved it in a safe place
                  </Text>
                </View>
              </Body>
            </CardItem>
          </View>
          {/* {SaveSeedModal({ store })} */}
          <TouchableOpacity onPress={continueProcess}>
            <Text style={styles.textLoginStyle}>Continue</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ImageBackground>
    </View>
  );
};
