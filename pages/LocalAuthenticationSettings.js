import React, { useState } from "react";
import {
  Left,
  Body,
  Right,
  Text,
  Button,
  View,
  Icon,
  Header,
  Item,
  Input
} from "native-base";
import styles from "../Styles.js";
import {
  ScrollView,
  StatusBar,
  Image,
  ImageBackground,
  runAfterInteractions,
  BackHandler
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import Toast from "@rimiti/react-native-toastify";
import * as SecureStore from "expo-secure-store";
import GradientButton from "react-native-gradient-buttons";
import Images from "../Images.js";
import getLang from "../wallet/get-lang.js";
import BackButton from "../components/BackButton.js";



const LocalAuthSettingsPage = ({ store, web3t }) => {
  const [hasKey, setHasKey] = useState(null);
  const [toastify, setToastify] = useState(null);
  const showToast = message => {
    console.log("Trying to show toast", message);
    toastify && toastify.show(message, 3000);
  };

  const disable = async () => {
    if (store.current.pin === store.current.pinSave) {
      await SecureStore.deleteItemAsync("localAuthToken");
      showToast("Local Authentication disabled");
      store.current.page = "settings";
    } else if (store.current.pin != store.current.pinSave) {
      showToast("Incorrect pin");
      store.current.pin = "";
    }
  };

  const enable = () => {
    if (store.current.pin === store.current.pinSave) {
      store.current.page = "LocalAuthenticationEnable";
      store.current.pin = "";
    } else if (store.current.pin != store.current.pinSave) {
      showToast("Incorrect pin");
      store.current.pin = "";
    }
  };

  if (hasKey === null) {
    SecureStore.getItemAsync("localAuthToken").then(token => {
      setHasKey(token !== null);
    });
  }
  if (hasKey) {
    return (
      <>
        <Toast ref={setToastify} position="top" style={styles.toastStyle1} />
        <GradientButton
          style={styles.gradientBtnPhMargin}
          text={"Disable Local Authentication"}
          textStyle={{ fontSize: 14 }}
          gradientBegin="#9d41eb"
          gradientEnd="#9d41eb"
          gradientDirection="diagonal"
          height={50}
          width="80%"
          radius={10}
          onPressAction={disable}
        />
      </>
    );
  }
  return (
    <>
      <Toast ref={setToastify} position="top" style={styles.toastStyle1} />
      <GradientButton
        style={styles.gradientBtnPhMargin}
        text={"Enable Local Authentication"}
        textStyle={{ fontSize: 14 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={50}
        width="80%"
        radius={10}
        onPressAction={enable}
      />
    </>
  );
};

export default ({ store, web3t }) => {
  const lang = getLang(store);
  const regexPin = /^\w{4}$/;
  const validInputPin = !store.current.pin || regexPin.test(store.current.pin);
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
          placeholder={"Pin"}
          keyboardType="numeric"
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={styles.inputSize}
          selectionColor={"#fff"}
          keyboardAppearance="dark"
        />
      </Item>
    );
  };

  const back = () => {
    store.current.page = "settings";
  };

  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={back}/>
          </Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <View style={[styles.widthCard, {marginTop: 60}]}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>Enter your PIN</Text>
            </View>
            {inputSuccessPin(store)}
            {!validInputPin && (
              <Text style={styles.error}>{lang.validPin}</Text>
            )}
            {/* {Unlock(store)} */}
            {/* <Unlock store={store} web3t={web3t}/> */}
          </View>
          <LocalAuthSettingsPage store={store} web3t={web3t} />
        </View>
      </ImageBackground>
    </View>
  );
};
