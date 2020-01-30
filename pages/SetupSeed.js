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
  Container,
  Content,
  Item,
  Input,
  Card,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Form,
  Textarea
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import SaveSeedModal from "../components/SaveSeedModal.js";
import { generateMnemonic } from "bip39";

// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const badSeed = (seed) => {
  blocks = (seed || "").split(' ')
  return blocks.length < 10;
}

export default ({ store }) => {
  const changePage = (tab) => () => {
    
    if (badSeed(store.current.seed))
      return;

    store.current.page = tab;
  };

  const generateRandom = async () => {
    store.current.seed = generateMnemonic();
  };

  const seedBlocks = store => {
    return (
      <Text style={{ color: "#fff" }}>
        {store.current.seed}
      </Text>
    );
  };

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <ImageBackground
        source={require("../assets/intro-bg.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex} />
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <View style={styles.containerFlexStart}>
          <Image
            source={require("../assets/velas-logo.png")}
            style={styles.styleLogo}
          />
          <Text style={styles.textH1Seed}>New Seed Phrase!</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    width: "100%",
                    borderColor: "#fff",
                    marginTop: 20
                  }}
                >
                  <View style={{ padding: 10 }}>{seedBlocks(store)}</View>
                </View>

                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text="Generate"
                    textStyle={{ fontSize: 14 }}
                    gradientBegin="#9d41eb"
                    gradientEnd="#9d41eb"
                    gradientDirection="diagonal"
                    height={50}
                    width={"100%"}
                    radius={10}
                    onPressAction={generateRandom}
                  />
                  <Text style={styles.textCard}>
                    Do not pass the phrase to a third party and keep it in a
                    safe place
                  </Text>
                </View>
              </Body>
            </CardItem>
          </View>
          {/* {SaveSeedModal({ store })} */}
          <TouchableOpacity onPress={changePage("confirmseed")}>
            <Text style={styles.textLoginStyle}>Continue</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ImageBackground>
    </View>
  );
};
