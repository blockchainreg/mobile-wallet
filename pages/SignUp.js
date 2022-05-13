import React from 'react';
import {
  Text,
  Button,
  View,
  Icon,
  Item,
  Body,
  Left,
  Right,
  Toast,
} from 'native-base';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { set, check } from '../wallet/pin.js';
import getLang from '../wallet/get-lang.js';

import PickerSetLang from '../components/PickerSetLang.js';
import Header from '../components/Header';
import Input from '../components/InputSecure';
import StatusBar from '../components/StatusBar.js';

import { VelasLogo1 } from '../svg/velas-logo1.js';
import { Bg } from '../svg/bg.js';

import styles from '../Styles.js';
import Images from '../Images.js';

const REGEX_PIN = /[0-9a-zA-Z]{6,}/;

const ButtonActive = (store) => {
  const lang = getLang(store);

  const changePage = (tab) => () => {
    store.tab = tab;
  };

  const signup = async () => {
    if (
      !store.current.signUpInputPinField ||
      store.current.signUpInputPinField.length < 6
    ) {
      store.current.signUpInputPinField = '';
      return Toast.show({ text: lang.validPin });
    }
    await localStorage.clear();
    set(store.current.signUpInputPinField);
    check(store.current.signUpInputPinField);
    await SecureStore.deleteItemAsync('localAuthToken');
    store.current.page = 'newseed';
    store.current.newseedstep = 'ask';
    store.current.signUpInputPinField = '';
    // store.current.page = "locked";
  };

  return (
    <Button block style={styles.btnVelasActive} onPress={signup}>
      <Text style={styles.textBtn}>{lang.continue}</Text>
    </Button>
  );
};

const ButtonInactive = (store) => {
  const lang = getLang(store);
  const notice = () => {
    if (
      !store.current.signUpInputPinField ||
      store.current.signUpInputPinField.length < 6
    ) {
      store.current.signUpInputPinField = '';
      return Toast.show({ text: lang.validPin });
    }
  };
  return (
    <Button block style={styles.buttonInactive} onPress={notice}>
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

  const validInputPinSignUp =
    !store.current.signUpInputPinField ||
    REGEX_PIN.test(store.current.signUpInputPinField);

  const buttonsChangeSignUp =
    validInputPinSignUp && store.current.signUpInputPinField
      ? ButtonActive
      : ButtonInactive;

  const handleChangePin = async (text) => {
    store.current.signUpInputPinField = text;
    // store.current.pinSave = store.current.signUpInputPinField;
  };
  const inputSuccessPin = (store) => {
    return (
      <Item style={styles.borderItem} testID="passwordInputOnSignup">
        <Icon active name="lock" style={{ color: '#fff' }} />
        <Input
          value={store.current.signUpInputPinField}
          onChangeText={(text) => handleChangePin(text)}
          placeholder={lang.placeholderSignup}
        />
      </Item>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={style.container}
    >
      <View style={styles.image}>
        <StatusBar />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.inner}>
            <View style={{ alignSelf: 'center' }}>
              {/* <Image source={Images.logo} style={[styles.styleLogo, { alignSelf: "center" }]} /> */}
              <VelasLogo1
                style={[styles.styleLogo, { alignSelf: 'center' }]}
                width="72"
                height="63"
                viewBox="0 0 72 63"
              />
              <View style={styles.styleVersion}>
                <Text
                  style={[styles.styleTxtSeparator, { textAlign: 'center' }]}
                >
                  v.{Constants.nativeAppVersion}
                </Text>
              </View>
              <Text style={styles.textH1Seed}>{lang.setupPin}</Text>
            </View>
            <View style={style.paddingBlock}>
              {inputSuccessPin(store)}
              {/* {!validInputPinSignUp && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )} */}
              <View style={styles.marginBtn}>{buttonsChangeSignUp(store)}</View>
            </View>
            <View style={styles.marginBtn1}>
              {PickerSetLang({ store, width: '100%', align: 'center' })}
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Bg style={styles.bgMain} />
      </View>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 0.7,
    justifyContent: 'center',
  },
  marginBtn: {
    alignItems: 'center',
    width: '100%',
  },
  paddingBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
