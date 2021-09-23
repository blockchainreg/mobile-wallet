import React from "react";
import { Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import spin from "../utils/spin.js";
import initStaking from '../initStaking.js';
import {Toast} from "native-base";

export default ({ store, web3t }) => {
  const onValueChangeValue = async (value) => {
  	store.current.network = value;
	initStaking(store);
    spin(
	  store,
	  "Changing network...",
		web3t.refresh.bind(web3t)
    )((err, data) => {});
	
  };
  const networkItems = [
    {
      label: "Mainnet",
      value: "mainnet",
    },
    {
      label: "TestNet",
      value: "testnet",
    },
  ];

  return (
    <RNPickerSelect
      placeholder={{}}
      onValueChange={(value) => {
        onValueChangeValue(value);
      }}
      useNativeAndroidPickerStyle={false}
      value={store.current.network}
      items={networkItems}
      style={{
        inputIOS: {
          color: "#fff",
          fontSize: 17,
          fontFamily: "Fontfabric-NexaRegular",
        },
        inputAndroid: {
          color: "#fff",
          fontSize: 17,
          fontFamily: "Fontfabric-NexaRegular",
        },
      }}
    />
  );
};
