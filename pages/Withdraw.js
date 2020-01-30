import React from "react";
import {
  Left,
  Right,
  Text,
  Button,
  View,
  Icon,
  Item,
  Input,
  Title,
  Body,
  Header,
  Thumbnail
} from "native-base";
import styles from "../Styles.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import Toast from "@rimiti/react-native-toastify";
import GradientButton from "react-native-gradient-buttons";
import RefreshControl from "../components/RefreshControl.js";
import sendFuncs from '../wallet/send-funcs.js'

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};

const btnWithdrawBtc = ({ store, web3t }) => {

  const { token, feeToken, network, send, wallet, pending, recipientChange, amountChange, amountUsdChange, amountEurChange, useMaxAmount, showData, showLabel, topup, history, cancel, sendAnyway, chooseAuto, chooseCheap, chosenAuto, chosenCheap, getAddressLink, getAddressTitle, round5edit, round5, sendOptions, sendTitle, isData, encodeDecode, changeAmount, invoice } = sendFuncs(store, web3t);
    

  const withdrawBtc = async () => {
    
      sendAnyway();
    
  };

  return (
      <GradientButton
        style={styles.gradientBtn2}
        text="Continue"
        textStyle={{ fontSize: 18 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={56}
        width={"100%"}
        radius={10}
        
        
        onPressAction={withdrawBtc}
      />
  );
};

const buttonInactive = ({ store }) => {
  return (
    <GradientButton
      style={styles.gradientBtn2}
      text="Continue"
      textStyle={{ fontSize: 18 }}
      gradientBegin="#DDB5FF"
      gradientEnd="#DDB5FF"
      gradientDirection="diagonal"
      height={56}
      width={"100%"}
      radius={10}
      
      
    />
  );
};

const wrap = (text) => {
    return {
      target: {
        value: text
      }
    }
}

export default ({ store, web3t }) => {

  const { token, feeToken, network, send, pending, recipientChange, amountChange, amountUsdChange, amountEurChange, useMaxAmount, showData, showLabel, topup, history, cancel, sendAnyway, chooseAuto, chooseCheap, chosenAuto, chosenCheap, getAddressLink, getAddressTitle, round5edit, round5, sendOptions, sendTitle, isData, encodeDecode, changeAmount, invoice } = sendFuncs(store, web3t);
  

  const wallet = store.current.wallet;
  const changePage = (tab) => () => {
    store.current.page = tab;
    //store.withdrawFieldBtc = null;
    //store.withdrawAddrFieldBtc = null;
  };
  //const handleChangeWithdraw = async text => {
  //  store.withdrawFieldBtc = text;
  //};
  

  const inputAmountWithdraw = store => {
    return (
      <Item regular style={styles.borderItemInput}>
        <Input
          onChangeText={text => amountChange(wrap(text) )}
          returnKeyType="done"
          style={styles.inputStyle}
          placeholder="0"
          keyboardType="default"
          placeholderTextColor="rgba(255,255,255,0.50)"
          selectionColor={"rgba(255,255,255,0.60)"}
        />
      </Item>
    );
  };

  //const handleChangeWithdrawAddr = async text => {
  //  store.withdrawAddrFieldBtc = text;
  //};

  const inputAddressWithdrawBtc = store => {
    return (
      <Item regular style={styles.borderItemInput}>
        <Input
          onChangeText={text => recipientChange(wrap(text))}
          returnKeyType="done"
          placeholder={wallet.network.mask}
          style={[styles.inputStyle, { fontSize: 18 }]}
          keyboardType={"default"}
          placeholderTextColor="rgba(255,255,255,0.50)"
          selectionColor={"rgba(255,255,255,0.60)"}
        />
      </Item>
    );
  };

  //const buttonChangeWithdrawBtc =
  //  store.withdrawFieldBtc && store.withdrawAddrFieldBtc
  //    ? btnWithdrawBtc
  //    : buttonInactive;
  const buttonChangeWithdrawBtc = btnWithdrawBtc;

  const refreshToken = async bool => {
    
    web3t.refresh((err, data) => {

    });

  };
  return (
    <View style={styles.viewFlex}>
      <StandardLinearGradient>
        <Toast
          ref={c => (this.toastify = c)}
          position={"top"}
          style={styles.toastStyle}
        />

        <Header style={styles.mtAndroid}>
          <Left style={styles.viewFlex}>
            <Button
              transparent
              style={styles.arrowHeaderLeft}
              onPress={changePage("wallet", true)}
            >
              <Icon name="ios-arrow-back" style={styles.arrowHeaderIconBlack} />
            </Button>
          </Left>
          <Body style={styles.viewFlex}>
            <Title style={styles.titleBlack}>Send</Title>
          </Body>
          <Right style={styles.viewFlex}>
            <Thumbnail small source={{uri: wallet.coin.image}} />
          </Right>
        </Header>
        <RefreshControl swipeRefresh={refreshToken}>
          <View style={styles.bodyBlock}>
            <View>
              <View style={styles.bodyBalance}>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.nameTokenSwiper1}>Total Balance</Text>
                </View>
                <View style={styles.bodyBlock3}>
                  <Text style={styles.totalBalance}>
                    {wallet.balance}{" "}
                    <Text style={styles.nameToken}>
                      {wallet.coin.token}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.viewMt}>
                <View>
                  <Text style={styles.titleHeader}>Amount:</Text>
                </View>
                {inputAmountWithdraw(store)}
                <View style={styles.viewTextInputDown}>
                  <Text note style={styles.textInputDownRight}>
                    Fee {store.current.send.amountSendFee} {wallet.coin.token}
                  </Text>
                </View>
              </View>
              <View style={styles.viewMt}>
                <View>
                  <Text style={styles.titleHeader}>
                    Enter the number of {wallet.coin.token} wallet:
                  </Text>
                </View>
                {inputAddressWithdrawBtc(store)}
              </View>
            </View>
          </View>
        </RefreshControl>
      </StandardLinearGradient>
      <View style={styles.viewMonoBuy}>
        <View style={styles.containerScreen}>
          <View style={styles.marginBtn}>
            {buttonChangeWithdrawBtc({ store, web3t })}
            <Text>{store.current.send.error}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
