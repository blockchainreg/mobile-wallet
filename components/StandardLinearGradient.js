import { LinearGradient } from "expo-linear-gradient";
import styles from "../Styles.js";
import React from "react";
import { ImageBackground } from "react-native";
import getLang from '../wallet/get-lang.js';

export default ({ children }) => {
  return (
    <LinearGradient
      // colors={['#5038AC', '#8D53E4', '#D8A9FF']}
      colors={['#15063c', '#331462']}
      start={[0.9, 0.3]}
      end={[0.1, 0.1]}
      style={styles.linearGradientNew}>
      {children}
    </LinearGradient>
    // <ImageBackground
    // source={require("../assets/intro-bg.jpg")}
    // style={{ width: "100%", height: "100%" }}
    // >
    //   {children}
    // </ImageBackground>
  );
};
