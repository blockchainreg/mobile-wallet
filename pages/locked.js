import React from 'react';
import { Text, View, Item, Icon, Button, Toast } from 'native-base';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import styles from '../Styles.js';
import { get } from '../wallet/seed.js';
import { confirm } from '../wallet/pages/confirmation.js';
import { check, set } from '../wallet/pin.js';
import spin from '../utils/spin.js';
//import navigate from '../wallet/navigate.js';
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';
import Header from '../components/Header';
import Input from '../components/InputSecure';
import StatusBar from '../components/StatusBar.js';
import initStaking from '../initStaking.js';
import { VelasLogo1 } from '../svg/velas-logo1.js';
import { Bg } from '../svg/bg.js';
export default ({ store, web3t }) => {
  const lang = getLang(store);

  const loginQuick = () => {
    //initStaking(store);
    store.current.page = 'wallets';
    store.current.auth.isLocalAuthEnabled = null;
    store.current.auth.isAuthenticating = false;
    store.current.auth.failedCount = 0;
    store.current.auth.isLoggingIn = false;
    store.current.pin = '';
    console.log('loginQuick');
    spin(
      store,
      lang.loadingBalance,
      web3t.refresh.bind(web3t)
    )(function (err, data) {
      console.log('after loginQuick');
      store.current.auth.isLoggingIn = false;
      if (err) {
        store.current.page = 'error';
        store.current.error = err + '';
      }
    });
  };

  const loginSlow = () => {
    console.log('[loginSlow]');
    spin(
      store,
      lang.walletDecrypting,
      web3t.init.bind(web3t)
    )(function (err, data) {
      if (err) {
        return Toast.show({ text: err + '' });
      }

      //initStaking(store);

      store.current.page = 'wallets';
      store.current.auth.isLocalAuthEnabled = null;
      store.current.auth.isAuthenticating = false;
      store.current.auth.failedCount = 0;
      store.current.auth.isLoggingIn = false;
      store.current.pin = '';

      spin(
        store,
        lang.loadingBalance,
        web3t.refresh.bind(web3t)
      )(function (err, data) {
        store.current.auth.isLoggingIn = false;
        if (err) {
          store.current.page = 'error';
          store.current.error = err + '';
        }
      });
    });
  };

  const login = (seed) => {
    if (!seed) {
      throw new Error('Cannot login using empty seed');
    }
    try {
      LocalAuthentication.cancelAuthenticate().catch(() => {});
    } catch (e) {}

    if (store.current.auth.isLoggingIn) {
      return;
    }

    store.current.seed = seed;
    //in case when we already have built objects we can just show it
    if (
      store.current.account.wallets &&
      store.current.account.wallets.length > 0
    ) {
      loginQuick();
      return;
    }
    loginSlow();
  };

  const LocalAuth = ({ store }) => {
    if (store.current.auth.isLocalAuthEnabled === null) {
      setImmediate(() => {
        store.current.auth.isLocalAuthEnabled = false;
        Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
          LocalAuthentication.isEnrolledAsync(),
          SecureStore.getItemAsync('localAuthToken'),
        ]).then(([hasHardware, supportedAuthTypes, isEnrolled, token]) => {
          if (token && token.length > 20) {
            //Stored seed phrase? Delete!
            SecureStore.deleteItemAsync('localAuthToken');
            token = null;
          }
          store.current.auth.isLocalAuthEnabled =
            hasHardware &&
            supportedAuthTypes.length > 0 &&
            isEnrolled &&
            !!token;
        });
      });
    }

    const useLocalAuth = async () => {
      store.current.auth.isAuthenticating = true;
      const result = await LocalAuthentication.authenticateAsync();
      store.current.auth.isAuthenticating = false;
      if (!result.success) {
        Alert.alert(
          'Cannot authenticate. Please enter password or try again later.'
        );
        store.current.auth.localAuthError = result.error;
        return;
      }
      if (!check(await SecureStore.getItemAsync('localAuthToken'))) {
        SecureStore.deleteItemAsync('localAuthToken');
        return Toast.show({
          text: 'Cannot authenticate. Please enter password.',
        });
      }
      login(get());
      store.userWallet = 200;
    };

    const getAuthError = () => {
      switch (store.current.auth.localAuthError) {
        case 'authentication_failed':
          return 'Authentication failed';
        case 'lockout':
          return 'Too many tries. Please enter password';
        default:
          return store.current.auth.localAuthError;
      }
    };

    const { isLocalAuthEnabled, isAuthenticating, failedCount } =
      store.current.auth;
    if (!isLocalAuthEnabled) {
      return <Text style={styles.txtLocked}></Text>;
    }
    if (isAuthenticating) {
      if (failedCount) {
        return (
          <Text style={styles.txtLocked}>
            {lang.lockedNotificationIos} {failedCount} {getAuthError()}
          </Text>
        );
      }
      return (
        <Text style={styles.txtLocked}>{lang.lockedNotificationIos1}</Text>
      );
    }

    return (
      <Text onPress={useLocalAuth} style={styles.txtLocked}>
        {lang.lockedNotificationAndroid}
      </Text>
    );
  };

  const buttonActive = (store) => {
    const lang = getLang(store);
    const loginAction = spin(store, lang.checkingPin, () => {
      if (!check(store.current.pin)) {
        store.current.pin = '';
        return Toast.show({ text: lang.incorrectPass || 'Incorrect password' });
      }

      login(get());
      store.current.pin = '';
      store.walletStarted = false;
      store.userWallet = 200;
    });
    return (
      <Button
        block
        style={styles.btnVelasActive}
        onPress={() => setImmediate(loginAction)}
      >
        <Text style={styles.textBtn}>{lang.continue}</Text>
      </Button>
    );
  };

  const buttonInactive = (store) => {
    return (
      <Button block style={styles.buttonInactive}>
        <Text style={styles.buttonTextInactive}>{lang.continue}</Text>
      </Button>
    );
  };

  const anotherAccount = (store) => {
    const anotherAccount = () => {
      confirm(store, lang.dataOverridden, (sure) => {
        if (sure) {
          store.walletStarted = false;
          store.current.page = 'register';
        }
      });
    };
    return (
      <Button block transparent onPress={anotherAccount}>
        <Text style={styles.textBtnTransparent}>{lang.createAcc}</Text>
      </Button>
    );
  };

  const unlock = (store) => {
    // Validation start
    const regexPin = /[0-9a-zA-Z]{6,}/;
    const validInputPin =
      !store.current.pin || regexPin.test(store.current.pin);
    // Validation end
    return (
      <>
        <View style={styles.marginBtn}>
          {store.current.pin && validInputPin
            ? buttonActive(store)
            : buttonInactive(store)}
          {/* <View height={15}></View> */}
        </View>
        {anotherAccount(store)}
        {LocalAuth({ store })}
      </>
    );
  };
  const changePage = (tab) => () => {
    store.tab = tab;
    store.current.pin = '';
  };
  // Validation start
  const regexPin = /[0-9a-zA-Z]{6,}/;
  const validInputPin = !store.current.pin || regexPin.test(store.current.pin);
  // Validation end

  // Input pin start

  const handleChangePin = async (text) => {
    store.current.pin = text;
  };
  const inputSuccessPin = (store) => {
    return (
      <Item style={styles.borderItem}>
        <Icon active name="lock" style={{ color: '#fff' }} />
        <Input
          placeholder={lang.placeholderSignup}
          value={store.current.pin}
          onChangeText={(text) => handleChangePin(text)}
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
              <Text style={styles.textH1Seed}>{lang.enterPin}</Text>
            </View>
            <View style={style.paddingBlock}>
              {inputSuccessPin(store)}
              {/* {!validInputPin && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )} */}
              {unlock(store)}
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
