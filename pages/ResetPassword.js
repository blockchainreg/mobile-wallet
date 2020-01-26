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

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};

const buttonActive = store => {
  const changePage = (tab, visible) => () => {
    store.tab = tab;
    store.footerVisible = visible;
  };

  const resetPassword = async () => {
    const params = {
      email: store.resetPasswordInputMailField
    };


    store.tab = "LoginIn";
    store.footerVisible = false;
  };

  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text="Reset"
      textStyle={{ fontSize: 14 }}
      gradientBegin="#9d41eb"
      gradientEnd="#9d41eb"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={10}
      
      
      onPressAction={resetPassword}
    />
  );
};

const buttonInactive = store => {
  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text="Reset"
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
    store.tab = "LoginIn";
    store.footerVisible = false;
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
    store.resetPasswordInputMailField = null;
    store.signUpInputPasswordField = null;
  };

  const regexMailSignUp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validInputMailSignUp =
    store.resetPasswordInputMailField &&
    store.resetPasswordInputMailField.length > 0
      ? regexMailSignUp.test(store.resetPasswordInputMailField)
      : true;

  const buttonsChangeResetPas =
    validInputMailSignUp && store.resetPasswordInputMailField
      ? buttonActive
      : buttonInactive;

  const handleChangeEmailResetPas = async text => {
    store.resetPasswordInputMailField = text;
  };
  const inputResetPasMail = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangeEmailResetPas(text)}
          returnKeyType="done"
          placeholder="Enter your email"
          keyboardType={"email-address"}
          placeholderTextColor="#707070"
          style={styles.inputSize}
          selectionColor={"#FFF"}
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
          <View style={styles.widthCard}>
            {inputResetPasMail(store)}
            {!validInputMailSignUp && (
              <Text style={styles.error}>Enter a valid email</Text>
            )}
            <View style={styles.marginBtn}>{buttonsChangeResetPas(store)}</View>
          </View>
        </View>
</ImageBackground>
    </View>
  );
};
