import React, {useState} from "react";
import {
  Text,
} from "native-base";
import {
  StyleSheet,
} from "react-native";
import styles from "../Styles.js";
import Fingerprint from "../components/Fingerprint.js";
import * as LocalAuthentication from 'expo-local-authentication';
import Header from '../components/Header';

function LocalAuthenticationDisable({store, web3t}) {
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
        onCancel={() => {store.current.page = "settings";}}
        onDisable
      />;
  }
}

export default ({ store, web3t }) => <LocalAuthenticationDisable store={store} web3t={web3t} />;
