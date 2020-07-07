import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Vibration, Platform } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";

import walletsFuncs from "../wallet/wallets-funcs.js";
import walletFuncs from "../wallet/wallet-funcs.js";
import navigate from "../wallet/navigate.js";
import BackButton, { HiddenBackButton } from "../components/BackButton.js";
import styles from "../Styles.js";
import StatusBar from "../components/StatusBar.js";
import {
  Content,
  ListItem,
  Left,
  Body,
  Right,
  Text,
  View,
  Title,
  Icon,
  Header,
  Separator,
  Button,
} from "native-base";
import Images from '../Images.js';


function Scanner({ onScan }) {
  

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [onScanCalled, setOnScanCalled] = useState(false);

  useEffect(() => {
    (async () => {
      //console.log("BarCodeScanner", BarCodeScanner.requestPermissionsAsync);
      // This will work on expo 38
      // const { status } = await BarCodeScanner.requestPermissionsAsync();
      // And this work on expo 35
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === "granted");
      if (status !== "granted") {
        setTimeout(() => {
          if (!onScanCalled) {
            onScan(false);
            setOnScanCalled(true);
          }
        }, 2000);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    Vibration.vibrate( Platform.OS === "android" ? [0, 500, 200, 500] : 500);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (!onScanCalled) {
      onScan(data);
      setOnScanCalled(true);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.viewFlex}>
      <View style={styles.imgScanCamera}>
        <Image
        source={Images.cameraEn}
        style={styles.styleLogoCamera}
        />
        <Text style={{ color: "#fff", textAlign: "center", paddingTop: 20}}>Requesting for camera permission</Text>
      </View>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.viewFlex}>
      <View style={styles.imgScanCamera}>
        <Image
        source={Images.cameraDis}
        style={styles.styleLogoCamera}
        />
        <Text style={{ color: "#fff", textAlign: "center", paddingTop: 20}}>No access to camera</Text>
      </View>
      </View>
    );
  }

  const onBack = () => {
    if (!onScanCalled) {
      onScan(false);
      setOnScanCalled(true);
    }
  };

  return (
    <View style={styles.viewFlex}>
      {/* <StatusBar translucent={true} backgroundColor={"transparent"} />
      <Header transparent style={styles.mtAndroid}>
        <Left style={styles.viewFlexHeader}>
          <BackButton onBack={onBack} />
        </Left>
        <Body style={styles.viewFlexHeader} />
        <Right style={styles.viewFlexHeader} />
      </Header> */}

      {/* <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        // style={[
        //   StyleSheet.absoluteFillObject,
        //   { top: "15%", bottom: "15%", width: "100%" },
        // ]}
        style={styles.barCode}
      /> */}
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.containerBarCode]}
      >
        <Header transparent style={[styles.mtAndroid, {backgroundColor: "transparent", borderBottomColor: "transparent"}]}>
        <Left style={styles.viewFlexHeader}>
          <BackButton onBack={onBack} />
        </Left>
        <Body style={styles.viewFlexHeader} />
        <Right style={styles.viewFlexHeader} />
      </Header>
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused}>
            <View style={styles.focusedBorder1}/>
            <View style={styles.focusedBorder2}/>
            <View style={styles.focusedBorder3}/>
            <View style={styles.focusedBorder4}/>
          </View>
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </BarCodeScanner>
    </View>
  );
}

module.exports = ({ store, web3t }) => {
  const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = wallets.find((x) => x.coin.token === store.current.wallet);

  const onScan = (text) => {
    if (!text) {
      //Canceled or permission problems
      navigate(store, web3t, store.current.returnPage || "wallet", (x) => {});
      return;
    }
    store.current.send.to = text;
    store.current.send.wallet = wallet;
    store.current.send.coin = wallet.coin;
    store.current.send.network = wallet.network;
    navigate(store, web3t, "send", (x) => {});
  };
  return <Scanner onScan={onScan} />;
};
