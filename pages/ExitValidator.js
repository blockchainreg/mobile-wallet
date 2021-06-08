import React from "react";
import {
  Container,
} from "native-base";
import { View, StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import InputComponent from "../components/InputComponent";
import Notice from "../components/Notice";
import Header from '../components/Header'

var width = Dimensions.get("window").width;
const ADDRESS = "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK";

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  store.isRetryRequest = true; // change to false to show without notice message. This is a test demo to visualize.
 
  return (
    <Container>
      <Header onBack={changePage("detailsValidator")} title={'Exit from Validator'} identIcon={ADDRESS} greenBack/>
      <View style={style.contentBg}>
        <View>
          <InputComponent
            title="Enter Amount"
            total_stake="51000"
            token="vlx"
          />
        </View>
        <View style={style.buttonBottom}>
        {store.isRetryRequest ? (
            <Notice
                text="You already have a withdrawal request. 
                This withdrawal  is going to be combined with the previous one."
                icon="warning"
              />

        ) : null}
          <ButtonBlock type={"WITHDRAW"} onPress={changePage("confirmExit")} />
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
});
