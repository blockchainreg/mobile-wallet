import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AccountDetails from './account-details.js';

export default class IndexSelection extends React.Component {
  state = {
    index: 0,
    isSelected: false
  };

  onReturn = () => {
    this.setState({isSelected: false});
  }

  onChangeIndex = (indexStr) => {
    let index = parseInt(indexStr)
    if (isNaN(index) || index < 0) {
      index = 0;
    }
    this.setState({index});
  }

  onOkPress = () => {
    this.setState({
      isSelected: true
    });
  }

  render() {
    const {mnemonic, web3t, currency} = this.props;
    const {index, isSelected} = this.state;

    if (isSelected) {
      return <AccountDetails
          mnemonic={mnemonic}
          web3t={web3t}
          currency={currency}
          index={index}
          onReturn={this.onReturn}
      />;
    }
    return (
      <View style={styles.container}>
        <Button
            title="Back"
            onPress={this.props.onReturn}
        />
        <Text>Select address index</Text>
        <TextInput
            autoFocus
            value={index + ""}
            onChangeText={this.onChangeIndex}
        />
        <Button
            title="OK"
            onPress={this.onOkPress}
        />
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
