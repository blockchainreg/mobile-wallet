import "./global.js";
import prngSync from "./prng-sync.js";
import localStoragePromise from "./localStorage.js";
import * as React from "react";
import { View, Text, ImageBackground } from "react-native";
import styles from "./Styles.js";

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
            source={require("./assets/start-page.jpg")}
            style={styles.bgMainPage}
          >
            <Text>...</Text>
          </ImageBackground>
        </View>
      );
    }
    return <AppReady />;
  }
}
