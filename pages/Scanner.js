import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

import walletsFuncs from "../wallet/wallets-funcs.js";
import walletFuncs from "../wallet/wallet-funcs.js";
import navigate from "../wallet/navigate.js";

function Scanner({onScan}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      //console.log("BarCodeScanner", BarCodeScanner.requestPermissionsAsync);
      // This will work on expo 38
      // const { status } = await BarCodeScanner.requestPermissionsAsync();
      // And this work on expo 35
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    onScan(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}


module.exports = ({ store, web3t }) => {

  const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = wallets.find((x) => x.coin.token === store.current.wallet);


  const onScan = (text) => {
          store.current.send.to = text;
          store.current.send.wallet = wallet;
          store.current.send.coin = wallet.coin;
          store.current.send.network = wallet.network;
          navigate(store, web3t, "send", x=> {

          });
  }
  return (<Scanner onScan={onScan} />);
}
