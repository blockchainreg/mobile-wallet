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
import {
  View,
  ScrollView,
  Clipboard,
  Alert,
  Vibration,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import BackButton from "../components/BackButton.js";
import StakeCard from "../components/StakeCard.js";
import Switch from "../components/Switch.js";
import { formatBalance } from "../utils/format-value";

var width = Dimensions.get("window").width;

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  const validators = [
    {
      id: 1,
      staked: "10000000",
      stakers: "101",
      mine: '30000',
    },
    {
      id: 2,
      staked: "400000",
      stakers: "201",
      mine: '50000',
    },
    {
      id: 3,
      staked: "11000000",
      stakers: "301",
      status: true,
      active: true
    },
    {
      id: 4,
      staked: "6000000",
      stakers: "401",
      status: true
    },
  ];
  const stakeComponents = validators.map((el) => (
    <StakeCard
      key={el.id}
      totalStaked={formatBalance(Number(el.staked))}
      totalStakers={el.stakers}
      isMine={formatBalance(Number(el.mine))}
      isStatus={el.status}
      isActive={el.active}
    />
  ));

  return (
    <Container>
      <Header style={style.headerBg}>
        <Left>
          <BackButton onBack={changePage("history")} style={style.leftBtn} />
        </Left>
        <Body>
          <Title style={style.headerTitle}>Stake</Title>
        </Body>
        <Right />
      </Header>

      <Content style={{ backgroundColor: Images.velasColor4 }}>
        <View style={style.titleContent}>
          <Text style={style.titleText}>All Validators</Text>
        </View>
        <View style={style.content}>
          <>{stakeComponents}</>
        </View>
      </Content>
      <Footer store={store}></Footer>
    </Container>
  );
};

const style = StyleSheet.create({
  headerBg: {
    backgroundColor: Images.colorDarkBlue,
    borderBottomColor: "transparent",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.02,
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 20,
    fontWeight: "bold",
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
