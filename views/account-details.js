import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Clipboard } from 'react-native';
import TransactionSend from './transaction-send.js';

export default class IndexSelection extends React.Component {
  state = {
    balance: null,
    account: null,
    messages: []
  };

  showMessage(text) {
    const message = {text};
    this.setState({messages: [...this.state.messages, message]});
    message.timeout = setTimeout( () => {
      const messagesCopy = [...this.state.messages];
      const index = messagesCopy.indexOf(message);
      if (index === -1) {
        return;
      }
      messagesCopy.splice(index, 1);
      this.setState({messages: messagesCopy});
    }, 1000);
  }

  copyAddress = () => {
    const {account} = this.state;
    if (!account) {
      return;
    }
    Clipboard.setString(account.address);
    this.showMessage("Address copied to Clipboard");
  }

  queryBalance = () => {
    const {account, balance} = this.state;
    const {web3t, currency} = this.props;
    if (balance !== null) {
      this.setState({balance: null});
    }
    web3t[currency].getBalance({account}, (err, balance) => {
      if (err) {
        this.setState({error: err.message});
      } else {
        this.setState({balance});
      }
    });
  }

  send = () => {
    this.setState({send: true});
  }

  onReturn = () => {
    this.setState({send: false});
  }

  componentWillUnmount() {
    for (let message of this.state.messages) {
      clearTimeout(message.timeout);
    }
  }

  componentWillMount() {
    const {mnemonic, web3t, currency, index} = this.props;
    web3t[currency].createAccount(
      {mnemonic, index},
      (err, account) => {
        if (err) {
          this.setState({error: err.message});
        } else {
          this.setState({account}, this.queryBalance);
        }
      }
    );
    console.log('Component mounting');
  }

  renderMessages() {
    return this.state.messages.map(({text, timeout}) =>
      <Text key={timeout}>{text}</Text>
    );
  }

  renderSendButton() {
    if (!this.state.balance) {
      return null;
    }
    return <Button
      title="Send"
      onPress={this.send}
    />;
  }

  render() {
    const {mnemonic, web3t, currency, index} = this.props;
    const {account, balance, error, send} = this.state;
    if (send) {
      return <TransactionSend
        mnemonic={mnemonic}
        web3t={web3t}
        currency={currency}
        index={index}
        account={account}
        onReturn={this.onReturn}
      />;
    }
    return (
      <View style={styles.container}>
        <Button
            title="Back"
            onPress={this.props.onReturn}
        />
        <Text onPress={this.copyAddress}>Address: {account ? account.address : "..."}</Text>
        <Text>Balance: {balance !== null? balance : "..."}</Text>
        <Button
            title="Refresh balance"
            onPress={this.queryBalance}
        />
        <Text>{error}</Text>
        {this.renderMessages()}
        {this.renderSendButton()}
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
