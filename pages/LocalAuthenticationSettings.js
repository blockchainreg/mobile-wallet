import React, {useState} from "react";
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  View,
  Title,
  Icon,
  Content,
  Header
} from "native-base";
import styles from "../Styles.js";
import { ScrollView, StatusBar, Image, ImageBackground, runAfterInteractions } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import Toast from "@rimiti/react-native-toastify";
import * as SecureStore from 'expo-secure-store';
import GradientButton from "react-native-gradient-buttons";
import Images from '../Images.js';

const LocalAuthSettingsPage = ({ store, web3t }) => {
  const [hasKey, setHasKey] = useState(null);
  const [toastify, setToastify] = useState(null);
  const showToast = message => {
    console.log('Trying to show toast', message);
    toastify && toastify.show(message, 3000);
  };

  const disable = async () => {
    await SecureStore.deleteItemAsync("localAuthToken");
    showToast("Local Authentication disabled");
    store.current.page = "settings";
  };

  const enable = () => {
    store.current.page = "LocalAuthenticationEnable";
  };

  if (hasKey === null) {
    SecureStore.getItemAsync("localAuthToken").then((token) => {
      setHasKey(token !== null);
    });
  }
  if (hasKey) {
    return (
      <>
        <Toast
          ref={setToastify}
          position="top"
          style={styles.toastStyle}
        />
        <GradientButton
          style={styles.gradientBtnPhMargin}
          text={"Disable Local Authentication"}
          textStyle={{ fontSize: 14 }}
          gradientBegin="#9d41eb"
          gradientEnd="#9d41eb"
          gradientDirection="diagonal"
          height={50}
          width="100%"
          radius={10}
          onPressAction={disable}
        />
      </>
    );
  }
  return (
    <>
      <Toast
        ref={setToastify}
        position="top"
        style={styles.toastStyle}
      />
      <GradientButton
        style={styles.gradientBtnPhMargin}
        text={"Enable Local Authentication"}
        textStyle={{ fontSize: 14 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={enable}
      />
    </>
  );
};

export default ({ store, web3t }) => (
  <View style={styles.viewFlex}>
    <ImageBackground
      source={Images.backgroundImage}
      style={styles.introBackground}
    >
    <StatusBar />
    <Header style={styles.mtAndroid}>
      <Left style={styles.viewFlex}>
        <Button
          transparent
          style={styles.arrowHeaderLeft}
          onPress={() => {store.current.page = "settings";}}
        >
          <Icon
            name="ios-arrow-back"
            style={styles.arrowHeaderIconBlack}
          />
        </Button>
      </Left>
      <Body style={styles.viewFlex}>
        <Title style={styles.titleBlack}>
          Fingerprints
        </Title>
      </Body>
      <Right style={styles.viewFlex}/>
    </Header>
      <StatusBar barStyle="light-content" />
      <View style={styles.containerFlexStart}>
        <Image
          source={Images.logo}
          style={styles.styleLogo}
        />
      <LocalAuthSettingsPage store={store} web3t={web3t}/>
      </View>
    </ImageBackground>
  </View>
);
