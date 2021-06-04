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
  List,
  ListItem,
} from "native-base";
import Footer from "./Footer.js";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import BackButton from "../components/BackButton.js";
import StakeItem from "../components/StakeItem.js";

var width = Dimensions.get("window").width;

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  const testData = [
    {
      id: 1,
      my_stake: "20000",
      apr: "10.3",
      status: "Active",
      address: "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK",
    },
    {
      id: 2,
      my_stake: "50000",
      apr: "18.3",
      status: "Active",
      address: "eon93Yhg7bjKgdwnt79TRfeLbePqddLEFP9H1iQBufN",
    },
    {
      id: 3,
      total_staked: "400000",
      total_stakers: "392",
      status: "Active",
      validator: "ValidatorName",
    },
    {
      id: 4,
      total_staked: "400000",
      total_stakers: "232",
      status: "Inactive",
      address: "vs1BJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3V",
    },
    {
      id: 5,
      total_staked: "230000",
      total_stakers: "232",
      status: "Active",
      address: "8PsBJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3V",
    },
    {
      id: 6,
      total_staked: "450000",
      total_stakers: "123",
      status: "Inactive",
      address: "vs1BJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3V",
    },
    {
      id: 7,
      total_staked: "9900000",
      total_stakers: "863",
      status: "Inactive",
      address: "1BJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3Vvs",
    },
  ];
  const filterStake = testData.filter((el) => el.my_stake);
  const filterTotalStaked = testData.filter((el) => el.total_staked);

  const renderItemsMyStake = filterStake.map((el) => (
    <StakeItem
      key={el.id}
      typeBadge={el.status}
      styleBadge={el.status}
      address={el.address}
      validatorName={el.validator}
      myStake={el.my_stake}
      totalStaked={el.total_staked}
      totalStakers={el.total_stakers}
      apr={el.apr}
      onPress={changePage("detailsValidator")}
    />
  ));
  const renderItemsTotalValidators = filterTotalStaked.map((el) => (
    <StakeItem
      key={el.id}
      typeBadge={el.status}
      styleBadge={el.status}
      address={el.address}
      validatorName={el.validator}
      myStake={el.my_stake}
      totalStaked={el.total_staked}
      totalStakers={el.total_stakers}
      apr={el.apr}
      onPress={changePage("detailsValidator")}
    />
  ));
  return (
    <Container>
        <StatusBar/>
      <Header style={style.headerBg}>
        <Left/>
        <Body>
          <Title style={style.headerTitle}>Stake</Title>
        </Body>
        <Right />
      </Header>

      <Content style={{ backgroundColor: Images.velasColor4 }}>
        <List>
          <ListItem itemHeader noBorder>
            <Text style={style.titleText}>Staked Validators</Text>
          </ListItem>
          {renderItemsMyStake}
          <ListItem itemHeader noBorder>
            <Text style={style.titleText}>Other Validators</Text>
          </ListItem>
          {renderItemsTotalValidators}
        </List>
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
