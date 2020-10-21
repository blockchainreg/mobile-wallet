import * as Font from "expo-font";
import "./global.js";
import prngSync from "./prng-sync.js";
import localStoragePromise from "./localStorage.js";
import * as React from "react";
import { View, Image, Text } from "react-native";
import styles from "./Styles.js";
import Images from "./Images.js";
import Background from "./components/Background.js"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
        <View style={[styles.bgMainPage, {backgroundColor: "#0A0D4D"}]}>
          <Background fullscreen={true}/>
            <Image source={Images.logo} style={styles.styleLogoHead} />
        </View>
      );
    }
    return (
      <View style={[styles.containterBg, {backgroundColor: "#0A0D4D"}]}>
        <AppReady />
      </View>
    );
  }
}
