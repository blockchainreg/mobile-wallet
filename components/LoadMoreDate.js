import React, { Component } from "react"; //import react in our code.
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { List, ListItem, Left, Body, Right, Thumbnail, Header, Item, Icon, Button, Input } from "native-base";
import styles from "../Styles.js";
import moment from "moment";
import Images from "../Images.js";
import applyTransactions from '../wallet/apply-transactions.js';
import getLang from '../wallet/get-lang.js';

export default ({ store, web3t }) => {
    const lang = getLang(store);
    const checkType = type => {
      switch (type) {
        case "IN":
          return <Text style={styles.txtSizeHistory}>{lang.receive}</Text>;
        case "OUT":
          return <Text style={styles.txtSizeHistory}>{lang.sent}</Text>;
        default:
          return null;
      }
    };

    const index = type => {
      if (type === "IN") return null;
      else if (type === "OUT") return <Text>-</Text>;
    };
    const amountStyle = type => {
      if (type === "IN") return styles.styleCoinIn;
      else if (type === "OUT") return styles.styleCoinOut;
    };
    const thumbnail = type => {
      switch (type) {
        case "IN":
          return <Thumbnail small source={Images.depositImage} />;
        case "OUT":
          return (
            <Thumbnail small source={Images.withdrawImage2} />
          );
        default:
          return null;
      }
    };

    const txs = store.transactions.applied;

    const showTransaction = (transaction) => {
        store.infoTransaction = transaction;
    };

    const applyFilter = () => {
        store.current.filterVal.apply = store.current.filterVal.temp;
        applyTransactions(store);
    }

    const changeSearch = (e) => {
        store.current.filterVal.temp = e;
    }

    const clearFilter = () => {
        store.current.filterVal.temp = "";
        store.current.filterVal.apply = "";
        applyTransactions(store);
    }

    return (
      <View style={styles.container}>

        {store.history.filterOpen ? (
          <Header searchBar rounded style={{ paddingBottom: 20, height: 40 }}>
                <Item>
                  <Icon name="ios-search" />
                  <Input placeholder="Search" value={store.current.filterVal.temp} onChangeText={changeSearch} />
                  <Icon name="ios-trash" onPress={clearFilter} />
                </Item>
                <Button transparent onPress={applyFilter}>
                  <Text>{lang.filter}</Text>
                </Button>
          </Header>
        ) : null}

        {store.current.refreshing ? (
          <ActivityIndicator color="#707070" />
        ) : (
          <View>
            {txs.length == 0 && (
              <View style={styles.footer}>
                <Image
                source={Images.trx}
                style={styles.styleLogo}
                />
                {/* <Text style={styles.textContainer}>
                {lang.nothingToShow}
                </Text> */}
              </View>
            )}


            <List>
              {txs.map(transaction => (
                //{ token, tx, amount, fee, time, url, type, pending } = tran
                <ListItem
                  thumbnail
                  onPress={() => {
                    showTransaction(transaction);
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
                    <Text style={amountStyle(transaction.type)}>
                      {index(transaction.type)}
                      {transaction.amount} {transaction.token.toUpperCase()}
                    </Text>
                    <Text style={styles.constDate}>
                    ({lang.fee}: {transaction.fee}{" "}{transaction.token.toUpperCase()})
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
