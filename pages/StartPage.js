import React from 'react';
import { View } from 'native-base';
import { Image, ImageBackground } from 'react-native';
import styles from '../Styles.js';
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';


export default ({ store }) => {
  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={Images.backgroundImage}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.containerCenter1}>
        <Image
            source={require("../assets/purpur-logo-velas.png")}
            style={{ height: 250/1.5, width: 276/1.5, backgroundColor: "#00FF00" }}
          />
        </View>
        </ImageBackground>
    </View>
  );
};
