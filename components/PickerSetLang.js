import React from "react";
import styles from "../Styles.js";
import RNPickerSelect from "react-native-picker-select";

export default ({ store }) => {
  const onValueChangeValue = async value => {
    store.lang = value;
    await console.log("store.lang", store.lang);
  };
  const langItems = [
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
  ];

  return (
    <RNPickerSelect
      placeholder={{}}
      onValueChange={value => {
        onValueChangeValue(value);
      }}
      useNativeAndroidPickerStyle={false}
      value={store.lang}
      items={langItems}
      style={{
        inputIOS: {
          color: "rgba(49,49,49,100)",
          fontSize: 17,
          fontWeight: "bold"
        },
        inputAndroid: {
          color: "rgba(49,49,49,100)",
          fontSize: 17,
          fontWeight: "bold"
        }
      }}
      Icon={() => {
        return null;
      }}
    />
  );
};
