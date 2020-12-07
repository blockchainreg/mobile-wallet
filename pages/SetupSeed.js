import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
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
import GradientButton from "../components/GradientButton.js";
import SaveSeedModal from "../components/SaveSeedModal.js";
import { generateMnemonic } from "bip39";
import Images from '../Images.js';
import StatusBar from "../components/StatusBar.js";
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";

// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const seedContainerStyle = {
  borderWidth: 1,
  borderRadius: 5,
  width: "100%",
  borderColor: "#fff",
  marginTop: 20,
  padding: 10
};


export default ({ store }) => {
  const changePage = tab => () => {
    store.current.page = tab;
  };

  const generateRandom = async () => {
    store.current.seed = generateMnemonic() + ' ' + generateMnemonic();
    localStorage.setItem("is-demo-mode", "yes");
    store.current.page = "terms";
    //store.curren.newseedstep = "ganarate";
    //
    //send to text address VLV8jDEudTEF6m3JGkjPAXrGWnHzwYHETsE - it is index 0 address of test mnemonic phrase
  };

  const restoreSeed = async () => {
    localStorage.setItem("is-demo-mode", "");
    store.current.page = "restoreseedchoise";
  }

  const changeSeed = async (seed) => {
    store.current.seed = seed;
  }

  const lang = getLang(store);

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
      <Background fullscreen={true}/>
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={changePage("register")}/>
          </Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.logo}
            style={styles.styleLogo}
          />
          <View style={styles.card1}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.welcomeWallet}</Text>
            </View>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.marginBtn}>
                {/* <GradientButton
                    style={styles.viewMt}
                    text={lang.newWallet}
                    textStyle={{ fontSize: 14, color: "#fff" }}
                    gradientBegin="#0bffb7"
                    gradientEnd="#0bffb7"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={0}
                    onPressAction={generateRandom}
                  /> */}
                  <Button block style={styles.btnVelasCreate} onPress={generateRandom}>
                    <Text style={[styles.textBtn, {color: "#fff"}]}>{lang.newWallet}</Text>
                  </Button>
                  <View style={{ padding: 10 }}></View>
                  {/* <GradientButton
                    style={styles.viewMt}
                    text={lang.restoreSeed}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={0}
                    onPressAction={restoreSeed}
                  /> */}
                  <Button block style={styles.btnVelasRestore} onPress={restoreSeed}>
                    <Text style={styles.textBtn}>{lang.restoreSeed}</Text>
                  </Button>

                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
