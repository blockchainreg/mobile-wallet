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
  Icon,
  Button,
  Separator
} from "native-base";
import { Image, ImageBackground, Platform, } from "react-native";
import Constants from 'expo-constants';
import GradientButton from "../components/GradientButton.js";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import {get} from "../wallet/seed.js";
import {confirm} from "../wallet/pages/confirmation.js";
import {check, set} from "../wallet/pin.js";
import spin from "../utils/spin.js";
//import navigate from '../wallet/navigate.js';
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import Background from "../components/Background.js";

let toastify = null;

export default ({ store, web3t }) => {
  const showToast = message => {
    console.log('Trying to show toast', message);
    toastify && toastify.show(message, 3000);
  };
  const lang = getLang(store);

  const loginQuick = () => {
    store.current.page = "wallets";

    spin(store, lang.loadingBalance, web3t.refresh.bind(web3t))(function(err, data){
      store.current.auth.isLoggingIn = false;
      if (err) {
        store.current.page = "error";
        store.current.error = err + "";
      }
    });
  };

  const loginSlow = () => {
    spin(store, lang.walletDecrypting, web3t.init.bind(web3t))(function(err, data){
      if (err) {
        return showToast(err + "");
      }

      store.current.page = "wallets";
      spin(store, lang.loadingBalance, web3t.refresh.bind(web3t))(function(err, data){
        store.current.auth.isLoggingIn = false;
        if (err) {
          store.current.page = "error";
          store.current.error = err + "";
        }
      });
    });
  };

  const login = (seed) => {
    if (!seed) {
      throw new Error("Cannot login using empty seed");
    }
    try {
      LocalAuthentication.cancelAuthenticate();
    }catch(e){}

    if (store.current.auth.isLoggingIn) {
      return;
    }

    store.current.seed = seed;
    store.current.auth.isLocalAuthEnabled = null;
    store.current.auth.isAuthenticating = false;
    store.current.auth.failedCount = 0;
    store.current.auth.isLoggingIn = false;
    //in case when we already have built objects we can just show it
    if(store.current.account.wallets && store.current.account.wallets.length > 0) {
      loginQuick();
      return;
    }
    loginSlow();
  };

  const LocalAuth = ({store}) => {
    if (store.current.auth.isLocalAuthEnabled === null) {
        setImmediate(() => {
          store.current.auth.isLocalAuthEnabled = false;
          Promise.all([
            LocalAuthentication.hasHardwareAsync(),
            LocalAuthentication.supportedAuthenticationTypesAsync(),
            LocalAuthentication.isEnrolledAsync(),
            SecureStore.getItemAsync("localAuthToken")
          ]).then(([hasHardware, supportedAuthTypes, isEnrolled, token]) => {
              if (token && token.length > 20) {
                //Stored seed phrase? Delete!
                SecureStore.deleteItemAsync("localAuthToken")
                token = null;
              }
              store.current.auth.isLocalAuthEnabled = hasHardware && supportedAuthTypes.length > 0 && isEnrolled && !!token;
              if (token && Platform.OS === 'android') {
                authenticateRecursiveAndroid();
              }
            });
      });
    }

    const useLocalAuth = async () => {
      store.current.auth.isAuthenticating = true;
      const result = await LocalAuthentication.authenticateAsync();
      store.current.auth.isAuthenticating = false;
      if (!result.success) {
        store.current.auth.localAuthError = result.error;
        return;
      }
      if (!check(await SecureStore.getItemAsync("localAuthToken"))) {
        SecureStore.deleteItemAsync("localAuthToken");
        return showToast("Cannot authenticate. Please enter password.");
      }
      login(get());
      store.userWallet = 200;
    };

    const getAuthError = () => {
      switch(store.current.auth.localAuthError) {
        case "authentication_failed":
            return "Authentication failed"
        case "lockout":
            return "Too many tries. Please enter password"
        default:
            return store.current.auth.localAuthError;
      }
    }

    const authenticateRecursiveAndroid = async () => {
      if (store.current.auth.isAuthenticating) {
        return;
      }
      store.current.auth.isAuthenticating = true;
      const result = await LocalAuthentication.authenticateAsync();
      if (!result.success) {
        if (result.error === "user_cancel") {
          return;
        }
        store.current.auth.localAuthError = result.error;
        store.current.auth.failedCount = store.current.auth.failedCount + 1;
        if (result.error === "lockout") {
            return;
        }
        store.current.auth.isAuthenticating = false;
        if (store.current.auth.failedCount > 20) {
          store.current.auth.isLocalAuthEnabled = false;
          return;
        }
        authenticateRecursiveAndroid();
        return;
      }
      store.current.auth.isAuthenticating = false;

      console.log("authenticateRecursiveAndroid success!!!");
      if (!check(await SecureStore.getItemAsync("localAuthToken"))) {
        SecureStore.deleteItemAsync("localAuthToken");
        return showToast("Cannot authenticate. Please enter password.");
      }

      login(get());
      store.userWallet = 200;
    };

    const {isLocalAuthEnabled, isAuthenticating, failedCount} = store.current.auth;
    if (!isLocalAuthEnabled) {
      return <Text style={styles.txtLocked}></Text>;
    }
    if (isAuthenticating) {
      if (failedCount) {
        return <Text style={styles.txtLocked}>{lang.lockedNotificationIos} {failedCount} {getAuthError()}</Text>;
      }
      return <Text style={styles.txtLocked}>{lang.lockedNotificationIos1}</Text>;
    }

    if (Platform.OS === 'android') {
      return <Text style={styles.txtLocked}>{lang.oneMoment}</Text>;
    }
    return <Text onPress={useLocalAuth} style={styles.txtLocked}>{lang.lockedNotificationAndroid}</Text>;
  };

  const buttonActive = store => {
    const lang = getLang(store);
    const loginAction = spin(store, lang.checkingPin, () => {
      if (!check(store.current.pin)) {
        store.current.pin = "";
        return showToast(lang.incorrectPass ||  "Incorrect password");
      }

      login(get());
      store.current.pin = "";
      store.userWallet = 200;
    });
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={lang.continue}
        textStyle={{ fontSize: 14, color: Images.color1 }}
        gradientBegin="#fff"
        gradientEnd="#fff"
        gradientDirection="diagonal"
        height={45}
        width="100%"
        radius={5}
        onPressAction={loginAction}
      />
    );
  };

  const buttonInactive = store => {
    return (
      <Button block style={styles.buttonInactive}>
      <Text style={styles.buttonTextInactive}>{lang.continue}</Text>
    </Button>
    );
  };

  const anotherAccount = store => {
    const anotherAccount = () => {
      confirm(
        store,
        lang.dataOverridden,
        (sure) => {
          if (sure) {
            store.current.page = "register";
          }
        }
      );
    }
    return (
      <GradientButton
        text={lang.createAcc}
        textStyle={{ fontSize: 14, color: "rgba(255,255,255,0.50)" }}
        gradientBegin="transparent"
        gradientEnd="transparent"
        height={45}
        width="100%"
        onPressAction={anotherAccount}
      />
    );
  };

  const unlock = store => {
    // Validation start
    const regexPin = /[0-9a-zA-Z]{6,}/;
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
      {LocalAuth({store})}
    </View>);
  };
  const changePage = (tab) => () => {
    store.tab = tab;
    store.current.pin = "";
  };
  // Validation start
  const regexPin = /[0-9a-zA-Z]{6,}/;
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
      <Item style={styles.borderItem}>
        <Icon active name='lock' style={{color: "#fff"}}/>
        <Input
          onChangeText={text => handleChangePin(text)}
          value={store.current.pin}
          autoCompleteType="off"
          minLength={6}
          // autoFocus
          secureTextEntry={true}
          returnKeyType="done"
          placeholder={lang.placeholderSignup}
          keyboardType="default"
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={styles.inputSize}
          selectionColor={"#fff"}
          keyboardAppearance="dark"
        />
      </Item>
    );
  };

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <Toast
          ref={c => (toastify = c)}
          position="top"
          style={styles.toastStyle}
        />
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader} />
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={styles.styleVersion}>
              <Text style={[styles.styleTxtSeparator, {textAlign: "center"} ]}>v.{Constants.manifest.version}</Text>
            </View>
          <View style={styles.widthCard}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.enterPin}</Text>
            </View>
            {inputSuccessPin(store)}
            {/* {!validInputPin && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )} */}
            {unlock(store)}
          </View>
        </View>



      </View>
  );
};
