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
import GradientButton from "react-native-gradient-buttons";
import Hyperlink from "react-native-hyperlink";
import {set} from "../wallet/seed.js";
import Markdown from 'react-native-markdown-display';
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";

const buttonAccept = store => {
  const changePage = (tab) => () => {
    if (!store.current.seed) {
      return;
    }
    set(store.current.seed);
    store.current.page = tab;
    store.current.loading = false;
  };
  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text="Accept"
      textStyle={{ fontSize: 14 }}
      gradientBegin="#9d41eb"
      gradientEnd="#9d41eb"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={10}
      onPressAction={changePage("wallets", true)}
    />
  );
};
const markdownStyle = {
  root: {
    color: "#FFFFFF"
  }
};


export default ({ store }) => {
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
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex} />
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <StatusBar barStyle="light-content" />
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <Text style={styles.textH1Seed}>Terms of Use</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.bodyTerms}>
                  <ScrollView style={{ padding: 10 }}>
                    {terms(store)}
                  </ScrollView>
                </View>

                <Text style={{ fontSize: 14, color: "#fff", marginTop: 15 }}>
                  By clicking the button you accept the terms of use
                </Text>

                <View style={styles.marginBtn}>{buttonAccept(store)}</View>
              </Body>
            </CardItem>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
