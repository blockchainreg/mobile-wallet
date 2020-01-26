import React from 'react';
import { View } from 'native-base';
import { Image, ImageBackground } from 'react-native';
import styles from '../Styles.js';

export default ({ store }) => {
  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={require("../assets/intro-bg.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.containerCenter1}>
        <Image
            source={require("../assets/purpur-logo-velas.png")}
            style={{ height: 250/1.5, width: 276/1.5 }}
          />
        </View>
        </ImageBackground>
    </View>
  );
};
