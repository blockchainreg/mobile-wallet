import './global';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const { BN } = require('ethereumjs-util');
const hdkey = require('ethereumjs-wallet-react-native/hdkey.js');
//const bip39 = require('react-native-bip39');
//const bitcoinlib = require('rn-bitcoinjs-lib');

export default class App extends React.Component {
  componentWillMount() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider('https://mainnet.infura.io/')
    );
  
    web3.eth.getBlock('latest').then(console.log)
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Check your console</Text>
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
