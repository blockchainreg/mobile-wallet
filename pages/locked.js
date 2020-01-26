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
    store.tab = "Wallets";
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
      width={"100%"}
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
      width={"100%"}
      radius={10}
      
      
    />
  );
};
const signUp = store => {
  const signUpBtn = async () => {
    store.current.page = "register";

    store.signUpInputMailField = "";
    store.signUpInputPasswordField = "";
  };
  return (
    <GradientButton
      style={styles.gradientBtnBorder}
      text="Signup"
      textStyle={{ fontSize: 14, color: "#9d41eb" }}
      gradientBegin="transparent"
      gradientEnd="transparent"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={10}
      
      
      onPressAction={signUpBtn}
    />
  );
};

const resetPas = store => {
  const resetPasBtn = async () => {
    store.tab = "ResetPassword";
    store.footerVisible = false;
    store.signUpInputMailField = "";
    store.signUpInputPasswordField = "";
  };
  return (
    <TouchableOpacity onPress={resetPasBtn}>
      <Text style={styles.textLoginStyle}>Forgot your password?</Text>
    </TouchableOpacity>
  );
};

export default ({ store }) => {
  const changePage = (tab) => () => {
    store.tab = tab;
  };

  // Validation start
  const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validInputMail =
    store.settingsInputMailField && store.settingsInputMailField.length > 0
      ? regexMail.test(store.settingsInputMailField)
      : true;
  // Validation end

  const buttonChangeLoginIn =
    validInputMail &&
    // validInputPassword &&
    store.settingsInputMailField &&
    store.settingsInputPasswordField
      ? buttonActive
      : buttonInactive;

  // Input mail start

  const handleChangeEmail = async text => {
    store.settingsInputMailField = text;
  };
  const inputSuccessMail = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangeEmail(text)}
          returnKeyType="done"
          placeholder="Email"
          keyboardType={"email-address"}
          placeholderTextColor="#707070"
          style={styles.inputSize}
          selectionColor={"#fff"}
        />
      </Item>
    );
  };

  const handleChangePassword = async text => {
    store.settingsInputPasswordField = text;
  };
  const inputSuccesPassword = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangePassword(text)}
          secureTextEntry={true}
          returnKeyType="done"
          placeholder="Password"
          placeholderTextColor="#707070"
          style={styles.inputSize}
          selectionColor={"#fff"}
        />
      </Item>
    );
  };

  // Input password end

  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={require("../assets/intro-bg.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Toast
          ref={c => (this.toastify = c)}
          position={"top"}
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
            {inputSuccessMail(store)}
            {!validInputMail && (
              <Text style={styles.error}>Enter a valid email</Text>
            )}
            {inputSuccesPassword(store)}
            <View style={styles.marginBtn}>{buttonChangeLoginIn(store)}</View>
          </View>
          {signUp(store)}
          {resetPas(store)}
        </View>
      </ImageBackground>
    </View>
  );
};
