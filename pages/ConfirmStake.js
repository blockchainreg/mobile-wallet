import React from "react";
import { Container, Text } from "native-base";
import { View, StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import StepItem from "../components/StepItem";
import Notice from "../components/Notice";
import Header from "../components/Header";

var width = Dimensions.get("window").width;
const ADDRESS = "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK";
const ADDRESS_2 = "F3RZb2HFM6hs4yN9VQZckFdB";

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);

  return (
    <Container>
      <Header
        onBack={changePage("sendStake")}
        greenBack
        title={lang.stake || "Stake"}
        identIcon={ADDRESS}
      />

      <View style={style.contentBg}>
        <View style={style.container}>
          <Text style={style.title}>{lang.titleItemsStake || "These actions will be made"}</Text>
          {store.isStaker ? (
            <View style={style.steps}>
              <StepItem
                index="1"
                text={lang.stepItem1 || "Convert 1,000,000 VLX to VLX Native"}
                address={ADDRESS_2}
              />
              <StepItem
                index="2"
                text={lang.stepItem2 + " " + "-" || "Create Stake Account -"}
                address={ADDRESS_2}
              />
              <StepItem
                index="3"
                text={lang.stepItem3 + " " + "-" || "Stake on Validator -"}
                address={ADDRESS_2}
              />
            </View>
          ) : (
            <View style={style.steps}>
              <StepItem
                index="1"
                text={lang.stepItem2 + " " + "-" || "Create Stake Account -"}
                address={ADDRESS_2}
              />
              <StepItem
                index="2"
                text={lang.stepItem3 + " " + "-" || "Stake on Validator -"}
                address={ADDRESS_2}
              />
            </View>
          )}
        </View>
        <View style={style.buttonBottom}>
          <Notice
            text={lang.noticeStakingRewards || "Staking rewards will be reinvested and added to the stake."}
            icon="warning"
          />
          <ButtonBlock
            type={"CONFIRM"}
            onPress={changePage("stakingEnterance")}
            text={lang.confirm || "Confirm"}
          />
        </View>
      </View>
    </Container>
  );
};

const style = StyleSheet.create({
  contentBg: {
    backgroundColor: Images.velasColor4,
    justifyContent: "space-between",
    flex: 1,
  },
  buttonBottom: {
    marginBottom: 60,
  },
  title: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    marginTop: 45,
  },
  steps: {
    justifyContent: 'center',
  alignItems: 'flex-start',
  }
});
