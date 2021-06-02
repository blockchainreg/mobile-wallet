import React from "react";
import { Container, Header, Left, Body, Right, Title, Text } from "native-base";
import { View, StyleSheet, Dimensions, Linking } from "react-native";
import Images from "../Images.js";
import BackButton from "../components/BackButton.js";
import ButtonBlock from "../components/ButtonBlock.js";
import StatusBar from "../components/StatusBar.js";
import { StakingEnteranceIcon } from "../svg/index";

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
      <StatusBar />
      <Header style={style.headerBg}>
        <Left>
          <BackButton
            onBack={changePage("confirmStake")}
            style={style.leftBtn}
          />
        </Left>
        <Body>
          <Title style={style.headerTitle}>Staking Enterance</Title>
        </Body>
        <Right />
      </Header>

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
