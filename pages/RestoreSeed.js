import React from "react";
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  BackHandler
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
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";
import bip39 from "bip39";
import Autocomplete from 'react-native-autocomplete-input';


// const generateMnemonic = () => {
//   return "one two three four five six";
// }

const showToast = message => {
  alert(message);
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

    if(store.signUpConfirmSeedField == "") return showToast("Empty word is not allowed");

    if (bip39.wordlists.EN.indexOf(store.signUpConfirmSeedField) === -1) {
      return showToast("You have mistake in your word");
    }

    store.current.seedWords[number] = store.signUpConfirmSeedField;
    if(store.current.seedIndex < store.current.seedWords.length - 1) {
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
    let autocompleteData = (
      !store.signUpConfirmSeedField || store.signUpConfirmSeedField.length < 2
      ? []
      : bip39.wordlists.EN.filter((word) => word.startsWith(store.signUpConfirmSeedField))
    );
    let inputStyle = styles.inputSize;
    if (store.signUpConfirmSeedField && store.signUpConfirmSeedField.length >= 2 && !autocompleteData.length) {
      inputStyle = styles.autocompleteInputIncorrect;
    } else if (bip39.wordlists.EN.indexOf(store.signUpConfirmSeedField) !== -1) {
      inputStyle = styles.autocompleteInputCorrect;
    }
    if (autocompleteData.length === 1 && autocompleteData[0] === store.signUpConfirmSeedField) {
      autocompleteData = [];
    }

    const input = (
      <View style={styles.bodyConfirm}>
        <Item style={styles.borderItem}>
          <Icon active name='key' style={{color: "#fff"}}/>
          <Input
          autoFocus
          autoCorrect={false}
          value={store.signUpConfirmSeedField}
          onChangeText={changeSeed}
          autoCapitalize="none"
          secureTextEntry={false}
          returnKeyType="done"
          placeholder={lang.placeholderConfirmSeed + " " +  "#" + (number + 1)}
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={inputStyle}
          selectionColor={"#fff"}
          keyboardAppearance="dark"
          />
          </Item>
      </View>
    );
    return (

      // <View style={styles.autocompleteContainer}>

      <Autocomplete
        data={autocompleteData}
        keyExtractor={item => item}
        containerStyle={styles.autocompleteContainerStyle}
        inputContainerStyle={styles.autocompleteInputContainerStyle}
        listStyle={styles.autocompleteListStyle}
        renderTextInput={props => input}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => changeSeed(item)} key={item}>
            <Text style={styles.autocompleteListItemStyle}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      // </View>


    );
  };

  const lang = getLang(store);
  const back = changePage("newseed");

  return (
    <View style={styles.viewFlex}>
      {/* <View style={styles.viewLogin}> */}
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
          <Image source={Images.generate} style={[styles.setupImg, {marginBottom: 0}]} />
          <Text style={styles.textH1Seed}>{lang.restoreSeed}</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                {seedPhrase(store)}
                <View style={styles.marginBtn}>
                  <GradientButton
                    style={styles.gradientBtnPh}
                    text={lang.continue}
                    textStyle={{ fontSize: 14, color: Images.color1 }}
                    gradientBegin="#fff"
                    gradientEnd="#fff"
                    gradientDirection="diagonal"
                    height={45}
                    width="98%"
                    radius={5}
                    onPressAction={done}
                  />
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
    </View>
  );
};
