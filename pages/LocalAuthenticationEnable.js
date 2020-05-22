import React, {useState} from "react";
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
import {check} from "../wallet/pin.js";
import Spinner from "../utils/spinner.js";
//import navigate from '../wallet/navigate.js';
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import * as SecureStore from 'expo-secure-store';
import Fingerprint from "../components/Fingerprint.js";
import * as LocalAuthentication from 'expo-local-authentication';

function LocalAuthenticationEnable({store, web3t}) {
  const [status, setStatus] = useState("waiting");
  switch(status) {
    case "unavailable":
      return <Text>Please register at least one Fingerprint or Face ID in the setting of your Smartphone to use this feature.</Text>;
    case "waiting":
      Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        LocalAuthentication.isEnrolledAsync()
      ]).then(([hasHardware, supportedAuthTypes, isEnrolled]) => {
        if (hasHardware && isEnrolled && supportedAuthTypes.length > 0) {
          setStatus("localAuth");
          return;
        }
        setStatus("unavailable");
        setTimeout(() => {store.current.page = "settings";}, 3000);
      });
      return <Text>...</Text>;
    case "localAuth":
      return <Fingerprint
        onSuccess={() => {setStatus("checkPin");}}
        onCancel={() => {store.current.page = "settings";}}
      />;
    case "checkPin":
      return <RequestPin store={store} web3t={web3t} />;
  }
}

function RequestPin({store, web3t}) {
  let [toastify, setToastify] = useState(null);
  const showToast = message => {
    toastify && toastify.show(message, 3000);
  };
  const [pin, setPin] = useState("");

  const lang = getLang(store);

  const buttonActive = store => {
    const login = () => {
      setTimeout(async () => {
        if (!check(pin)) {
          setPin("");
          return showToast("Incorrect pin");
        }

        setPin("");
        await SecureStore.setItemAsync("localAuthToken", pin);
        store.current.page = "settings";
      }, 1);
    };
    const loginText = lang.login;
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={"Confirm Pin"}
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
        text={"Confirm Pin"}
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

  const checkpin = store => {
    // Validation start
    const regexPin = /^\w{4}$/;
    const validInputPin = (
      !pin ||
      regexPin.test(pin)
    );
    // Validation end

    return (<View style={styles.marginBtn}>
      {
      pin && validInputPin
      ? buttonActive(store)
      : buttonInactive(store)}
      <View height={15}></View>
    </View>);
  };

  // Validation start
  const regexPin = /^\w{4}$/;
  const validInputPin = (
    !pin ||
    regexPin.test(pin)
  );
  // Validation end

  // Input pin start

  const inputSuccessPin = store => {
    return (
      <Item regular style={styles.borderItem}>
        <Input
          onChangeText={setPin}
          value={pin}
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
          ref={setToastify}
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
              <Text style={styles.textH1Seed}>Confirm your pin</Text>
            </View>
            {inputSuccessPin(store)}
            {!validInputPin && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )}
            {checkpin(store)}
          </View>
        </View>
      </ImageBackground>
      </View>
  );
};

export default ({ store, web3t }) => <LocalAuthenticationEnable store={store} web3t={web3t} />;
