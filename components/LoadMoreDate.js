import React, { Component } from "react"; //import react in our code.
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
import styles from "../Styles.js";
import moment from "moment";

const checkType = type => {
  switch (type) {
    case "IN":
      return <Text style={styles.txtSizeHistory}>Receive</Text>;
    case "OUT":
      return <Text style={styles.txtSizeHistory}>Sent</Text>;
    case "EXCHANGE":
      return <Text style={styles.txtSizeHistory}>Exchange</Text>;
    case "INTERNAL_MOVEMENT":
      return <Text style={styles.txtSizeHistory}>Internal Movement</Text>;
    default:
      return null;
  }
};

const index = type => {
  if (type === "IN") return <Text>+</Text>;
  else if (type === "OUT") return <Text>-</Text>;
};
const thumbnail = type => {
  switch (type) {
    case "IN":
      return <Thumbnail small source={require("../assets/DEPOSIT-icon.png")} />;
    case "OUT":
      return (
        <Thumbnail small source={require("../assets/WITHDRAWAL-icon.png")} />
      );
    case "EXCHANGE":
      return (
        <Thumbnail small source={require("../assets/EXCHANGE-icon.png")} />
      );
    case "INTERNAL_MOVEMENT":
      return (
        <Thumbnail
          small
          source={require("../assets/INTERNAL_MOVEMENT-icon.png")}
        />
      );
    default:
      return null;
  }
};

export default class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  onClick = transaction => {
    this.props.store.infoTransaction = transaction;
    return this.props.modalRef.current && this.props.modalRef.current.show();
  };

  render() {
    const txs = this.props.store.transactions.applied;

    //{ coins, cut-tx, arrow, delete-pending-tx, amount-beautify, ago } = history-funcs store, web3t
    return (
      <View style={styles.container}>
        {this.props.store.current.refreshing ? (
          <ActivityIndicator color="#707070" />
        ) : (
          <View>
            {txs.length == 0 && (
              <View style={styles.footer}>
                <Text style={styles.textContainer}>
                  Oops! You have no any transaction yet
                </Text>
              </View>
            )}
            <List>
              {txs.map(transaction => (
                //{ token, tx, amount, fee, time, url, type, pending } = tran
                <ListItem
                  thumbnail
                  onPress={() => {
                    this.onClick(transaction);
                  }}
                  key={transaction.tx}
                >
                  <Left>{thumbnail(transaction.type)}</Left>
                  <Body style={{ paddingRight: 10 }}>
                    <Text style={styles.txtSizeHistory}>
                      {checkType(transaction.type)}
                    </Text>
                    <Text style={styles.constDate}>
                      {moment(transaction.time * 1000).format(
                        "MMM D YYYY h:mm A"
                      )}
                    </Text>
                  </Body>
                  <Right>
                    <Text style={styles.txtSizeHistory}>
                      {index(transaction.type)}
                      {transaction.amount} {transaction.token}
                    </Text>
                    <Text style={styles.constDate}>
                    (fee: {transaction.fee}{" "}{transaction.token})
                    </Text>
                  </Right>
                </ListItem>
              ))}
            </List>
          </View>
        )}
      </View>
    );
  }
}
