import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import IndexSelection from './index-selection.js';

export default class CurrencySelection extends React.Component {
  state = {
    selectedCurrency: null
  };

  selectCurrency = (selectedCurrency) => {
    this.setState({selectedCurrency});
  }

  onReturn = () => {
    this.setState({selectedCurrency: null});
  }

  renderButtons() {
    const {web3t} = this.props;
    return (
      Object.keys(web3t).map((currency) =>
        <Button
            title={currency.toUpperCase()}
            onPress={() => {this.selectCurrency(currency);}}
            key={currency}
        />
      )
    );
  }

  render() {
    const {mnemonic, web3t} = this.props;
    const {selectedCurrency} = this.state;

    if (selectedCurrency) {
      return <IndexSelection
          mnemonic={mnemonic}
          currency={selectedCurrency}
          web3t={web3t}
          onReturn={this.onReturn}
      />;
    }

    return (
      <View style={styles.container}>
        <Button
            title="Back"
            onPress={this.props.onReturn}
        />
        <Text>Select Currency</Text>
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
