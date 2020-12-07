import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "../components/GradientButton.js";
import { Container, Content, Icon, Button } from "native-base";
import { Image } from "react-native";
import styles from "../Styles.js";
import getLang from '../wallet/get-lang.js';

export default ({ store }) => {
  const lang = getLang(store);
  const changePage = (tab, visible) => () => {
    store.tab = tab;
    store.footerVisible = visible;
  };
  const handleOpenModalPress = store => {
    return (
      <TouchableOpacity onPress={() => (store.seedModal = true)}>
        <Text style={styles.textLoginStyle}>{lang.continue}</Text>
      </TouchableOpacity>
    );
  };
  const buttonPressLogout = store => {
    const onPress = () => {
      store.saveBtnSeed.pressing = true;
    };

    const logoutButton = store.saveBtnSeed.pressing
      ? store.saveBtnSeed.valueChange
      : store.saveBtnSeed.value;

    return (
      <GradientButton
        style={styles.gradientBtn2}
        text={lang.confirm}
        textStyle={{ fontSize: 18 }}
        gradientBegin="#74EBEE"
        gradientEnd="#009EFD"
        gradientDirection="diagonal"
        height={56}
        width={"100%"}
        radius={0}
        onPressAction={changePage("UniquePassword", false)}
      />
    );
  };

  const handleCloseModalPress = store => {
    return (
      <TouchableOpacity
        style={styles.btnClose}
        onPress={() => (store.seedModal = false)}
      >
        <Text style={styles.btnTextClose}>{lang.cancel}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {handleOpenModalPress(store)}
      <Modal isVisible={store.seedModal} hasBackdrop={true}>
        <View style={styles.modalContent}>
          <Text style={styles.textSnackBar}>
            {lang.phraseSafePlace}
          </Text>
          {buttonPressLogout(store)}
          {handleCloseModalPress(store)}
        </View>
      </Modal>
    </View>
  );
};
