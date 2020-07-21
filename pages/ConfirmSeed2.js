import React from "react";
import {
  Image,
  ImageBackground,
} from "react-native";
import GradientButton from "../components/GradientButton.js";
import {
  Text,
  Button,
  View,
  Icon,
  Item,
  Input,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Toast
} from "native-base";
import StatusBar from "../components/StatusBar.js";
import styles from "../Styles.js";
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import SeedWord from "../components/SeedWord.js";


const DEV_SKIP = "...";

export default ({ store, web3t }) => {
  const lang = getLang(store);


  const number = store.current.seedIndexes[store.current.seedIndex];
  const placeholderConfirmSeed = lang.placeholderConfirmSeed + " " +  "#" + (number + 1);
  const verifyWordOrSetup = () => {

    if(store.signUpConfirmSeedField != DEV_SKIP) {

      const expectedWord = store.current.seed.split(" ")[number];

      if (expectedWord !== store.signUpConfirmSeedField) {
        return Toast.show({text: lang.inconsistency});
      }

      if (store.current.seedIndex < 23) {
        store.signUpConfirmSeedField = "";
        store.current.seedIndex += 1;
        return;
      }

    }


    store.signUpConfirmSeedField = "";
    store.current.page = "terms";
  };


  const handleConfirmSeedField = async text => {
    store.signUpConfirmSeedField = text;
  };
  const back = ()=> {

    if (store.current.seedIndex > 0) {
      store.signUpConfirmSeedField = "";
      store.current.seedIndex -= 1;
      return;
    }

    store.current.page = "generatedseed";
  }

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true}/>
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader}>
            <BackButton onBack={back}/>
          </Left>
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image
            source={Images.confirmation}
            style={styles.setupConfirmImg}
          />
          <Text style={styles.textH1Seed}>{lang.confirmation}</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
              {/*
                <View style={styles.bodyConfirm}>
                  <Item style={styles.borderItem}>
                    <Icon active name='key' style={{color: "#fff"}}/>
                    <Input
                      autoFocus
                      value={store.signUpConfirmSeedField}
                      onChangeText={text => handleConfirmSeedField(text)}
                      autoCapitalize="none"
                      secureTextEntry={false}
                      returnKeyType="done"
                      placeholder={placeholderConfirmSeed}
                      placeholderTextColor="rgba(255,255,255,0.60)"
                      style={styles.inputSize}
                      selectionColor={"#fff"}
                      keyboardAppearance="dark"
                    />
                  </Item>
                </View>
                */}
                {SeedWord(store, handleConfirmSeedField, number)}
                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text={lang.continue}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="100%"
                    radius={5}
                    onPressAction={verifyWordOrSetup}
                  />
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
