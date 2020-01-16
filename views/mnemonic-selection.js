import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import CurrencySelection from './currency-selection.js';

export default class MnemonicSelection extends React.Component {
  state = {
    mnemonic: "demand time hero together space blur test fatal mistake leaf rigid that",
    status: "editing"
  };

  onChangeMnemonic = (mnemonic) => {
    this.setState({mnemonic});
  }

  setMnemonic = () => {
    this.setState({status: "set"});
  }

  onReturn = () => {
    this.setState({status: "editing"});
  }

  renderEditing() {
    const {mnemonic} = this.state;
    return (
      <View style={styles.container}>
        <Text>Your mnemonic phrase:</Text>
        <TextInput
            style={styles.textInput}
            autoFocus
            editable
            multiline
            maxLength={400}
            numberOfLines={4}
            onChangeText={this.onChangeMnemonic}
            value={mnemonic}
        />
        <Button
          title="Set mnemonic"
          onPress={this.setMnemonic}
        />
      </View>
    );
  }

  renderError() {
    const {error} = this.state;
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  render() {
    const {mnemonic, status} = this.state;
    const {web3t} = this.props;
    switch(status) {
      case "editing":
        return this.renderEditing();
      case "error":
        return this.renderError();
      case "set":
        return <CurrencySelection
            mnemonic={mnemonic}
            web3t={web3t}
            onReturn={this.onReturn}
        />;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  textInput: {
    borderColor: '#000000',
    borderWidth: 1,
  }
});
