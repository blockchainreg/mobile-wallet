import React from "react";
import {
  Text,
  Button,
  View,
  Icon,
  Item,
  Input,
  Body,
  Header,
  Left,
  Right
} from "native-base";
import { Image, ImageBackground } from "react-native";
import GradientButton from "react-native-gradient-buttons";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import { saved, set, get } from '../wallet/seed.js';

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};

const buttonActive = store => {
  const changePage = (tab) => () => {
    store.tab = tab;
  };

  const signup = async () => {

    store.current.pin = store.signUpInputMailField + "___" + store.signUpInputPasswordField
    store.current.page = "newseed";
    set(store.current.pin)

    //showToast("Confirm registration by mail");
    

    // console.log('userToken', store.userToken);
    // console.log('userWallet', store.userWallet);
    //store.current.page = "locked";
  };

  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text="Signup"
      textStyle={{ fontSize: 14 }}
      gradientBegin="#9d41eb"
      gradientEnd="#9d41eb"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={10}
      
      
      onPressAction={signup}
    />
  );
};

const buttonInactive = store => {
  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text="Signup"
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

const logIn = store => {
  const logInBtn = async () => {
    store.current.page = "locked";
    store.settingsInputMailField = "";
    store.settingsInputPasswordField = "";
  };
  return (
    <Button transparent style={styles.arrowHeaderLeft} onPress={logInBtn}>
      <Icon name="ios-arrow-back" style={styles.arrowIcon} />
    </Button>
  );
};

export default ({ store }) => {
  const changePage = (tab, visible) => () => {
    store.tab = tab;
    store.footerVisible = visible;
    store.signUpInputUserNameField = null;
    store.signUpInputMailField = null;
    store.signUpInputPasswordField = null;
  };

  const regexUserName = /[^a-z]+/;
  const validInputSignUp =
    store.signUpInputUserNameField && store.signUpInputUserNameField.length > 0
      ? regexUserName.test(store.signUpInputUserNameField)
      : true;

  const regexMailSignUp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validInputMailSignUp =
    store.signUpInputMailField && store.signUpInputMailField.length > 0
      ? regexMailSignUp.test(store.signUpInputMailField)
      : true;

  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  const validInputPasswordSignUp =
    store.signUpInputPasswordField && store.signUpInputPasswordField.length > 0
      ? regexPassword.test(store.signUpInputPasswordField)
      : true;

  const buttonsChangeSignUp =
    validInputSignUp &&
    validInputMailSignUp &&
    validInputPasswordSignUp &&
    store.signUpInputMailField &&
    store.signUpInputPasswordField
      ? buttonActive
      : buttonInactive;

  const handleChangeNameSignUp = async text => {
    store.signUpInputUserNameField = text;
  };



  const handleChangeEmailSignUp = async text => {
    store.signUpInputMailField = text;
  };
  const inputSignUpMail = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          value={store.signUpInputMailField}
          onChangeText={text => handleChangeEmailSignUp(text)}
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
    store.signUpInputPasswordField = text;
  };
  const inputSuccesPassword = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          value={store.signUpInputPasswordField}
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
          <Left style={styles.viewFlex}>{logIn(store)}</Left>
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <View style={styles.containerFlexStart}>
          <Image
            source={require("../assets/velas-logo.png")}
            style={styles.styleLogo}
          />
          {/* <Text style={styles.textH1Sign}>SignUp</Text> */}
          <View style={styles.widthCard}>
            {inputSignUpMail(store)}
            {!validInputMailSignUp && (
              <Text style={styles.error}>Enter a valid email</Text>
            )}
            {!validInputSignUp && (
              <Text style={styles.error}>Enter a user name</Text>
            )}
            {inputSuccesPassword(store)}
            {!validInputPasswordSignUp && (
              <Text style={styles.error}>Enter a valid password</Text>
            )}
            <View style={styles.marginBtn}>{buttonsChangeSignUp(store)}</View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
