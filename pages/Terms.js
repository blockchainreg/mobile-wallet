import React from "react";
import { Image, ScrollView, Platform } from "react-native";
import {
  Text,
  Button,
  View,
  CardItem,
  Body,
} from "native-base";
import { ifIphoneX } from "react-native-iphone-x-helper";
import styles from "../Styles.js";
import { set } from "../wallet/seed.js";
import Markdown from "react-native-markdown-display";
import Images from "../Images.js";
import getLang from "../wallet/get-lang.js";
import Background from "../components/Background.js";
import Spinner from "../utils/spinner.js";
import setupWallet from '../setupWallet.js';
import Header from '../components/Header'

async function loadTerms(store) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  const lang = getLang(store);
  const spinner = new Spinner(store, lang.loadingTerms);
  await loadTermsRecusion(store);
  spinner.finish();
}

async function loadTermsRecusion(store) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/velas/mobile-wallet/master/TERMS.md');
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
    <Button block style={styles.btnVelasActive} onPress={accept}>
      <Text style={styles.textBtn}>{lang.accept}</Text>
    </Button>
  );
};
const markdownStyle = {
  ...ifIphoneX(
    { root: {
      color: "#FFFFFF",
      fontFamily: "Fontfabric-NexaRegular",
      lineHeight: 20,
    }},
    {
      ...Platform.select({
        ios: { root: {
          color: "#FFFFFF",
          fontFamily: "Fontfabric-NexaRegular",
          lineHeight: 20,
          fontSize: 10
        } },
        android: { root: {
          color: "#FFFFFF",
          fontFamily: "Fontfabric-NexaRegular",
          lineHeight: 20,
          fontSize: 10
        } },
      }),
    }
  ),
  
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
        <Header transparent/>
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

                <Text style={{ fontSize: 14, color: "#fff", marginTop: 15, fontFamily: "Fontfabric-NexaRegular" }}>
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
