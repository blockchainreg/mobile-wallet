import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Images from "../Images.js";
import styles from "../Styles.js";
import { ImageBackground } from "react-native";


export default ({ children }) => {
  return (
    <ImageBackground
    source={require("../assets/bg-mob.png")}
    style={[styles.fixedBg, styles.containterBg, {zIndex: -1}]}
    >
      {children}
    </ImageBackground>
  );
};
