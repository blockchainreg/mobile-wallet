import React from "react";
import { Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import spin from "../utils/spin.js";

export default ({ store, web3t }) => {
  const onValueChangeValue = async (value) => {
    store.current.network = value;
    await console.log("store.current.network", store.current.network);
    return web3t.refresh(function () {});
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
