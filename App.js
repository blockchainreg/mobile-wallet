import * as Font from "expo-font";
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

  async loadFonts() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  componentDidMount() {
    // TODO: Comment why this timeout is needed or remove
    // setTimeout(() => {
      Promise.all([prngSync, localStoragePromise, this.loadFonts()]).then(() => {
        this.setState({ AppReady: require("./App-ready.js").default });
      });
    // }, 1500);



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
            {/* <Text>...</Text> */}
          </ImageBackground>
        </View>
      );
    }
    return (
      <View style={{
        width: "100%",
        height: "100%"
        }}>
        <AppReady />
      </View>
    );
  }
}
