import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default () => {
  const Web3 = require('web3');
  const Tx = require('ethereumjs-tx');
  const { BN } = require('ethereumjs-util');
  const hdkey = require('ethereumjs-wallet-react-native/hdkey.js');
  const bip39 = require('bip39');
  const bitcoinlib = require('bitcoinjs-lib');

  const web3 = new Web3('http://116.202.98.159:8545');
  web3.eth.accounts.wallet.clear();
  let accountFrom = web3.eth.accounts.privateKeyToAccount('0x247363AE44E13B581390E1D6121FAA72C52E52277963D26950273190D47836DC');
  let accountTo = web3.eth.accounts.privateKeyToAccount('0xDF01E1F30AF0839E3D50C09D5761F7B11E6928874ADEA3BDC1029697F8BA6011');
  web3.eth.accounts.wallet.add(accountFrom);
  web3.eth.accounts.wallet.add(accountTo);

  return class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillMount() {
      // const web3 = new Web3(
      //   new Web3.providers.HttpProvider('https://mainnet.infura.io/')
      // );
      web3.eth.getBlock('latest').then((latestBlock) => {
        this.setState({latestBlock});
      }, (error) => {
        this.setState({error: error.message});
      });
    }

    runTransaction = () => {
      this.setState({isRequestedTransaction: true});
      web3.eth.sendTransaction({
          from: accountFrom.address,
          to: accountTo.address,
          value: '11280000',
          gas: 21000,
          gasPrice: 8,
          chainId: 1,
      }).then((receipt) => {
        console.log("Got receipt", receipt);
        this.setState({receipt});
      }, (error) => {
        this.setState({error: error.message});
      });
    }

    render() {
      const {latestBlock, isRequestedTransaction, receipt, error} = this.state;
      if (error) {
        return (
          <View style={styles.container}>
            <Text>{error}</Text>
          </View>
        );
      }
      if (isRequestedTransaction) {
        if (receipt) {
          return (
            <View style={styles.container}>
              <Text>Latest block #{latestBlock ? latestBlock.number: "requesting.."}</Text>
              <Text>txhash: {receipt.transactionHash}</Text>
              <Text>Block #{receipt.blockNumber}</Text>
            </View>
          );
        }
        return (
          <View style={styles.container}>
            <Text>Latest block #{latestBlock ? latestBlock.number: "requesting.."}</Text>
            <Text>Running transaction</Text>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <Text>Latest block #{latestBlock ? latestBlock.number: "requesting.."}</Text>
          <Button
            title="Run transaction"
            onPress={this.runTransaction}
          />
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
