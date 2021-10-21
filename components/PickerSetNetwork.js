import React from "react";
import { Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import spin from "../utils/spin.js";

export default ({ store, web3t }) => {
  const onValueChangeValue = async (value) => {
    store.current.network = value;
    Platform.OS === "android"
      ? spin(
          store,
          `Changing network to ${store.current.network.toUpperCase()}`,
          web3t.refresh.bind(web3t)
        )((err, data) => {})
      : null;
  };
  // for IOS
  const onDone = () => {
    spin(
      store,
      `Changing network to ${store.current.network.toUpperCase()}`,
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
      onDonePress={onDone}
    />
  );
};
