import React from "react";
import { Text, View, Header, Item, Body, Left, Right } from "native-base";
import { Image, ImageBackground } from "react-native";
import GradientButton from "react-native-gradient-buttons";
import styles from "../Styles.js";
import Toast from "@rimiti/react-native-toastify";
import Images from "../Images.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import RNPickerSelect from "react-native-picker-select";

export default ({ store, web3t }) => {
  const showToast = message => {
    console.log("Trying to show toast", message);
    this.toastify && this.toastify.show(message, 3000);
  };
  const lang = getLang(store);

  const btnNext = store => {
    const confirmLang = async () => {
      store.current.page = "locked";
    };
    return (
      <GradientButton
        style={styles.gradientBtnPh}
        text={lang.continue}
        textStyle={{ fontSize: 14 }}
        gradientBegin="#9d41eb"
        gradientEnd="#9d41eb"
        gradientDirection="diagonal"
        height={50}
        width="100%"
        radius={10}
        onPressAction={confirmLang}
      />
    );
  };

  const selectLang = store => {
    const onValueChangeValue = async value => {
      store.lang = value;
      localStorage.setItem("lang", value);
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
        style={{
          inputIOS: {
            color: "#fff",
            fontSize: 16
          },
          inputAndroid: {
            color: "#fff",
            fontSize: 16
          }
        }}
        Icon={() => {
          return null;
        }}
      />
    );
  };

  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={Images.backgroundImage}
        style={styles.introBackground}
      >
        <Toast
          ref={c => (this.toastify = c)}
          position="top"
          style={styles.toastStyle}
        />
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlexHeader} />
          <Body style={styles.viewFlexHeader} />
          <Right style={styles.viewFlexHeader} />
        </Header>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'}/>
        <View style={styles.containerFlexStart}>
          <Image source={Images.logo} style={styles.styleLogo} />
          <View style={styles.widthCard}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>{lang.titleLang}</Text>
            </View>
            <Item regular style={styles.itemPickerLang}>
              <View>{selectLang(store)}</View>
            </Item>
            <View style={styles.btnLangPage}>{btnNext(store)}</View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
