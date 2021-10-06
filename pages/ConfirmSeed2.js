import React from "react";
import {
  Image,
  Clipboard,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Button, CardItem, Body, Toast } from "native-base";
import styles from "../Styles.js";
import Images from "../Images.js";
import getLang from "../wallet/get-lang.js";
import Background from "../components/Background.js";
import SeedWord from "../components/SeedWord.js";
import Header from "../components/Header";

const DEV_SKIP = "...";

export default ({ store, web3t }) => {
  const lang = getLang(store);

  const number = store.current.seedIndexes[store.current.seedIndex];
  const placeholderConfirmSeed =
    lang.placeholderConfirmSeed + " " + "#" + (number + 1);
  const verifyWordOrSetup = () => {
    if (store.signUpConfirmSeedField != DEV_SKIP) {
      const expectedWord = store.current.seed.split(" ")[number];

      if (expectedWord !== store.signUpConfirmSeedField) {
        return Toast.show({ text: lang.inconsistency });
      }

      if (store.current.seedIndex < 23) {
        store.signUpConfirmSeedField = "";
        store.current.seedIndex += 1;
        return;
      }
    }

    store.signUpConfirmSeedField = "";
    // store.current.page = "terms";
    store.current.page = "wallets";
    localStorage.setItem("is-demo-mode", "");
  };

  const handleConfirmSeedField = async (text) => {
    store.signUpConfirmSeedField = text;
  };
  const back = () => {
    if (store.current.seedIndex > 0) {
      store.signUpConfirmSeedField = "";
      store.current.seedIndex -= 1;
      return;
    }

    store.current.page = "generatedseed";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.container}
    >
      <Header onBack={back} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style.inner}>
          <View style={{ alignSelf: "center" }}>
            <Image
              source={Images.confirmation}
              style={[styles.setupConfirmImg, {alignSelf: "center"}]}
            />
            <Text style={styles.textH1Seed}>{lang.confirmation}</Text>
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {SeedWord(store, handleConfirmSeedField, number)}
            <View style={style.marginBtn}>
              <Button
                block
                style={styles.btnVelasActive}
                onPress={verifyWordOrSetup}
              >
                <Text style={styles.textBtn}>{lang.continue}</Text>
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 0.7,
    justifyContent: "center",
  },
  marginBtn: {
    alignItems: "center",
    width: "100%",
  },
});
