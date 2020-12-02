import React, { useState } from "react";
import { KECCAK256_NULL } from "ethereumjs-util";
import { Input, Item, Text } from "native-base";
import styles from "../Styles.js";
import spin from "../utils/spin.js";
import getLang from "../wallet/get-lang.js";


const InputComponent = ({ accountIndex, onValueChange }) => {
  const [index, indexChange] = useState(accountIndex);
  const onBlur = () => {
    let value = parseInt(index);
    if (isNaN(value) || value < 1 || value > 1e9) {
      value = 1;
    }
    indexChange(value + "");
    onValueChange(value);
  };

  return (
    <Item style={styles.borderItemAccount}>
        <Text style={styles.txtSettings}>Account #</Text>
        <Input
          onChangeText={indexChange}
          value={index + ""}
          onBlur={onBlur}
          returnKeyType="done"
          keyboardType="numeric"
          style={styles.inputSize}
          selectionColor={"#fff"}
          keyboardAppearance="dark"
        />
      </Item>
  );
};

export default ({ store, web3t }) => {
  const onValueChange = (value) => {
    //store.lang = value;
    //localStorage.setItem("lang", value);
    if (store.current.accountIndex === value) {
      return;
    }
    store.current.accountIndex = value;
    spin(
      store,
      `Updating account index`,
      web3t.refresh.bind(web3t)
    )((err, data) => {
      console.log("Updating account index finished");
    });
  };
  // const createIndex = (i)=> {
  //    return {
  //     label: "Account " + i,
  //     value: i
  //   }
  // }
  return (
    <InputComponent
      accountIndex={store.current.accountIndex}
      onValueChange={onValueChange}
    />
  );
  // const langItems = [...Array(1000).keys()].map(createIndex)
  //
  // return (
  //   <RNPickerSelect
  //     placeholder={{}}
  //     onValueChange={value => {
  //       onValueChangeValue(value);
  //     }}
  //     useNativeAndroidPickerStyle={false}
  //     value={store.current.accountIndex}
  //     items={langItems}
  //     useNativeAndroidPickerStyle={false}
  //     Icon={() => {
  //       return <Ionicons name="md-arrow-down" size={24} color="transparent" />;
  //     }}
  //     style={{
  //       inputIOS: {
  //         color: "#fff",
  //         fontSize: 17,
  //       },
  //       inputAndroid: {
  //         color: "#fff",
  //         fontSize: 17,
  //       }
  //     }}
  //   />
  // );
};
