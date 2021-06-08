import React from "react";
import { Container, Text } from "native-base";
import { View, StyleSheet, Dimensions, Linking } from "react-native";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import { WithdrawalRequest } from "../svg/index";
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
<Header onBack={changePage("exitValidator")} greenBack title={'Exit from Validator'}/>

      <View style={style.contentBg}>
        <View style={style.container}>
          <WithdrawalRequest />
          <Text style={style.title}>
          Withdrawal request has been submitted successfully. 
It will start cooling down from the next epoch. </Text>
<Text style={{...style.title, marginTop: 20}}>

Please navigate the withdrawals tab to monitor the progress.
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
    paddingHorizontal: 20
  },
  container: {
    marginTop: 45,
    flex: 1,
    alignItems: "center",
  },
});
