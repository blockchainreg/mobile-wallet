import React from "react";
import {
  Container,
  Text
} from "native-base";
import { View, StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import StepItem from "../components/StepItem";
import Notice from "../components/Notice";
import Header from '../components/Header'

var width = Dimensions.get("window").width;
const ADDRESS = "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK";
const ADDRESS_2 = "F3RZb2HFM6hs4yN9VQZckFdB";

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  return (
    <Container>
<Header onBack={changePage("sendStake")} greenBack title={'Stake'} identIcon={ADDRESS}/>
      

      <View style={style.contentBg}>
        <View style={style.container}>
          <Text style={style.title}>These actions will be made</Text>
          {store.isStaker ? (
            <>
              <StepItem
                index="1"
                text="Convert 1,000,000 VLX to VLX Native"
                address={ADDRESS_2}
              />
              <StepItem
                index="2"
                text="Create Stake Account -"
                address={ADDRESS_2}
              />
              <StepItem
                index="3"
                text="Stake on Validator -"
                address={ADDRESS_2}
              />
            </>
          ) : (
            <>
              <StepItem
                index="1"
                text="Create Stake Account -"
                address={ADDRESS_2}
              />
              <StepItem
                index="2"
                text="Stake on Validator -"
                address={ADDRESS_2}
              />
            </>
          )}
        </View>
        <View style={style.buttonBottom}>
          <Notice
            text="Staking rewards will be reinvested and added to the stake."
            icon="warning"
          />
          <ButtonBlock
            type={"CONFIRM"}
            onPress={changePage("stakingEnterance")}
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
});
