//import Bugsnag from '@bugsnag/expo';
import * as React from 'react';
import * as Font from 'expo-font';
import { View, Image, Text, SafeAreaView, TextInput } from 'react-native';
import { Input } from 'native-base';

import './global.js';
import prngSync from './prng-sync.js';
import localStoragePromise from './localStorage.js';
import styles from './Styles.js';
import { VelasLogo1 } from './svg/velas-logo1';
import { Bg } from './svg/bg.js';
import { initCrashreporting } from './utils/errors';
import { appUsageAnalyticsHoc } from './utils/usageAnalytics';

class App extends React.Component {
  state = {
    AppReady: null,
  };

  async loadFonts() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      'Nexa-Regular': require('./assets/fonts/NexaRegular.ttf'),
      'Nexa-Bold': require('./assets/fonts/Nexa-Bold.ttf'),
      'Nexa-Light': require('./assets/fonts/Nexa-Light.ttf'),
      'Nexa-Book': require('./assets/fonts/Nexa-Book.ttf'),
      'Fontfabric-NexaBold': require('./assets/fonts/Fontfabric-NexaBold.otf'),
      'Fontfabric-NexaRegular': require('./assets/fonts/Fontfabric-NexaRegular.otf'),
    });
  }

  componentWillUnmount() {
    this.setState({ AppReady: null });
  }

  componentDidMount() {
    Promise.all([prngSync, localStoragePromise, this.loadFonts()])
      .then(() => {
        this.setState({ AppReady: require('./App-ready.js').default });
      })
      .finally(initCrashreporting);
    if (Text.defaultProps == null) {
      Text.defaultProps = {};
    }
    Text.defaultProps.allowFontScaling = false;

    if (TextInput.defaultProps == null) {
      TextInput.defaultProps = {};
    }
    TextInput.defaultProps.allowFontScaling = false;

    if (Input.defaultProps == null) {
      Input.defaultProps = {};
    }
    Input.defaultProps.allowFontScaling = false;
  }

  render() {
    const { AppReady } = this.state;
    if (!AppReady) {
      return (
        <View style={[styles.viewFlex, { backgroundColor: '#05061f' }]}>
          <View style={styles.image}>
            <VelasLogo1
              style={styles.styleLogoHead}
              width="138"
              height="120"
              viewBox="0 0 138 120"
            />
            <Bg style={styles.bgMain} />
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.viewFlex, { backgroundColor: '#05061f' }]}>
        <SafeAreaView style={styles.safeArea}>
          <AppReady />
        </SafeAreaView>
      </View>
    );
  }
}

export default appUsageAnalyticsHoc(App);

class ErrorView extends React.Component {
  render() {
    return (
      <View style={[styles.viewFlex, { backgroundColor: '#05061f' }]}>
        <Text>Error occured</Text>
      </View>
    );
  }
}
