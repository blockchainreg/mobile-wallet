import React from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import MnemonicSelection from './mnemonic-selection.js';

const networks = ["mainnet", "testnet"];

export default class NetworkSelection extends React.Component {
  state = {
    selectedNetwork: null,
    web3t: null
  };

  selectNetwork = (selectedNetwork) => {
    this.setState({selectedNetwork});
    this.props.web3tbuilder(selectedNetwork, (err, web3t) => {
      if (err) {
        this.setState({error: err.message});
        return;
      }
      this.setState({web3t});
    });
  }

  onReturn = () => {
    this.setState({selectedNetwork: null, web3t: null});
  }

  renderButtons() {
    return (
      networks.map((network) =>
        <Button
            title={network.toUpperCase()}
            onPress={() => {this.selectNetwork(network);}}
            key={network}
        />
      )
    );
  }

  render() {
    const {web3tbuilder} = this.props;
    const {selectedNetwork, web3t, error} = this.state;

    if (error) {
      return (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      );
    }

    if (web3t) {
      return <MnemonicSelection
          web3t={web3t}
          onReturn={this.onReturn}
      />;
    }

    if (selectedNetwork) {
      return (
        <View style={styles.container}>
          <Text>Building {selectedNetwork}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text>Select Network</Text>
        {this.renderButtons()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
