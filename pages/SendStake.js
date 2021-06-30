import React from "react";
import { Container } from "native-base";
import { View, StyleSheet, Dimensions } from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import ButtonBlock from "../components/ButtonBlock.js";
import InputComponent from "../components/InputComponent";
import Header from "../components/Header";
import { formatStakeAmount } from "../utils/format-value";
import Notice from "../components/Notice";
import BN from 'bn.js';

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const { stakingStore } = store;
  if (stakingStore.isRefreshing) return null;
  const details = stakingStore.getValidatorDetails();
  const ADDRESS = details.address;
  const TOTAL_STAKE = !details.myStake.isZero() ? formatStakeAmount(details.myStake) : formatStakeAmount(details.activeStake);

  const AVAILABLE_BALANCE = details.available_balance;

  const handleChange = async text => {
    store.amount = text.replace(",", ".");
  };
  const onPressMax = () => {
    store.amount = formatStakeAmount(AVAILABLE_BALANCE.sub(new BN(1e9)));
  }
  const onPressButton = () => {
    if (!store.amount || parseFloat(store.amount) && new BN(Math.floor(parseFloat(store.amount) * 1e9)+'', 10).gte(AVAILABLE_BALANCE.sub(new BN(1e9)))) return null;
    changePage("confirmStake")();
  }
  const back = () => {
    changePage("detailsValidator")();
    store.amount = null;
  }
  const lang = getLang(store);
  return (
    <Container>
      <Header
        onBack={back}
        greenBack
        title={lang.stake || "Stake"}
        identIcon={ADDRESS}
      />
      <View style={style.contentBg}>
        <View>
          <InputComponent
            title={lang.enterAmount || "Enter Amount"}
            sub_text={lang.availableStaking + ":" || "Available for staking:"}
            available_balance={formatStakeAmount(AVAILABLE_BALANCE)}
            total_stake={TOTAL_STAKE}
            token="vlx"
            btnTxt={lang.useMax || "Use max"}
            value={store.amount}
            onChange={text => handleChange(text)}
            onPressMax={onPressMax}
            />
        </View>
        <View style={style.buttonBottom}>
          {parseFloat(store.amount) && new BN(Math.floor(parseFloat(store.amount) * 1e9)+'', 10).gte(AVAILABLE_BALANCE.sub(new BN(1e9))) ?
          <Notice
              text={"When stake all funds, you must leave about 1 VLX to pay the commission!!"}
              icon="warning"
            /> : null }
          <ButtonBlock type={!store.amount || parseFloat(store.amount) && new BN(Math.floor(parseFloat(store.amount) * 1e9)+'', 10).gte(AVAILABLE_BALANCE.sub(new BN(1e9))) ? "DISABLED" : "NEXT"} text={lang.continue || "Next"} onPress={onPressButton} />
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
