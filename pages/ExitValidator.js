import React, { useState } from "react";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Text,
  Input,
  Item,
  Label,
} from "native-base";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import BackButton from "../components/BackButton.js";
import ButtonBlock from "../components/ButtonBlock.js";
import StatusBar from "../components/StatusBar.js";
import IdentIcon from "../components/Identicon.js";
import InputComponent from "../components/InputComponent";
import Notice from "../components/Notice";

var width = Dimensions.get("window").width;
const ADDRESS = "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK";

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  store.isRetryRequest = true; // change to false to show without notice message. This is a test demo to visualize.
 
  return (
    <Container>
      <StatusBar />
      <Header style={style.headerBg}>
        <Left>
          <BackButton
            onBack={changePage("detailsValidator")}
            style={style.leftBtn}
          />
        </Left>
        <Body>
          <Title style={style.headerTitle}>Exit Validator</Title>
        </Body>
        <Right>
          <IdentIcon
            address={ADDRESS}
            size={20}
            backgroundColor={"rgba(22, 26, 63, 1)"}
          />
        </Right>
      </Header>

      <View style={style.contentBg}>
        <View>
          <InputComponent
            title="Enter Amount"
            total_stake="51000"
            token="vlx"
          />
        </View>
        <View style={style.buttonBottom}>
        {store.isRetryRequest ? (
            <Notice
                text="You already have a withdrawal request. 
                This withdrawal  is going to be combined with the previous one."
                icon="warning"
              />

        ) : null}
          <ButtonBlock type={"WITHDRAW"} onPress={changePage("confirmExit")} />
        </View>
      </View>
    </Container>
  );
};

const style = StyleSheet.create({
  headerBg: {
    backgroundColor: Images.colorDarkBlue,
    borderBottomColor: "transparent",
  },
  contentBg: {
    backgroundColor: Images.velasColor4,
    justifyContent: "space-between",
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 20,
    fontWeight: "bold",
    width: width * 0.7,
  },
  leftBtn: {
    color: Images.colorGreen,
  },
  buttonBottom: {
    marginBottom: 60,
  },
});
