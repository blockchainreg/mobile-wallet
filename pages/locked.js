import React from "react";
import {
  Text,
  View,
  Header,
  Item,
  Input,
  Body,
  Left,
  Right
} from "native-base";
import { Image, TouchableOpacity, ImageBackground } from "react-native";
import GradientButton from "react-native-gradient-buttons";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
//import navigate from '../wallet/navigate.js';

const showToast = message => {
  this.toastify.show(message, 3000);
};

const buttonActive = store => {
  const login = async () => {
    store.userWallet = 200;
    //store.wallets = [];
    store.current.page = "wallets";
    store.footerVisible = true;
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
const unlock = store => {
  // Validation start
  const regexPin = /^\w{4}$/;
  const validInputPin = (
    !store.settingsInputPinField ||
    regexPin.test(store.settingsInputPinField)
  );
  // Validation end

  return (
    store.settingsInputPinField && validInputPin
    ? buttonActive(store)
    : buttonInactive(store)
  );
};

export default ({ store }) => {
  const changePage = (tab) => () => {
    store.tab = tab;
  };
  // Validation start
  const regexPin = /^\w{4}$/;
  const validInputPin = (
    !store.settingsInputPinField ||
    regexPin.test(store.settingsInputPinField)
  );
  // Validation end

  // Input pin start

  const handleChangePin = async text => {
    store.settingsInputPinField = text;
  };
  const inputSuccessPin = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangePin(text)}
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
        style={{ width: "100%", height: "100%" }}
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
            {inputSuccessPin(store)}
            {!validInputPin && (
              <Text style={styles.error}>Enter a valid pin</Text>
            )}
          </View>
          {unlock(store)}
        </View>
      </ImageBackground>
    </View>
  );
};
