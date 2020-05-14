import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import {
  Input,
  Item,
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

const showToast = message => {
  this.toastify.show(message, 3000);
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

    if(store.signUpConfirmSeedField == "") return;

    store.current.seedWords[number] = store.signUpConfirmSeedField;
    if(store.current.seedIndex < 23) {
      store.current.seedIndex += 1;
      store.signUpConfirmSeedField = "";
      return
    }
    store.current.seed = store.current.seedWords.join(' ')

    setupWallet(store, web3t);
  };
  const number = store.current.seedIndexes[store.current.seedIndex];
  const changeSeed = async word => {
    store.signUpConfirmSeedField = word;
  };

  const seedPhrase = store => {
    return (
      <View style={styles.bodyConfirm}>
        <Item regular style={styles.borderItemSeed}>
          <Input
              autoFocus
              value={store.signUpConfirmSeedField}
              onChangeText={changeSeed}
              autoCapitalize="none"
              secureTextEntry={false}
              returnKeyType="done"
              placeholder={number + 1 + " word"}
              placeholderTextColor="rgba(255,255,255,0.60)"
              style={styles.inputSize}
              selectionColor={"#fff"}
              keyboardAppearance="dark"
            />
          </Item>
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
                    text={lang.continue}
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
