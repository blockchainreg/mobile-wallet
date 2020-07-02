import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

import walletsFuncs from "../wallet/wallets-funcs.js";
import walletFuncs from "../wallet/wallet-funcs.js";
import navigate from "../wallet/navigate.js";
import BackButton, {HiddenBackButton} from "../components/BackButton.js";

function Scanner({onScan}) {
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
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        setTimeout( () => {
          if (!onScanCalled) {
            onScan(false);
            setOnScanCalled(true);
          }
        }, 2000);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (!onScanCalled) {
      onScan(data);
      setOnScanCalled(true);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  const onBack = () => {
    if (!onScanCalled) {
      onScan(false);
      setOnScanCalled(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <BackButton
        onBack={onBack}
      />
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject, {top: 30}]}
      />
    </View>
  );
}


module.exports = ({ store, web3t }) => {

  const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = wallets.find((x) => x.coin.token === store.current.wallet);


  const onScan = (text) => {
      if (!text) {
        //Canceled or permission problems
        navigate(store, web3t, "wallet", x => {
        });
        return;
      }
          store.current.send.to = text;
          store.current.send.wallet = wallet;
          store.current.send.coin = wallet.coin;
          store.current.send.network = wallet.network;
          navigate(store, web3t, "send", x=> {

          });
  }
  return (<Scanner onScan={onScan} />);
}
