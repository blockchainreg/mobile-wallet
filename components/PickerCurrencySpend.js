import React from "react";
import styles from "../Styles.js";
import RNPickerSelect from "react-native-picker-select";

export default ({ store }) => {
  const onValueChangeValue = async (value) => {
    store.selectedCoinsSell.selected = value;
    await console.log('currency_to_spend 😁', store.selectedCoinsSell.selected )
    
  };
  console.log("сurrency_to_spend", store.selectedCoinsSell.selected);



  return (
    <RNPickerSelect
      onValueChange={(value) => {onValueChangeValue(value)}}
      value={store.selectedCoinsSell.selected}
      style={{
        inputIOS: {
          fontSize: 16,
          color: "#fff",
          fontWeight: 'bold'
        },
        placeholder: {
          color: "rgba(255,255,255,0.50)",
          fontSize: 16,
          fontWeight: "bold"
        }
      }}
      items={[
        {
          label: store.userWallet.UAH.currency,
          value: store.userWallet.UAH.currency
        },
        {
          label: store.userWallet.ETH.currency,
          value: store.userWallet.ETH.currency
        },
        {
          label: store.userWallet.BTC.currency,
          value: store.userWallet.BTC.currency
        },
        {
          label: store.userWallet.USDT.currency,
          value: store.userWallet.USDT.currency
        },
        {
          label: store.userWallet.USD.currency,
          value: store.userWallet.USD.currency
        },
        {
          label: store.userWallet.EUR.currency,
          value: store.userWallet.EUR.currency
        }
      ]}
    />
  );
};
