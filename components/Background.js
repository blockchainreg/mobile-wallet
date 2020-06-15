import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Images from "../Images.js";
import styles from "../Styles.js";

var gradient = () => {
  return (
    <LinearGradient
      colors={[Images.color2, Images.color1]}
      start={{ x: 0.0, y: 0.1 }}
      end={{ x: 0.5, y: 1.0 }}
      locations={[0.0, 0.6]}
      style={styles.linearGradientBg}
    />
  );
};
var Shape = () => {
  return <View style={styles.square}>{gradient()}</View>;
};
var Shape2 = () => {
  return <View style={styles.square2}>{gradient()}</View>;
};
var Shape3 = () => {
  return <View style={styles.square3}>{gradient()}</View>;
};

export default ({ children }) => {
  return (
    <LinearGradient
      colors={[Images.color1, Images.color1, Images.color2]}
      style={styles.linearGradientBg}
    >
      {Shape3()}
      {Shape2()}
      <Image style={styles.logoTransparentBg} source={Images.logo} />
      {Shape()}
      <LinearGradient
        colors={[Images.color6, Images.color7]}
        style={styles.linearGradientBg}
      />
      {children}
    </LinearGradient>
  );
};
