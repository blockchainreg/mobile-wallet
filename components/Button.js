import React, {useEffect} from "react";
import {BackHandler} from "react-native";
import {Button, Icon} from "native-base";

import styles from "../Styles.js";

export default ({ store, classes, text, loading, onClick, icon, type, mstyle, id, error, makeDisabled, noIcon }) => {
  const back = () => {
    onBack();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', back);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', back);
    };
  });
  return (
    <Button
      transparent
      style={styles.arrowHeaderLeft}
      onPress={onBack}
    >
      <Icon
        name="ios-arrow-back"
        style={style || [styles.arrowHeaderIconBlack, { color: "#fff" }]}
      />
    </Button>
  );
};
