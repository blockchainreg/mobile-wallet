import React from "react";
import {
  Text,
  View,
  Header,
  Item,
  Input,
  Body,
  Left,
  Right,
  Button
} from "native-base";
import { Image, TouchableOpacity, ImageBackground } from "react-native";
import GradientButton from "react-native-gradient-buttons";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import {get} from "../wallet/seed.js";
import {confirm} from "../wallet/pages/confirmation.js";
import {check, set} from "../wallet/pin.js";
//import navigate from '../wallet/navigate.js';

export default ({ store, web3t }) => {
  const showToast = message => {
    this.toastify.show(message, 3000);
  };

  const buttonActive = store => {
    const login = async () => {
      if (!check(store.current.pin)) {
        store.current.pin = "";
        return;
      }
      store.current.pin = "";
      store.userWallet = 200;
      store.current.seed = get();
      web3t.init(function(err, data) {
        //console.log("refresh", err, data);

        if (err) {
          return showToast(err + "");
        }

        store.current.page = "wallets";
        store.footerVisible = true;
        web3t.refresh(function(err, data){

            if (err) {
              store.current.page = "error";
              store.current.error = err + "";
            }

        });
      });
      // store.tab = "SetupSeed";
      // store.footerVisible = false;
    };

    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text="Login"
        textStyle={{ fontSize: 14 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={login}
      />
    );
  };

  const buttonInactive = store => {
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text="Login"
        textStyle={{ fontSize: 14, color: "rgba(255,255,255,0.50)" }}
        gradientBegin="rgba(221,181,255,0.30)"
        gradientEnd="rgba(221,181,255,0.30)"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
      />
    );
  };

  const anotherAccount = store => {
    const anotherAccount = () => {
      confirm(
        store,
        "Your current data will be overridden. Please ensure your current mnemonic phrase is in a safe place. Open another account?",
        (sure) => {
          if (sure) {
            store.current.page = "register";
          }
        }
      );
    }
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text="Another Account"
        textStyle={{ fontSize: 14, color: "rgba(255,255,255,0.50)" }}
        gradientBegin="rgba(221,181,255,0.10)"
        gradientEnd="rgba(221,181,255,0.10)"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={anotherAccount}
      />
    );
  };

  const unlock = store => {
    // Validation start
    const regexPin = /^\w{4}$/;
    const validInputPin = (
      !store.current.pin ||
      regexPin.test(store.current.pin)
    );
    // Validation end

    return (<View style={styles.marginBtn}>
      {
      store.current.pin && validInputPin
      ? buttonActive(store)
      : buttonInactive(store)}
      <View height={15}></View>
      {anotherAccount(store)}
    </View>);
  };

  const changePage = (tab) => () => {
    store.tab = tab;
    store.current.pin = "";
  };
  // Validation start
  const regexPin = /^\w{4}$/;
  const validInputPin = (
    !store.current.pin ||
    regexPin.test(store.current.pin)
  );
  // Validation end

  // Input pin start

  const handleChangePin = async text => {
    store.current.pin = text;
  };
  const inputSuccessPin = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangePin(text)}
          value={store.current.pin}
          autoCompleteType="off"
          autoFocus
          secureTextEntry={true}
          returnKeyType="done"
          placeholder="Pin"
          keyboardType="numeric"
          placeholderTextColor="#707070"
          style={styles.inputSize}
          selectionColor={"#fff"}
        />
      </Item>
    );
  };

  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={require("../assets/intro-bg.jpg")}
        style={styles.introBackground}
      >
        <Toast
          ref={c => (this.toastify = c)}
          position="top"
          style={styles.toastStyle}
        />
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
          <View style={styles.widthCard}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textH1Seed}>Enter Your PIN</Text>
            </View>
            {inputSuccessPin(store)}
            {!validInputPin && (
              <Text style={styles.error}>Enter a valid pin</Text>
            )}
            {unlock(store)}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
