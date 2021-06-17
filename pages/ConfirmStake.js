import React from "react";
import { Container, Text } from "native-base";
import { View, StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import StepItem from "../components/StepItem";
import Notice from "../components/Notice";
import Header from "../components/Header";
import { formatStakeAmount } from "../utils/format-value.js";
import BN from 'bn.js';

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  const { stakingStore } = store;
  const details = stakingStore.getValidatorDetails();
  const ADDRESS = details.address;
  const NEW_ADDRESS = stakingStore.getNewAccountAddress();
  const swapAmount = stakingStore.getSwapAmountByStakeAmount(store.amount);
  const confirm = () => {
    if (!store.amount) return null;
    const amount = new BN(Math.floor(parseFloat(store.amount) * 1e9)+'', 10);
    // debugger;
    stakingStore.stake(ADDRESS, amount);
    changePage("stakingEnterance")();
    store.amount = null;
  }
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
          {!details.myStake.isZero() ? (
            <View style={style.steps}>
              <StepItem
                index="1"
                // text={lang.stepItem1 || "Convert 1,000,000 VLX to VLX Native"}
                text={`Convert ${formatStakeAmount(swapAmount)} VLX to VLX Native`}
                address={NEW_ADDRESS}
              />
              <StepItem
                index="2"
                text={lang.stepItem2 + " " + "-" || "Create Stake Account -"}
                address={NEW_ADDRESS}
              />
              <StepItem
                index="3"
                text={lang.stepItem3 + " " + "-" || "Stake on Validator -"}
                address={NEW_ADDRESS}
              />
            </View>
          ) : (
            <View style={style.steps}>
              <StepItem
                index="1"
                text={lang.stepItem2 + " " + "-" || "Create Stake Account -"}
                address={NEW_ADDRESS}
              />
              <StepItem
                index="2"
                text={lang.stepItem3 + " " + "-" || "Stake on Validator -"}
                address={NEW_ADDRESS}
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
            onPress={confirm}
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
