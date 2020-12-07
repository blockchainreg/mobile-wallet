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
  Right,
  BackHandler
} from "native-base";
import { Image, ImageBackground } from "react-native";
import GradientButton from "../components/GradientButton.js";
import styles from "../Styles.js";
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";

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
      text={lang.reset}
      textStyle={{ fontSize: 14 }}
      gradientBegin="#9d41eb"
      gradientEnd="#9d41eb"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={0}


      onPressAction={resetPassword}
    />
  );
};

const buttonInactive = store => {
  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text={lang.reset}
      textStyle={{ fontSize: 14, color: "rgba(255,255,255,0.50)" }}
      gradientBegin="rgba(221,181,255,0.30)"
      gradientEnd="rgba(221,181,255,0.30)"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={0}


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
  // <Button transparent style={styles.arrowHeaderLeft} onPress={logInBtn}>
  //   <Icon name="ios-arrow-back"  />
  // </Button>

  return (
    <BackButton onBack={logInBtn} style={styles.arrowIcon} />
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
  const lang = getLang(store);
  const inputResetPasMail = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangeEmailResetPas(text)}
          returnKeyType="done"
          placeholder="Enter your email"
          keyboardType={"email-address"}
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={styles.inputSize}
          selectionColor={"#FFF"}
          keyboardAppearance="dark"
        />
      </Item>
    );
  };

  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
        <Left style={styles.viewFlexHeader}>{logIn(store)}</Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <View style={styles.containerFlexStart}>
        <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={styles.widthCard}>
            {inputResetPasMail(store)}
            {!validInputMailSignUp && (
              <Text style={styles.error}>{lang.validEmail}</Text>
            )}
            <View style={styles.marginBtn}>{buttonsChangeResetPas(store)}</View>
          </View>
        </View>
</ImageBackground>
    </View>
  );
};
