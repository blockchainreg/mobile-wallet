import React from "react";
import { Container } from "native-base";
import { View, StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import InputComponent from "../components/InputComponent";
import Notice from "../components/Notice";
import Header from "../components/Header";
import { formatStakeAmount } from "../utils/format-value";
import BN from 'bn.js';




export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const { stakingStore } = store;
  const details = stakingStore.getValidatorDetails();
  const lang = getLang(store);
  const TOTAL_STAKE = !details.myStake.isZero() ? formatStakeAmount(details.myStake) : formatStakeAmount(details.activatedStake);
  const ADDRESS = details.address;

  const handleChange = async text => {
    store.amountWithdraw = text;
  };

  const onPressMax = () => {
    store.amountWithdraw = TOTAL_STAKE;
  }
  const onPressButton = () => {
    if (!store.amountWithdraw) return null;
    const amountWithdraw = store.amountWithdraw;
    // console.log('amountWithdraw', amountWithdraw)
    debugger;
    stakingStore.requestWithdraw(ADDRESS, amountWithdraw);
    changePage("confirmExit")();
  }

  return (
    <Container>
      <Header
        onBack={changePage("detailsValidator")}
        title={lang.exitValidator || "Exit from Validator"}
        identIcon={ADDRESS}
        greenBack
      />
      <View style={style.contentBg}>
        <View>
          <InputComponent
            title={lang.enterAmount || "Enter Amount"}
            sub_text={lang.yourTotalStake + ":" || "Your Total Stake:"}
            total_stake={TOTAL_STAKE}
            token="vlx"
            btnTxt={lang.useMax || "Use max"}
            value={store.amountWithdraw}
            onChange={text => handleChange(text)}
            onPressMax={onPressMax}
            isWithdraw
          />
        </View>
        <View style={style.buttonBottom}>
          {store.amountWithdraw ? (
            <Notice
              text={lang.noticeExitValidator || "You already have a withdrawal request. This withdrawal  is going to be combined with the previous one."}
              icon="warning"
            />
          ) : null}
          <ButtonBlock type={"WITHDRAW"} text={lang.withdraw || "Withdraw"} onPress={onPressButton} />
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
