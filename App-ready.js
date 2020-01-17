import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import NetworkSelection from './views/network-selection.js';

export default () => {
  const buildWeb3t = require('web3t');

  return class App extends React.Component {
    render() {
      return <NetworkSelection web3tbuilder={buildWeb3t} />;
    }
  }
};
