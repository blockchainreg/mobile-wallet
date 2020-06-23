import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from '@expo/vector-icons';


export default ({ store }) => {
  const onValueChangeValue = async value => {
    store.lang = value;
    localStorage.setItem("lang", value);

    await console.log("store.lang", store.lang);
  };
  const langItems = [
    {
      label: "English 🇺🇸",
      value: "en"
    },
    {
      label: "Русский 🇷🇺",
      value: "ru"
    },
    {
      label: "Українська 🇺🇦",
      value: "ua"
    },
    {
      label: "中國人 🇨🇳",
      value: "zh"
    },
    {
      label: "韓語 🇰🇷",
      value: "ko"
    },
    {
      label: "Indonesia 🇮🇩",
      value: "id"
    },
    {
      label: "ภาษาไทย 🇹🇭",
      value: "th"
    },
    {
      label: "Malay 🇲🇾",
      value: "my"
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
