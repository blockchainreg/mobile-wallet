import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from '@expo/vector-icons';
import { KECCAK256_NULL } from "ethereumjs-util";

import spin from "../utils/spin.js";

export default ({ store, web3t }) => {
  const onValueChangeValue = async value => {
    //store.lang = value;
    //localStorage.setItem("lang", value);
    store.current.accountIndex = value;
    spin(store, `Updating account index`, web3t.refresh.bind(web3t))((err,data) => {
        console.log("Updating account index finished");
    })
  };
  const createIndex = (i)=> {
     return {
      label: "Account " + i,
      value: i
    }
  }
  const langItems = [...Array(1000).keys()].map(createIndex)

  return (
    <RNPickerSelect
      placeholder={{}}
      onValueChange={value => {
        onValueChangeValue(value);
      }}
      useNativeAndroidPickerStyle={false}
      value={store.current.accountIndex}
      items={langItems}
      useNativeAndroidPickerStyle={false}
      Icon={() => {
        return <Ionicons name="md-arrow-down" size={24} color="transparent" />;
      }}
      style={{
        inputIOS: {
          color: "#fff",
          fontSize: 17,
        },
        inputAndroid: {
          color: "#fff",
          fontSize: 17,
        }
      }}
    />
  );
};
