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
  BackHandler,
  Alert,
  Toast
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import GradientButton from "../components/GradientButton.js";
import Images from "../Images.js";
import getLang from "../wallet/get-lang.js";
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";



export default ({ store, web3t }) => {
  const lang = getLang(store);
  SecureStore.getItemAsync("localAuthToken").then(pin => {
    if (pin) {
      store.current.page = "LocalAuthenticationDisable";
    } else {
      store.current.page = "LocalAuthenticationEnable";
    }
  });

  return null;

};
