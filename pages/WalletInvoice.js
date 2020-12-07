import React from "react";
import {
  Header,
  Left,
  Body,
  Right,
  Text,
  Button,
  Title,
  Icon,
  Thumbnail
} from "native-base";
import { Clipboard, Alert, Vibration, Share, View } from "react-native";
import styles from "../Styles.js";

import GradientButton from "../components/GradientButton.js";
import RefreshControl from "../components/RefreshControl.js";
// import { QRCode } from 'react-native-custom-qr-codes-expo';
// import QRCode from 'react-native-qrcode';
import QRCode from 'react-native-qrcode-svg';
import walletsFuncs from '../wallet/wallets-funcs.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default ({ store, web3t }) => {
  const lang = getLang(store);
  const buttonCopy = store => {
    const DURATION = 1000/10;
    const writeToClipboardAddr = async () => {
      await Clipboard.setString(wallet.address);
      Vibration.vibrate(DURATION);
      Alert.alert(lang.copied, "", [{ text: lang.ok }]);
    };
    return (
      // <GradientButton
      //   style={styles.gradientBtn2}
      //   text={lang.copy}
      //   textStyle={{ fontSize: 14, fontFamily: "Fontfabric-NexaRegular"  }}
      //   gradientBegin="#9d41eb"
      //   gradientEnd="#9d41eb"
      //   gradientDirection="diagonal"
      //   height={45}
      //   width={"100%"}
      //   radius={0}
      //   onPressAction={writeToClipboardAddr}
      // />
      <Button block style={styles.btnVelasCopy} onPress={writeToClipboardAddr}>
      <Text style={[styles.textBtn, {color: "#fff"}]}>{lang.copy}</Text>
    </Button>
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
      // <GradientButton
      //   style={styles.gradientBtn2}
      //   text={lang.share}
      //   textStyle={{ fontSize: 14, fontFamily: "Fontfabric-NexaRegular" }}
      //   gradientBegin="#3CD5AF"
      //   gradientEnd="#3CD5AF"
      //   gradientDirection="diagonal"
      //   height={45}
      //   width={"100%"}
      //   radius={0}
      //   onPressAction={onShare}
      // />
      <Button block style={styles.btnVelasShare} onPress={onShare}>
      <Text style={[styles.textBtn, {color: "#000"}]}>{lang.share}</Text>
    </Button>
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
  const back = changePage("wallet");
  return (
    <View style={styles.viewFlex}>
        <Background fullscreen={true}/>
        <Header transparent style={styles.mtAndroid}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={back} style={styles.arrowHeaderIconBlack}/>
          </Left>
          <Body style={styles.viewFlexHeader}>
            <Title style={styles.titleBlack}>{lang.receive}</Title>
          </Body>
          <Right style={styles.viewFlexHeader}>
            <Thumbnail square small source={{ uri: wallet.coin.image }} />
          </Right>
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        {RefreshControl({swipeRefresh: refreshToken, store, children: <>
          <View style={styles.bodyBlock}>
            <View>
              <View style={styles.bodyBalance}>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.title1}>{lang.your} {(wallet.coin.nickname || wallet.coin.token).toUpperCase()} {lang.address}</Text>
                </View>
              </View>

              <View style={styles.viewMt}>
                <View style={styles.alignItemsQr}>
                  <QRCode
                    value={wallet.address}
                    color="#fff"
                    backgroundColor="transparent"
                    size={hp("30%")}
                  />
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
        </>})}
    </View>
  );
};
