import React from "react";
import {
  Header,
  Left,
  Body,
  Right,
  Text,
  Button,
  View,
  Title,
  Icon,
  Thumbnail
} from "native-base";
import { Clipboard, Alert, Vibration, Share } from "react-native";
import styles from "../Styles.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import Toast from "@rimiti/react-native-toastify";
import GradientButton from "react-native-gradient-buttons";
import RefreshControl from "../components/RefreshControl.js";
import { QRCode } from 'react-native-custom-qr-codes-expo';
import walletsFuncs from '../wallet/wallets-funcs.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};


export default ({ store, web3t }) => {
  const lang = getLang(store);
  const buttonCopy = store => {
    const DURATION = 10000;
    const writeToClipboardAddr = async () => {
      await Clipboard.setString(wallet.address);
      Vibration.vibrate(DURATION);
      Alert.alert(lang.copied, "", [{ text: lang.ok }]);
    };
    return (
      <GradientButton
        style={styles.gradientBtn2}
        text={lang.copy}
        textStyle={{ fontSize: 18 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={56}
        width={"100%"}
        radius={10}
        onPressAction={writeToClipboardAddr}
      />
    );
  };
  const buttonShare = store => {
    const onShare = async () => {
      try {
        const result = await Share.share({ message: wallet.address });
      } catch (error) {
        alert(error.message);
      }
    };
    return (
      <GradientButton
        style={styles.gradientBtn2}
        text={lang.share}
        textStyle={{ fontSize: 18 }}
        gradientBegin="#3CD5AF"
        gradientEnd="#3CD5AF"
        gradientDirection="diagonal"
        height={56}
        width={"100%"}
        radius={10}
        onPressAction={onShare}
      />
    );
  };

  const wallets = walletsFuncs(store, web3t).wallets;

  const wallet = wallets.find((x) => x.coin.token === store.current.wallet);


  //const wallet = store.current.wallet;
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const refreshToken = async bool => {
    if (bool === true) {
    }
  };
  return (
    <View style={styles.viewFlex}>
      <StandardLinearGradient>
        <Toast
          ref={c => (this.toastify = c)}
          position={"top"}
          style={styles.toastStyle}
        />

        <Header style={styles.mtAndroid}>
          <Left style={styles.viewFlex}>
            <Button
              transparent
              style={styles.arrowHeaderLeft}
              onPress={changePage("wallet")}
            >
              <Icon name="ios-arrow-back" style={styles.arrowHeaderIconBlack} />
            </Button>
          </Left>
          <Body style={styles.viewFlex}>
            <Title style={styles.titleBlack}>{lang.receive}</Title>
          </Body>
          <Right style={styles.viewFlex}>
            <Thumbnail square small source={{ uri: wallet.coin.image }} />
          </Right>
        </Header>
        <StatusBar />
        <RefreshControl swipeRefresh={refreshToken}>
          <View style={styles.bodyBlock}>
            <View>
              <View style={styles.bodyBalance}>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.title1}>{lang.your} {wallet.coin.token.toUpperCase()} {lang.address}</Text>
                </View>
              </View>

              <View style={styles.viewMt}>
                <View style={styles.alignItemsQr}>
                  {/* <Text style={styles.titleQr}>Scan the QR code:</Text> */}
                  <QRCode
                    color="#FFF"
                    content={wallet.address}
                  />
                  {/* <Text style={styles.titleQr}>Or click to copy:</Text> */}
                  <View style={styles.viewMt}>
                  <Text style={styles.textAddrQr}>
                    {wallet.address}
                  </Text>
                  </View>
                  {buttonCopy(store)}
                  {buttonShare(store)}
                </View>
              </View>
            </View>
          </View>
        </RefreshControl>
      </StandardLinearGradient>
    </View>
  );
};
