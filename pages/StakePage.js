import React from "react";
import { Container, Text, Content, List, ListItem } from "native-base";
import Footer from "./Footer.js";
import { StyleSheet, Dimensions, View } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import StakeItem from "../components/StakeItem.js";
import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";

export default ({ store, web3t, props }) => {
  const { stakingStore } = store;
  const changePage = (tab, validatorAddress) => () => {
    stakingStore.openedValidatorAddress = validatorAddress;
    store.current.page = tab;
  };
  if (!stakingStore.validators) {
    // return null;
    return <Spinner />;
  }

  const lang = getLang(store);

  const filterStake = stakingStore.getStakedValidators();
  const filterTotalStaked = stakingStore.getNotStakedValidators();
  

  const renderItemsMyStake = filterStake.map((el) => (
    <StakeItem
      key={el.address}
      typeBadge={el.status}
      address={el.address}
      myStake={el.myStake}
      apr={el.apr}
      onPress={changePage("detailsValidator", el.address)}
      store={store}
      isStaked
    />
  ));
  const renderItemsTotalValidators = filterTotalStaked.map((el) => (
    <StakeItem
      key={el.address}
      typeBadge={el.status}
      address={el.address}
      totalStaked={el.activatedStake}
      totalStakers={el.totalStakers}
      onPress={changePage("detailsValidator", el.address)}
      store={store}
    />
  ));

  return (
    <Container>
      <Header title={lang.titleStake || "Stake"} />
      <Content style={{ backgroundColor: Images.velasColor4 }}>
        <List>
          <ListItem itemHeader noBorder>
            <Text style={style.titleText}>
              {lang.itemStakedTitle || "Staked Validators"}
            </Text>
          </ListItem>
          {renderItemsMyStake}
          <ListItem itemHeader noBorder>
            <Text style={style.titleText}>
              {lang.itemValidatorsTitle || "Other Validators"}
            </Text>
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
