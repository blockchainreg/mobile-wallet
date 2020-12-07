import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, StyleSheet, Image, Platform } from "react-native";
import Images from "../Images.js";
import styles from "../Styles.js";
import { ImageBackground } from "react-native";


export default ({ children, fullscreen }) => {
  return (
    // <ImageBackground
    // source={require("../assets/bg-mob.jpg")}
    // style={[styles.fixedBg, styles.containterBg, {zIndex: -1, top: fullscreen && Platform.OS === "android" ? 0:0}]} 
    // >
    //   {children}
    // </ImageBackground>
    <View style={[styles.colorBg, styles.fixedBg, styles.containterBg1]}>
      {children}
    </View>
    
  );
};
