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
import { set } from "../wallet/seed.js";
import Markdown from "react-native-markdown-display";
import Images from "../Images.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import Background from "../components/Background.js";



const buttonAccept = store => {
  const changePage = tab => () => {
    if (!store.current.seed) {
      return;
    }
    set(store.current.seed);
    store.current.page = tab;
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
      <Background/>
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
                  {buttonAccept(store)}
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
