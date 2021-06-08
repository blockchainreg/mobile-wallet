import React from "react";
import { Container, Text } from "native-base";
import { View, StyleSheet, Dimensions, Linking } from "react-native";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import { StakingEnteranceIcon } from "../svg/index";
import Header from '../components/Header'

var width = Dimensions.get("window").width;
const URL = "https://support.velas.com/hc/en-150/articles/360021044820-Delegation-Warmup-and-Cooldown";

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const onPressLink = () => {
    Linking.openURL(URL);
  };
  return (
    <Container>
      <Header onBack={changePage("confirmStake")} title={'Staking Enterance'} greenBack/>
      <View style={style.contentBg}>
        <View style={style.container}>
          <StakingEnteranceIcon />
          <Text style={style.title}>
            Stake account has been created successfully
          </Text>
          <Text style={style.subTitle}>
            It is not fully active immediately, it may take multiple epochs to
            warm it up.
          </Text>
          <Text style={style.link} onPress={onPressLink}>
            Read more
          </Text>
        </View>
        <View style={style.buttonBottom}>
          <ButtonBlock type={"OK"} onPress={changePage("detailsValidator")} />
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
  subTitle: {
    color: "rgba(255, 255, 255, 0.60)",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
  },
  container: {
    marginTop: 45,
    flex: 1,
    alignItems: "center",
  },
  link: {
    color: Images.colorBlue,
    textDecorationLine: "underline",
    marginTop: 20,
    fontFamily: "Fontfabric-NexaRegular",
  },
});
