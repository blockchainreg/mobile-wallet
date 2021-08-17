import React, {useState} from "react";
import {
  Text,
  View,
  Item,
  Button,
  Icon,
  Toast,
} from "native-base";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard, Alert, Platform
} from "react-native";
import styles from "../Styles.js";
import {check} from "../wallet/pin.js";
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import * as SecureStore from 'expo-secure-store';
import Fingerprint from "../components/Fingerprint.js";
import * as LocalAuthentication from 'expo-local-authentication';
import Header from '../components/Header';
import Input from '../components/InputSecure';

function LocalAuthenticationEnable({store, web3t}) {
  const [status, setStatus] = useState("waiting");

  const changePage = tab => () => {
    store.current.page = tab;
  };
  const back = changePage("settings");

  switch(status) {
    case "unavailable":
      return (
      <>
      <Header onBack={back}/>
      <Text style={styles.textAuth}>Please register at least one Fingerprint or Face ID in the setting of your Smartphone to use this feature.</Text>
      </> )
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
        setTimeout(() => {store.current.page = "settings";}, 5000);
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
  const [pin, setPin] = useState("");

  // const lang = getLang(store);

  const buttonActive = store => {
    const lang = getLang(store);
    const login = () => {
      setTimeout(async () => {
        if (!check(pin)) {
          setPin("");
          return Toast.show({text: lang.incorrectPass ||  "Incorrect password"});
        }

        setPin("");
        await SecureStore.setItemAsync("localAuthToken", pin);
        store.current.auth.isLocalAuthEnabled = null;
        store.current.page = "settings";
        Alert.alert(
          Platform.OS === 'ios' ? "Touch ID / Face ID" : "Fingerprint ID",
          "Enabled successfully",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }, 1);
    };
    const loginText = lang.login;
    return (
      <Button block style={styles.btnVelasActive} onPress={login}>
        <Text style={styles.textBtn}>{capitalize(lang.confirm)}</Text>
      </Button>
    );
  };

  const buttonInactive = store => {
    return (
      <Button block style={styles.buttonInactive}>
      <Text style={styles.buttonTextInactive}>{capitalize(lang.confirm)}</Text>
    </Button>
    );
  };
  const lang = getLang(store);

  const checkpin = store => {
    // Validation start
    const regexPin = /[0-9a-zA-Z]{6,}/;
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
  const regexPin = /[0-9a-zA-Z]{6,}/;
  const validInputPin = (
    !pin ||
    regexPin.test(pin)
  );
  // Validation end

  // Input pin start

  const inputSuccessPin = store => {
    return (
      <Item style={styles.borderItem}>
        <Icon active name='lock' style={{color: "#fff"}}/>
        <Input
          value={pin}
          onChangeText={setPin}
          placeholder={lang.placeholderSignup}
        />
      </Item>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.container}
    >
      <ImageBackground source={Images.bg} style={styles.image}>
        {/* <Header transparent /> */}
      <StatusBar />
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.inner}>
            <View style={{ alignSelf: "center" }}>
          <Image
            source={Images.logo}
            style={[styles.styleLogo, { alignSelf: "center" }]}
          />
        
              <Text style={styles.textH1Seed}>{lang.yourPassword}</Text>
            </View>
            <View style={style.paddingBlock}>
            {inputSuccessPin(store)}
            {checkpin(store)}
            </View>
            </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 0.7,
    justifyContent: "center",
  },
  marginBtn: {
    alignItems: "center",
    width: "100%",
  },
  paddingBlock: {
    paddingHorizontal: 20, 
    paddingTop: 20
  }
});
function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default ({ store, web3t }) => <LocalAuthenticationEnable store={store} web3t={web3t} />;
