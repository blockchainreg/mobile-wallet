import React from "react";
import {
  Container,
  Text,
  Content,
  List,
  ListItem,
} from "native-base";
import Footer from "./Footer.js";
import { StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import StakeItem from "../components/StakeItem.js";
import Header from "../components/Header.js";

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
      staked: true
    },
    {
      id: 2,
      my_stake: "50000",
      apr: "18.3",
      status: "Active",
      address: "eon93Yhg7bjKgdwnt79TRfeLbePqddLEFP9H1iQBufN",
      staked: true
    },
    {
      id: 3,
      total_staked: "400000",
      total_stakers: "392",
      status: "Active",
      address: "rtn13Yhg7bjKgdwnt79TRfeLbePqddLEFP9H1iQBufN",
      unstaked: true
    },
    {
      id: 4,
      total_staked: "400000",
      total_stakers: "232",
      status: "Inactive",
      address: "vs1BJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3V",
      unstaked: true
    },
    {
      id: 5,
      total_staked: "230000",
      total_stakers: "232",
      status: "Active",
      address: "8PsBJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3V",
      unstaked: true
    },
    {
      id: 6,
      total_staked: "450000",
      total_stakers: "123",
      status: "Inactive",
      address: "vs1BJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3V",
      unstaked: true
    },
    {
      id: 7,
      total_staked: "9900000",
      total_stakers: "863",
      status: "Inactive",
      address: "1BJogNvLYbSRfzpNGtgvh9KqsCULdrXrhPywz4S3Vvs",
      unstaked: true
    },
  ];
  const filterStake = testData.filter((el) => el.staked);
  const filterTotalStaked = testData.filter((el) => el.unstaked);
  
  const renderItemsMyStake = filterStake.map((el) => (
    <StakeItem
      key={el.id}
      typeBadge={el.status}
      address={el.address}
      myStake={el.my_stake}
      totalStaked={el.total_staked}
      totalStakers={el.total_stakers}
      apr={el.apr}
      onPress={changePage("detailsValidator")}
      store={store}
      isStaked
    />
    ));
    
  const renderItemsTotalValidators = filterTotalStaked.map((el) => (
    <StakeItem
      key={el.id}
      typeBadge={el.status}
      address={el.address}
      validatorName={el.validator}
      myStake={el.my_stake}
      totalStaked={el.total_staked}
      totalStakers={el.total_stakers}
      apr={el.apr}
      onPress={changePage("detailsValidator")}
      store={store}
    />
  ));
  return (
    <Container>
      <Header
      title={lang.titleStake || "Stake"}
      />
      <Content style={{ backgroundColor: Images.velasColor4 }}>
        <List>
          <ListItem itemHeader noBorder>
            <Text style={style.titleText}>{lang.itemStakedTitle || "Staked Validators"}</Text>
          </ListItem>
          {renderItemsMyStake}
          <ListItem itemHeader noBorder>
            <Text style={style.titleText}>{lang.itemValidatorsTitle || "Other Validators"}</Text>
          </ListItem>
          {renderItemsTotalValidators}
        </List>
      </Content>
      <Footer store={store}></Footer>
    </Container>
  );
};

const style = StyleSheet.create({
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Fontfabric-NexaBold",
    // marginRight: 10
  },
});
