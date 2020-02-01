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
import { set, check } from '../wallet/pin.js';

const showToast = message => {
  // console.log(message);
  this.toastify.show(message, 3000);
};

const buttonActive = store => {
  const changePage = (tab) => () => {
    store.tab = tab;
  };

  const signup = async () => {
    set(store.current.signUpInputPinField);
    check(store.current.signUpInputPinField);
    store.current.page = "newseed";
    // store.current.page = "locked";
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
      width="100%"
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
      width="100%"
      radius={10}
    />
  );
};

// const logIn = store => {
//   const logInBtn = async () => {
//     if (get() !== store.current.signUpInputPinField) {
//       store.current.signUpInputPinField = "";
//       return;
//     }
//     store.current.page = "newseed";
//   };
//   return (
//     <Button transparent style={styles.arrowHeaderLeft} onPress={logInBtn}>
//       <Icon name="ios-arrow-back" style={styles.arrowIcon} />
//     </Button>
//   );
// };

export default ({ store }) => {
  const changePage = (tab, visible) => () => {
    store.tab = tab;
    store.footerVisible = visible;
    store.current.signUpInputPinField = null;
  };

  const regexPin = /^\w{4}/;
  const validInputPinSignUp = (
    !store.current.signUpInputPinField ||
    regexPin.test(store.current.signUpInputPinField)
  );

  const buttonsChangeSignUp = (
    validInputPinSignUp &&
    store.current.signUpInputPinField
      ? buttonActive
      : buttonInactive
  );

  const handleChangePin = async text => {
    store.current.signUpInputPinField = text;
  };
  const inputSuccessPin = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          value={store.current.signUpInputPinField}
          onChangeText={text => handleChangePin(text)}
          secureTextEntry={true}
          returnKeyType="done"
          placeholder="Pin"
          placeholderTextColor="#707070"
          style={styles.inputSize}
          selectionColor="#fff"
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
          {/*}<Left  style={styles.viewFlex}>{logIn(store)}</Left>{*/}
          <Body  style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <View style={styles.containerFlexStart}>
          <Image
            source={require("../assets/velas-logo.png")}
            style={styles.styleLogo}
          />
          {/* <Text style={styles.textH1Sign}>SignUp</Text> */}
          <View style={styles.widthCard}>
            {inputSuccessPin(store)}
            {!validInputPinSignUp && (
              <Text style={styles.error}>Enter a valid pin</Text>
            )}
            <View style={styles.marginBtn}>{buttonsChangeSignUp(store)}</View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
