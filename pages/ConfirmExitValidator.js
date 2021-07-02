import React from "react";
import { Container, Text } from "native-base";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import { WithdrawalRequest } from "../svg/index";
import Header from "../components/Header";
import getLang from "../wallet/get-lang.js";
import spin from "../utils/spin.js";

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  const { stakingStore } = store;
  const back = () => {
    changePage("exitValidator")();
    store.amountWithdraw = null;
  }
  const okBtn = async () => {
    spin(
      store,
      'Validator is loading',
      async (cb) => {
        try {
          const result = await stakingStore.reloadWithRetry();
          cb(null, result);
        } catch(err) {
          cb(err);
        }
      }
    )((err, result) => {
      if (err) {
        setTimeout(() => {
          Alert.alert('Something went wrong. Please contact support. You can still use web interface for full staking support.');
        }, 1000);
        console.error(err);
        return;
      }
      changePage("detailsValidator")();
      store.amountWithdraw = null;
    });
  }
  return (
    <Container>
      <Header
        // onBack={back}
        // greenBack
        title={lang.exitValidator || "Exit from Validator"}
      />

      <View style={style.contentBg}>
        <View style={style.container}>
          <WithdrawalRequest />
          <Text style={style.title}>
            {lang.exitValidatorTitle || "Withdrawal request has been submitted successfully. It will start cooling down from the next epoch."}
          </Text>
          <Text style={{ ...style.title, marginTop: 20 }}>
            {lang.exitValidatorSubTitle || "Please navigate the withdrawals tab to monitor the progress."}
          </Text>
        </View>
        <View style={style.buttonBottom}>
          <ButtonBlock
            type={"OK"}
            text={lang.ok || "Ok"}
            onPress={okBtn}
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
    paddingHorizontal: 20,
  },
  container: {
    marginTop: 45,
    flex: 1,
    alignItems: "center",
  },
});
