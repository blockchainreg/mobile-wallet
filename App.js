import Bugsnag from '@bugsnag/expo';
Bugsnag.start();

import * as Font from "expo-font";
import "./global.js";
import prngSync from "./prng-sync.js";
import localStoragePromise from "./localStorage.js";
import * as React from "react";
import { View, Image, Text, ImageBackground } from "react-native";
import styles from "./Styles.js";
import Images from "./Images.js";
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

class App extends React.Component {
  state = {
    AppReady: null,
  };


  async loadFonts() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      'Nexa-Regular': require("./assets/fonts/NexaRegular.ttf"),
      'Nexa-Bold': require("./assets/fonts/Nexa-Bold.ttf"),
      'Nexa-Light': require("./assets/fonts/Nexa-Light.ttf"),
      'Nexa-Book': require("./assets/fonts/Nexa-Book.ttf"),
      'Fontfabric-NexaBold': require("./assets/fonts/Fontfabric-NexaBold.otf"),
      'Fontfabric-NexaRegular': require("./assets/fonts/Fontfabric-NexaRegular.otf"),
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
        <View style={[styles.viewFlex, {backgroundColor: '#05061f'}]}>
        <ImageBackground source={Images.bg} style={styles.image}>

          {/* <Background fullscreen={true}/> */}
            <Image source={Images.logo} style={styles.styleLogoHead} />
            </ImageBackground>
        </View>
      );
    }
    return (
      <View style={[styles.viewFlex, {backgroundColor: '#05061f'}]}>
        <AppReady />
      </View>
    );
  }
}

export default () => (
  <ErrorBoundary FallbackComponent={ErrorView}>
    <App />
  </ErrorBoundary>
);

class ErrorView extends React.Component {
  render() {
    return (
      <View style={[styles.viewFlex, {backgroundColor: '#05061f'}]}>
        <Text>Error occured</Text>
      </View>
    );
  }
}
