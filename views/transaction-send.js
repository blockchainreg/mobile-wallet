import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Clipboard, Alert } from 'react-native';

export default class TransactionSend extends React.Component {
  state = {
    addressTo: "",
    amount: "0",
    sending: false,
    addressValid: true,
    isCalculatingFee: false,
    isNeedUpdateFee: false,
    balance: null,
    fee: null,
    error: null
  }

  onChangeAddressTo = (addressTo) => {
    this.setState({addressTo, addressValid: true});
    this.updateFee();
  }

  onChangeAmount = (amountString) => {
    let amount = parseFloat(amountString);
    if (isNaN(amount) || amount < 0) {
      this.setState({amount: "0"});
      return;
    }
    this.setState({amount: amountString});
    this.updateFee();
  }

  updateFee = () => {
    const {web3t, currency, account} = this.props;
    const {addressTo, amount, isCalculatingFee} = this.state;
    if (isCalculatingFee) {
      this.setState({isNeedUpdateFee: true});
      return;
    }

    this.setState({isCalculatingFee: true});

    web3t[currency].calcFee({ account, addressTo, amount: parseFloat(amount) | 0}, (err, fee) => {
      console.log(`CalcFee: ${err && err.message} ${fee}`);
      if (err) {
        this.setState({error: err.message, isCalculatingFee: false});
        return;
      }
      if (this.state.isNeedUpdateFee) {
        this.setState({
          isCalculatingFee: false,
          isNeedUpdateFee: false,
          fee
        }, this.updateFee);
        return;
      }
      this.setState({
        isCalculatingFee: false,
        isNeedUpdateFee: false,
        fee
      });
    });
  }

  confirmSend = () => {
    const {web3t, currency, account} = this.props;
    const {addressTo, amount, sending} = this.state;
    if (sending) {
      return;
    }
    this.setState({sending: true});
    web3t[currency].sendTransaction({to: addressTo, amount: parseFloat(amount), account}, (err, tx) => {
      if (err) {
        this.setState({error: err.message});
        return;
      }
      this.setState({tx});
    });
  }

  copyTx = () => {
    Clipboard.setString(this.state.tx);
    Alert.alert('Copy', 'Your transaction hash copied to Clipboard');
  }

  queryBalance = () => {
    const {balance} = this.state;
    const {web3t, currency, account} = this.props;
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

  componentDidMount() {
    this.queryBalance();
    this.updateFee();
  }

  renderSendButton() {
    const {addressValid, amount, sending} = this.state;
    if (!addressValid || !parseFloat(amount) || sending) {
      return null;
    }
    return <Button
        title="Confirm"
        onPress={this.confirmSend}
    />;
  }

  render() {
    const {addressTo, amount, error, tx, balance, fee, sending} = this.state;
    if (tx) {
      return (
        <View style={styles.container}>
          <Button
              title="Back"
              onPress={this.props.onReturn}
          />
          <Text>Send completed</Text>
          <Text onPress={this.copyTx}>{tx}</Text>
        </View>
      );
    }
    if (sending) {
      return (
        <View style={styles.container}>
          <Text>Sending...</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Button
            title="Back"
            onPress={this.props.onReturn}
        />

        <Text>Destination address</Text>
        <TextInput
            value={addressTo}
            onChangeText={this.onChangeAddressTo}
        />
        <Text>Fee: {fee === null ? "..." : fee}</Text>
        <Text>Balance: {balance === null ? "..." : balance}</Text>
        <Button
          title="Refresh balance"
          onPress={this.queryBalance}
        />
        <Text>Amount</Text>
        <TextInput
            value={amount+""}
            onChangeText={this.onChangeAmount}
        />
        {this.renderSendButton()}
        <Text>{error}</Text>
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
