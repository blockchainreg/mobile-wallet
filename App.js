import "./global.js";
import prngSync from './prng-sync.js';
import * as React from "react";
import { View, Text } from "react-native";

export default class App extends React.Component {
  state = {
    AppReady: null
  }

  componentDidMount() {
      prngSync.then(() => {
        this.setState({AppReady: require("./App-ready.js").default});
      });
  }


  render() {
    const {AppReady} = this.state;
    if (!AppReady) {
      return <View><Text>...</Text></View>;
    }
    return (
      <AppReady />
    );
  }
}
