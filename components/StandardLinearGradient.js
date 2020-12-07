import { LinearGradient } from "expo-linear-gradient";
import styles from "../Styles.js";
import React from "react";
import { ImageBackground,View } from "react-native";
import getLang from '../wallet/get-lang.js';

export default ({ children }) => {
  return (
    // <ImageBackground
    // source={require("../assets/bg-mob.png")}
    // style={[styles.fixedBg, styles.containterBg1, {zIndex: -1}]}
    // >
    //   {children}
    // </ImageBackground>
    <View style={[styles.colorBg, styles.fixedBg, styles.containterBg1, {zIndex: -1}]}>
      {children}
    </View>
   
  );
};
