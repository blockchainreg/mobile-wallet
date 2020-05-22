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
  Button
} from "native-base";
import { Image, ImageBackground, Platform, } from "react-native";
import GradientButton from "react-native-gradient-buttons";
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


export default ({ store, web3t }) => {
  const showToast = message => {
    console.log('Trying to show toast', message);
    this.toastify && this.toastify.show(message, 3000);
  };
  const lang = getLang(store);
  let isLoggingIn = false;

  const loginQuick = () => {
    store.current.page = "wallets";
    isLoggingIn = false;

    spin(store, lang.loadingBalance, web3t.refresh.bind(web3t))(function(err, data){
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
      isLoggingIn = false;
      spin(store, lang.loadingBalance, web3t.refresh.bind(web3t))(function(err, data){
        if (err) {
          store.current.page = "error";
          store.current.error = err + "";
        }
      });
    });
  };

  const login = (seed) => {
    if (isLoggingIn) {
      return;
    }

    store.current.seed = seed;
    isLoggingIn = true;
    //in case when we already have built objects we can just show it
    if(store.current.account.wallets && store.current.account.wallets.length > 0) {
      loginQuick();
      return;
    }
    loginSlow();
  };

  class LocalAuth extends React.Component {
    state = {
      isEnabled: null,
      isAuthenticating: false,
      failedCount: 0
    };

    componentDidMount() {
      console.log("LocalAuth did mount");
      const {store} = this.props;

      Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        LocalAuthentication.isEnrolledAsync(),
        SecureStore.getItemAsync("localAuthToken")
      ]).then(([hasHardware, supportedAuthTypes, isEnrolled, token]) => {
          if (this.isUnmounted) {
            return;
          }
          if (token && token.length > 10) {
            //Stored seed phrase? Delete!
            SecureStore.deleteItemAsync("localAuthToken")
            token = null;
          }
          this.setState({ isEnabled: hasHardware && supportedAuthTypes.length > 0 && isEnrolled && !!token });
          if (token && Platform.OS === 'android') {
            this.authenticateRecursiveAndroid();
          }
        });
    }

    componentWillUnmount() {
      if (this.state.isAuthenticating) {
        LocalAuthentication.cancelAuthenticate();
      }
      this.isUnmounted = true;
    }

    useLocalAuth = async () => {
      const {store} = this.props;
      this.setState({isAuthenticating: true});
      const result = await LocalAuthentication.authenticateAsync();
      this.setState({isAuthenticating: false});
      if (!result.success) {
        return;
      }
      if (!check(await SecureStore.getItemAsync("localAuthToken"))) {
        SecureStore.deleteItemAsync("localAuthToken");
        return showToast("Cannot authenticate. Please enter PIN.");
      }

      login(get());
    }

    async authenticateRecursiveAndroid() {
      const {store} = this.props;
      if (this.state.isAuthenticating) {
        return;
      }
      this.setState({isAuthenticating: true});
      const result = await LocalAuthentication.authenticateAsync();
      if (!result.success) {
        if (result.error === "user_cancel") {
          return;
        }
        this.setState(
          {failedCount: this.state.failedCount + 1, isAuthenticating: false},
          () => this.authenticateRecursiveAndroid()
        );
        return;
      }
      this.setState({isAuthenticating: false});

      console.log("authenticateRecursiveAndroid success!!!");
      login(await SecureStore.getItemAsync("localAuthToken"));
    }

    render() {
      const {isEnabled, isAuthenticating, failedCount} = this.state;
      if (!this.state.isEnabled) {
        return null;
      }
      if (isAuthenticating) {
        if (failedCount) {
          return <Text style={styles.txtLocked}>You may scan fingerprint to log in. Failed tries {failedCount}.</Text>;
        }
        return <Text style={styles.txtLocked}>You may scan fingerprint to log in</Text>;
      }

      if (Platform.OS === 'android') {
        return <Text style={styles.txtLocked}>One moment...</Text>;
      }
      return <Text onPress={this.useLocalAuth} style={styles.txtLocked}>Use Fingerprint or Face ID</Text>;
    }
  }

  const buttonActive = store => {
    const loginAction = spin(store, lang.checkingPin, () => {
      if (!check(store.current.pin)) {
        store.current.pin = "";
        return showToast("Incorrect pin");
      }

      login(get());
      store.current.pin = "";
      store.userWallet = 200;
    });
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={lang.continue}
        textStyle={{ fontSize: 14 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={loginAction}
      />
    );
  };

  const buttonInactive = store => {
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={lang.continue}
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
        style={styles.gradientBtnPh}
        text={lang.createAcc}
        textStyle={{ fontSize: 14, color: "rgba(255,255,255,0.50)" }}
        gradientBegin="rgba(221,181,255,0.10)"
        gradientEnd="rgba(221,181,255,0.10)"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={anotherAccount}
      />
    );
  };

  const unlock = store => {
    // Validation start
    const regexPin = /^\w{4}$/;
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
      {!isLoggingIn && <LocalAuth store={store} />}
    </View>);
  };
  const changePage = (tab) => () => {
    store.tab = tab;
    store.current.pin = "";
  };
  // Validation start
  const regexPin = /^\w{4}$/;
  const validInputPin = (
    !store.current.pin ||
    regexPin.test(store.current.pin)
  );
  // Validation end

  // Input pin start

  const handleChangePin = async text => {
    store.current.pin = text;
    store.current.pinSave = store.current.pin;
  };
  const inputSuccessPin = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={text => handleChangePin(text)}
          value={store.current.pin}
          autoCompleteType="off"
          // autoFocus
          secureTextEntry={true}
          returnKeyType="done"
          placeholder={lang.placeholderSignup}
          keyboardType="numeric"
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
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
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
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={styles.widthCard}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.enterPin}</Text>
            </View>
            {inputSuccessPin(store)}
            {!validInputPin && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )}
            {unlock(store)}
          </View>
        </View>
      </ImageBackground>
      </View>
  );
};
