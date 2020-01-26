import React, { Component } from "react";//import react in our code.
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail
} from "native-base";
import styles from "../Styles.js";
import moment from "moment";


const openInfoModal = (store, item) => {
  this.props.store.infoTransaction = item;
  return this.modal.show();
};

const checkType = (type) => {
  switch (type) {
    case "DEPOSIT":
      return <Text style={styles.txtSizeHistory}>Receive</Text>;
    case "WITHDRAWAL":
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

const thumbnail = type => {
  switch (type) {
    case "DEPOSIT":
      return <Thumbnail small source={require('../assets/DEPOSIT-icon.png')} />
    case "WITHDRAWAL":
      return <Thumbnail small source={require('../assets/WITHDRAWAL-icon.png')} />
    case "EXCHANGE":
      return <Thumbnail small source={require('../assets/EXCHANGE-icon.png')} />
    case "INTERNAL_MOVEMENT":
      return <Thumbnail small source={require('../assets/INTERNAL_MOVEMENT-icon.png')} />
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

  componentDidMount() {
  }

  loadMoreData = () => {
    this.setState({ fetching_from_server: true }, () => {
    });
  };

  onClick = transaction => {
    this.props.store.infoTransaction = transaction;
    return this.props.modalRef.show();
  };

  

  render() {
    
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator color="#707070" />
        ) : (
          <View>
            {this.state.serverData.length <= 0 && (
              <View style={styles.footer}>
                  <Text style={styles.textContainer}>Oops! You have no more transactions</Text>
              </View>
            )}
            <List>
              {this.state.serverData.map(transaction => (
                <ListItem
                  thumbnail
                  onPress={() => {
                    this.onClick(transaction);
                  }}
                  key={transaction.id}
                >
                  <Left>{thumbnail(transaction.order_type)}</Left> 
                  <Body style={{ paddingRight: 10}}>
                  <Text style={styles.txtSizeHistory}>{checkType(transaction.order_type)}
                  {/* {transaction} */}
                  </Text>
                    <Text style={styles.constDate}>
                      {moment(transaction.dt).format("MMM D YYYY h:mm A")}
                    </Text>
                  </Body>
                  <Right>
                    <Text style={styles.txtSizeHistory}>
                    {transaction.amount} {transaction.currency}
                    </Text>
                  </Right>
                </ListItem>
              ))}
            </List>
            {this.state.serverData.length >= 10 && (
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
            )}
          </View>
        )}
      </View>
    );
  }
}

