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
import GradientButton from "../components/GradientButton.js";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import { set, check } from '../wallet/pin.js';
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import Background from "../components/Background.js";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import PickerSetLang from "../components/PickerSetLang.js";


const showToast = message => {
  // console.log(message);
  this.toastify.show(message, 3000);
};

const buttonActive = store => {
  const lang = getLang(store);

  const changePage = (tab) => () => {
    store.tab = tab;
  };

  const signup = async () => {
    if (store.current.signUpInputPinField.length < 6) {
      store.current.signUpInputPinField = "";
      return showToast(lang.validPin);
    }
    await localStorage.clear();
    set(store.current.signUpInputPinField);
    check(store.current.signUpInputPinField);
    await SecureStore.deleteItemAsync("localAuthToken");
    store.current.page = "newseed";
    store.current.newseedstep = "ask";
    store.current.signUpInputPinField = "";
    // store.current.page = "locked";
  };

  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text={lang.continue + " "}
      textStyle={{ fontSize: 14, color: Images.color1 }}
      gradientBegin="#fff"
      gradientEnd="#fff"
      gradientDirection="diagonal"
      height={45}
      width="100%"
      radius={5}
      onPressAction={signup}
    />
  );
};

const buttonInactive = store => {
  const lang = getLang(store);

  return (
    <Button block style={styles.buttonInactive}>
      <Text style={styles.buttonTextInactive}>{lang.continue}</Text>
    </Button>
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
  const lang = getLang(store);
  const changePage = (tab, visible) => () => {
    store.tab = tab;
    store.footerVisible = visible;
    store.current.signUpInputPinField = null;
  };

  const regexPin = /[0-9a-zA-Z]{1,}/;
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
    store.current.pinSave = store.current.signUpInputPinField;
  };
  const inputSuccessPin = store => {
    return (
      <Item style={styles.borderItem}>
        <Icon active name='lock' style={{color: "#fff"}}/>
        <Input
          value={store.current.signUpInputPinField}
          onChangeText={text => handleChangePin(text)}
          secureTextEntry={true}
          returnKeyType="done"
          minLength={6}
          // autoFocus
          keyboardType="default"
          keyboardAppearance="dark"
          placeholder={lang.placeholderSignup}
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={styles.inputSize}
          selectionColor="#fff"
        />
      </Item>
    );
  };

  return (
    <View style={styles.viewFlex}>
          <Background fullscreen={true}/>
        <Toast
          ref={c => (this.toastify = c)}
          position={"top"}
          style={styles.toastStyle}
        />

        <Header transparent style={styles.mtIphoneX}>
          {/*}<Left  style={styles.viewFlexHeader}>{logIn(store)}</Left>{*/}
          <Body  style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={{ opacity: 0.60, marginTop: 5}}>
              <Text style={[styles.styleTxtSeparator, {textAlign: "center"} ]}>v.{lang.ver}</Text>
            </View>
          <View style={styles.widthCard}>
          <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.setupPin}</Text>
            </View>
            {inputSuccessPin(store)}
            {/* {!validInputPinSignUp && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )} */}
            <View style={styles.marginBtn}>{buttonsChangeSignUp(store)}</View>
            <View style={styles.marginBtn1}>{PickerSetLang({ store })}</View>
          </View>
        </View>
    </View>
  );
};
