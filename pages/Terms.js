import React from "react";
import { Image, ImageBackground, ScrollView } from "react-native";
import {
  Text,
  Button,
  View,
  Item,
  Input,
  CardItem,
  Body,
  Header,
  Left,
  Right
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "../components/GradientButton.js";
import Hyperlink from "react-native-hyperlink";
import { set } from "../wallet/seed.js";
import Markdown from "react-native-markdown-display";
import Images from "../Images.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import Background from "../components/Background.js";
import Spinner from "../utils/spinner.js";
import setupWallet from '../setupWallet.js';

async function loadTerms(store) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  const spinner = new Spinner(store, "Loading terms");
  await loadTermsRecusion(store);
  spinner.finish();
}

async function loadTermsRecusion(store) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/askucher/expo-web3/dev/TERMS.md');
    store.current.termsMarkdown = await response.text();
  }catch(e) {
    console.error(e);
    setTimeout(loadTerms.bind(this, store), 1000);
  }
}

let loadTermsPromise = null;

const buttonAccept = (store, web3t) => {
  const accept = () => {
    if (!store.current.seed) {
      return;
    }
    set(store.current.seed);
    setupWallet(store, web3t);
  };
  const lang = getLang(store);
  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text={lang.accept}
      textStyle={{ fontSize: 14, color: Images.color1 }}
      gradientBegin="#fff"
      gradientEnd="#fff"
      gradientDirection="diagonal"
      height={45}
      width="100%"
      radius={5}
      onPressAction={accept}
    />
  );
};
const markdownStyle = {
  root: {
    color: "#FFFFFF"
  }
};

export default ({ store, web3t }) => {
  if (!loadTermsPromise) {
    loadTermsPromise = loadTerms(store);
  }
  if (!store.current.termsMarkdown) {
    return null;
  }
  const lang = getLang(store);
  const terms = store => {
    return (
      <View style={{ alignItems: "flex-start" }}>
        <Markdown style={markdownStyle}>
          {store.current.termsMarkdown || ""}
        </Markdown>
      </View>
    );
  };
  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader} />
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image source={Images.logo} style={styles.styleLogo} />
          <Text style={styles.textH1Seed}>{lang.termsOfUse}</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.bodyTerms}>
                  <ScrollView style={{ padding: 10 }}>
                    {terms(store)}
                  </ScrollView>
                </View>

                <Text style={{ fontSize: 14, color: "#fff", marginTop: 15 }}>
                  {lang.terms}
                </Text>

                <View style={[styles.marginBtn, { marginBottom: -40 }]}>
                  {buttonAccept(store, web3t)}
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
