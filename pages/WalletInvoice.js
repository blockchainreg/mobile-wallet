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
import { Clipboard, Alert, Vibration, Image } from "react-native";
import styles from "../Styles.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import Toast from "@rimiti/react-native-toastify";
import GradientButton from "react-native-gradient-buttons";
import RefreshControl from "../components/RefreshControl.js";
import { QRCode } from 'react-native-custom-qr-codes-expo';

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};

const buttonCopy = store => {
  const DURATION = 10000;
  const writeToClipboardAddr = async () => {
    await Clipboard.setString(store.current.wallet.address);
    Vibration.vibrate(DURATION);
    Alert.alert("Copied to clipboard", "", [{ text: "OK" }]);
  };
  return (
    <GradientButton
      style={styles.gradientBtn2}
      text="Copy"
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

export default ({ store }) => {
  const wallet = store.current.wallet;
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
            <Title style={styles.titleBlack}>Receive</Title>
          </Body>
          <Right style={styles.viewFlex}>
            <Thumbnail small source={require("../assets/btc-ethnamed.png")} />
          </Right>
        </Header>
        <RefreshControl swipeRefresh={refreshToken}>
          <View style={styles.bodyBlock}>
            <View>
              <View style={styles.bodyBalance}>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.nameTokenSwiper1}>Total Balance</Text>
                </View>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.totalBalance}>
                    {wallet.balance}{" "}
                    <Text style={styles.nameToken}>
                      {wallet.coin.token}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.viewMt}>
                <View style={styles.alignItemsQr}>
                  <Text style={styles.titleQr}>Scan the QR code:</Text>
                  <QRCode
                    color="#FFF"
                    content={wallet.address}
                  />
                  <Text style={styles.titleQr}>Or click to copy:</Text>

                  <Text style={styles.textAddrQr}>
                    {wallet.address}
                  </Text>
                  {buttonCopy(store)}
                </View>
              </View>
            </View>
          </View>
        </RefreshControl>
      </StandardLinearGradient>
    </View>
  );
};
