import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Vibration, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';

import walletsFuncs from '../wallet/wallets-funcs.js';
import walletFuncs from '../wallet/wallet-funcs.js';
import navigate from '../wallet/navigate.js';
import styles from '../Styles.js';
import { Text, View } from 'native-base';
import Images from '../Images.js';
import Header from '../components/Header';
import Constants from 'expo-constants';
import { CameraEn } from '../svg/cameraEn.js';
import { CameraDis } from '../svg/cameraDis.js';

function Scanner({ onScan }) {
  const [onScanCalled, setOnScanCalled] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(
    RNCamera.Constants.CameraStatus.PENDING_AUTHORIZATION
  );

  const handleCameraStatusChange = (event) => {
    setCameraStatus(event.cameraStatus);
  };

  const onBarCodeRead = (result) => {
    const { data } = result;
    Vibration.vibrate(Platform.OS === 'android' ? [0, 500, 200, 500] : 500);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (!onScanCalled) {
      onScan(data);
      setOnScanCalled(true);
    }
  };

  if (cameraStatus === RNCamera.Constants.CameraStatus.NOT_AUTHORIZED) {
    return (
      <View style={styles.viewFlex}>
        <View style={styles.imgScanCamera}>
          <CameraDis height={86 / 1.5} width={115 / 1.5} />
          <Text style={{ color: '#fff', textAlign: 'center', paddingTop: 20 }}>
            No access to camera, to use camera go to seettings and allow access
            to camera!
          </Text>
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
  const frame = () => {
    return (
      <>
        <Header onBack={onBack} transparent />
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused}>
            <View style={styles.focusedBorder1} />
            <View style={styles.focusedBorder2} />
            <View style={styles.focusedBorder3} />
            <View style={styles.focusedBorder4} />
          </View>
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </>
    );
  };
  return (
    <View style={styles.viewFlex}>
      <RNCamera
        autoFocus
        captureAudio={false}
        style={{ flex: 1 }}
        onBarCodeRead={onBarCodeRead}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onStatusChange={handleCameraStatusChange}
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
      navigate(store, web3t, store.current.returnPage || 'wallet', (x) => {});
      return;
    }
    store.current.send['to'] = text;
    store.current.send.amountSend = '';
    store.current.send.amountSendUsd = '0';
    store.current.send.amountSendFee = '0';
    store.current.send.amountSendFeeUsd = '0';
    store.current.send.error = '';
    store.current.send.wallet = wallet;
    store.current.send.coin = wallet.coin;
    store.current.send.network = wallet.network;
    navigate(store, web3t, 'send', (x) => {});
  };
  return <Scanner onScan={onScan} />;
};
