import React, { useState } from "react";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  Content,
} from "native-base";
import Footer from "./Footer.js";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import BackButton from "../components/BackButton.js";
import DetailsValidatorComponent from "../components/DetailsValidatorComponent.js";
import TabsValidator from "../components/TabsBarValidator.js";
import { formatBalance } from "../utils/format-value.js";
import ButtonBlock from "../components/ButtonBlock.js";
import StatusBar from "../components/StatusBar.js";

var width = Dimensions.get("window").width;

export default ({ store, web3t, props }) => {
  
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);

  return (
    <Container>
      <StatusBar />
      <Header style={style.headerBg}>
        <Left>
          <BackButton onBack={changePage("stakePage")} style={style.leftBtn} />
        </Left>
        <Body>
          <Title style={style.headerTitle}>Validator Details</Title>
        </Body>
        <Right />
      </Header>

      <Content style={style.contentBg}>
        <TabsValidator store={store}/>
      </Content>
    </Container>
  );
};

const style = StyleSheet.create({
  headerBg: {
    backgroundColor: Images.colorDarkBlue,
    borderBottomColor: "transparent",
  },
  contentBg: {
    backgroundColor: Images.velasColor4
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
  titleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Fontfabric-NexaBold",
    // marginRight: 10
  },
});
