import React, { Component } from "react"; //import react in our code.
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
import styles from "../Styles.js";
import moment from "moment";

const openInfoModal = (store, item) => {
  this.props.store.infoTransaction = item;
  return this.modal && this.modal.show();
};

const checkType = type => {
  switch (type) {
    case "IN":
      return <Text style={styles.txtSizeHistory}>Receive</Text>;
    case "OUT":
      return <Text style={styles.txtSizeHistory}>Sent</Text>;
    case "EXCHANGE":
      return <Text style={styles.txtSizeHistory}>Exchange</Text>;
    case "INTERNAL_MOVEMENT":
      // return <Text style={styles.txtSizeHistory}>From: </Text>;
      return <Text style={styles.txtSizeHistory}>Internal Movement </Text>;
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
    this.state = {
      loading: true,
      serverData: [],
      fetching_from_server: false
    };
    this.offset = 1;
  }

  componentDidMount() {}

  loadMoreData = () => {
    this.setState({ fetching_from_server: true }, () => {});
  };

  onClick = transaction => {
    this.props.store.infoTransaction = transaction;
    return this.props.modalRef.current && this.props.modalRef.current.show();
  };

  render() {
    const {store} = this.props;
    return (
      <View style={styles.container}>
        {!store.transactions || !store.transactions.all ? (
          <ActivityIndicator color="#707070" />
        ) : (
          <View>
            {store.transactions.all.length <= 0 && (
              <View style={styles.footer}>
                <Text style={styles.textContainer}>
                  Oops! You have no more transactions
                </Text>
              </View>
            )}
            <List>
              {store.transactions.all.map(transaction => (
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
                      {/* {transaction} */}
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
            {/*store.transactions.all.length >= 10 && (
              <View style={styles.footer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.loadMoreData}
                  style={styles.loadMoreBtn}
                >
                  <Text style={styles.btnText}>Load More...</Text>
                  {this.state.fetching_from_server ? (
                    <ActivityIndicator color="#707070" style={{ marginLeft: 8 }} />
                  ) : null}
                </TouchableOpacity>
              </View>
            )*/}
          </View>
        )}
      </View>
    );
  }
}
