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

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};

const btnWithdrawBtc = store => {
  const withdrawBtc = async () => {
    const params = {
      currency: 'BTC',
      amount: store.withdrawFieldBtc,
      withdrawal_type: "GATEWAY",
      wallet_to: store.withdrawAddrFieldBtc
    };

    
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

const buttonInactive = store => {
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

export default ({ store }) => {

  const wallet = store.current.wallet;
  const changePage = (tab) => () => {
    store.current.page = tab;
    store.withdrawFieldBtc = null;
    store.withdrawAddrFieldBtc = null;
  };
  const handleChangeWithdraw = async text => {
    store.withdrawFieldBtc = text;
  };

  const inputAmountWithdraw = store => {
    return (
      <Item regular style={styles.borderItemInput}>
        <Input
          onChangeText={text => handleChangeWithdraw(text)}
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

  const handleChangeWithdrawAddr = async text => {
    store.withdrawAddrFieldBtc = text;
  };

  const inputAddressWithdrawBtc = store => {
    return (
      <Item regular style={styles.borderItemInput}>
        <Input
          onChangeText={text => handleChangeWithdrawAddr(text)}
          returnKeyType="done"
          placeholder="1F2tAdz5x1HUXrCNLbtMDqcw6o5GNn4xqX"
          style={[styles.inputStyle, { fontSize: 18 }]}
          keyboardType={"default"}
          placeholderTextColor="rgba(255,255,255,0.50)"
          selectionColor={"rgba(255,255,255,0.60)"}
        />
      </Item>
    );
  };

  const buttonChangeWithdrawBtc =
    store.withdrawFieldBtc && store.withdrawAddrFieldBtc
      ? btnWithdrawBtc
      : buttonInactive;
  const refreshToken = async bool => {
    if (bool === true) {
      const params = {
        email: store.settingsInputMailField,
        password: store.settingsInputPasswordField
      };

      

      console.log("userToken 😀", store.userToken);

      
    }
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
            <Title style={styles.titleBlack}>Withdraw</Title>
          </Body>
          <Right style={styles.viewFlex}>
            <Thumbnail small source={require("../assets/btc-ethnamed.png")} />
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
                    Commision 0.01 BTC
                    %
                  </Text>
                </View>
              </View>
              <View style={styles.viewMt}>
                <View>
                  <Text style={styles.titleHeader}>
                    Enter the number of Btc wallet:
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
          <View style={styles.marginBtn}>{buttonChangeWithdrawBtc(store)}</View>
        </View>
      </View>
    </View>
  );
};
