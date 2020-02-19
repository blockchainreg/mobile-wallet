import "./global.js";
import prngSync from "./prng-sync.js";
import localStoragePromise from "./localStorage.js";
import * as React from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import styles from "./Styles.js";
import Images from "./Images.js";

export default class App extends React.Component {
  state = {
    AppReady: null
  };

  componentDidMount() {
    setTimeout(() => {
      Promise.all([prngSync, localStoragePromise]).then(() => {
        this.setState({ AppReady: require("./App-ready.js").default });
      });
    }, 1500);  



  }

  render() {
    const { AppReady } = this.state;
    if (!AppReady) {
      return (
        <View>
          <ImageBackground
            source={Images.backgroundImage}
            style={styles.bgMainPage}
          >
            <Image source={Images.logo} style={styles.styleLogoHead} />
            <Text>...</Text>
          </ImageBackground>
        </View>
      );
    }
    return <AppReady />;
  }
}
