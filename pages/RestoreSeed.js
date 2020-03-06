import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import {
  Text,
  Button,
  View,
  Icon,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Textarea
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import Images from "../Images.js";
import setupWallet from "../setupWallet.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";

// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const badSeed = seed => {
  blocks = (seed || "").split(" ");
  return blocks.length < 10;
};

const seedContainerStyle = {
  borderWidth: 1,
  borderRadius: 5,
  width: "100%",
  borderColor: "#fff",
  marginTop: 20,
  padding: 10
};

export default ({ store, web3t }) => {
  const changePage = tab => () => {
    store.current.page = tab;
  };

  const done = () => {
    if (badSeed(store.current.seed)) return;

    setupWallet(store, web3t);
  };

  const changeSeed = async seed => {
    store.current.seed = seed;
  };

  const seedPhrase = store => {
    return (
      <View style={seedContainerStyle}>
        <Textarea
          rowSpan={2}
          placeholder={lang.placeholderSeed}
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={styles.placeholderSeedInput}
          selectionColor={"#fff"}
          autoCapitalize="none"
          value={store.current.seed}
          onChangeText={changeSeed}
        />
      </View>
    );
  };

  const lang = getLang(store);

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex}>
            <Button
              transparent
              style={styles.arrowHeaderLeft}
              onPress={changePage("newseed")}
            >
              <Icon
                name="ios-arrow-back"
                style={[styles.arrowHeaderIconBlack, { color: "#fff" }]}
              />
            </Button>
          </Left>
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <Image source={Images.logo} style={styles.styleLogo} />
          <Text style={styles.textH1Seed}>{lang.restoreSeed}</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                {seedPhrase(store)}
                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text="Restore"
                    textStyle={{ fontSize: 14 }}
                    gradientBegin="#9d41eb"
                    gradientEnd="#9d41eb"
                    gradientDirection="diagonal"
                    height={50}
                    width={"100%"}
                    radius={10}
                    onPressAction={done}
                  />
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
