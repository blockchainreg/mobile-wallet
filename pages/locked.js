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
import { Image, ImageBackground, runAfterInteractions } from "react-native";
import GradientButton from "react-native-gradient-buttons";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import {get} from "../wallet/seed.js";
import {confirm} from "../wallet/pages/confirmation.js";
import {check, set} from "../wallet/pin.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import SvgUri from "react-native-svg-uri";
import Spinner from "../utils/spinner.js";
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
  const loginQuick = () => {
    const balancesSpinner = new Spinner(
      store,
      lang.loadingBalance,
      {displayDescription: "true"}
    );
    setTimeout(() => {
      store.current.page = "wallets";

      web3t.refresh(function(err, data){
          balancesSpinner.finish();

          if (err) {
            store.current.page = "error";
            store.current.error = err + "";
          }

      });
    }, 1);
  };

  const loginSlow = () => {
    const web3tInitSpinner = new Spinner(
      store,
      lang.walletDecrypting,
      {displayDescription: true}
    );

    setTimeout(() => {
      web3t.init(function(err, data) {
        if (err) {
          return showToast(err + "");
        }

        store.current.page = "wallets";
        web3tInitSpinner.finish();
        const balancesSpinner = new Spinner(
          store,
          lang.loadingBalance,
          {displayDescription: "true"}
        );
        debugger;
        web3t.refresh(function(err, data){
            balancesSpinner.finish();

            if (err) {
              store.current.page = "error";
              store.current.error = err + "";
            }

        });
      });
    }, 1);
  };

  const buttonActive = store => {
    const login = async () => {

      const checkSpinner = new Spinner(
        store,
        lang.checkingPin
      );
      setTimeout(() => {
        if (!check(store.current.pin)) {
          checkSpinner.finish();
          store.current.pin = "";
          return showToast("Incorrect pin");
        }

        store.current.pin = "";
        store.userWallet = 200;
        store.current.seed = get();
        checkSpinner.finish();


        //in case when we already have built objects we can just show it
        if(store.current.account.wallets && store.current.account.wallets.length > 0) {
          loginQuick();
          return;
        }
        loginSlow();
      }, 1);
    };
    const loginText = lang.login;
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={loginText}
        textStyle={{ fontSize: 14 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={login}
      />
    );
  };

  const buttonInactive = store => {
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={lang.login}
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
