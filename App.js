import "./global.js";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import prngReady from "./prng-sync.js";
import appReady from "./App-ready.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPrngInited: false
    };
  }

  componentWillMount() {
    prngReady.then(() => {
      this.setState({isPrngInited: true});
    });
  }

  render() {
    const {isPrngInited} = this.state;
    if (isPrngInited) {
      const AppReady = appReady();
      return <AppReady />;
    }
    return (
      <View style={styles.container}>
        <Text>Waiting for prng</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
