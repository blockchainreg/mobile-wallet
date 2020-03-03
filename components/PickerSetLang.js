import React from "react";
import styles from "../Styles.js";
import RNPickerSelect from "react-native-picker-select";
import getLang from "../wallet/get-lang.js";

export default ({ store }) => {
  const onValueChangeValue = async value => {
    store.lang = value;
    await console.log("store.lang", store.lang);
  };
  const placeholder = {
    label: null,
    value: null
  };
  return (
    <RNPickerSelect
      placeholder={placeholder}
      onValueChange={value => {
        onValueChangeValue(value);
      }}
      value={store.lang}
      style={{
        inputIOS: {
          fontSize: 16,
          fontWeight: "bold"
        },
        inputAndroid: {
          fontSize: 16,
          fontWeight: "bold"
        }
      }}
      items={[
        {
          label: "English",
          value: "en"
        },
        {
          label: "Русский",
          value: "ru"
        },
        {
          label: "Українська",
          value: "ua"
        }
      ]}
    />
  );
};
