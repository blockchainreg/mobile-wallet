import React from "react";
import RNPickerSelect from "react-native-picker-select";

export default ({ store, web3t }) => {
  const onValueChangeValue = async value => {
    //store.lang = value;
    //localStorage.setItem("lang", value);
    store.current.accountIndex = value;
    web3t.refresh((err,data) => {
        console.log("refresh balance finish");
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
