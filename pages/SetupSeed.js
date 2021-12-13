import React from "react";
import {
  Image,
} from "react-native";
import {
  Text,
  Button,
  View,
  CardItem,
  Body,
} from "native-base";
import styles from "../Styles.js";
import { generateMnemonic } from "bip39";
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';
import Background from "../components/Background.js";
import Header from '../components/Header'
import { VelasLogo1 } from "../svg/velas-logo1.js";

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
    store.current.seed = generateMnemonic(256);
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
<Header onBack={changePage("register")}/>
        <View style={styles.containerFlexStart}>
          {/* <Image
            source={Images.logo}
            style={styles.styleLogo}
          /> */}
              <VelasLogo1 style={[styles.styleLogo, { alignSelf: "center" }]} width="72" height="63" viewBox="0 0 72 63"/>
          <View style={styles.card1}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.welcomeWallet}</Text>
            </View>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.marginBtn}>
                  <Button block style={styles.btnVelasCreate} onPress={generateRandom}>
                    <Text style={[styles.textBtn, {color: "#fff"}]}>{lang.newWallet}</Text>
                  </Button>
                  <View style={{ padding: 10 }}></View>
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
