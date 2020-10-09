import React, { Component } from "react"; //import react in our code.
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Platform } from "react-native";
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
          return <Text style={styles.txtSizeHistory}>{lang.received}</Text>;
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
          return <Thumbnail small square source={Images.depositImage} />;
        case "OUT":
          return (
            <Thumbnail small square source={Images.withdrawImage2} />
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
          <Header searchBar style={styles.headerSearchBar}>
                <Item style={{ backgroundColor: Images.color4}}>
                  <Icon name="ios-search" style={{ color: "#fff"}}/>
                  <Input
                    placeholder="Search"
                    value={store.current.filterVal.temp}
                    placeholderTextColor="#fff"
                    onChangeText={changeSearch}
                    selectionColor={"#fff"}
                    style={{ color: "#fff", backgroundColor: "transparent"}}
                  />
                  <Icon name="ios-trash" onPress={clearFilter} style={{ color: "#fff"}}/>
                </Item>
                <Button transparent onPress={applyFilter}>
                  <Text style={{ color: "#fff"}}>{lang.filter}</Text>
                </Button>
          </Header>
        ) : null}

        {store.current.refreshing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View>
            {txs.length == 0 && (
              <View style={styles.footer}>
                <Image
                source={Images.trx}
                style={styles.styleLogo}
                />
              </View>
            )}


            <List>
              {txs.map(transaction => (
                //{ token, tx, amount, fee, time, url, type, pending } = tran
                <ListItem
                  thumbnail
                  underlayColor={Images.color1}
                  onPress={() => {
                    showTransaction(transaction);
                  }}
                  key={transaction.tx+transaction.type}
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
                      {parseFloat(transaction.amount).toFixed(5)}{"\u00A0"}{transaction.token.toUpperCase()}{Platform.OS === "android" ? "\u00A0\u00A0" : null}
                    </Text>
                    <Text style={styles.constDate}>
                    ({lang.fee}: {Math.floor(transaction.fee)}{" "}{transaction.token.toUpperCase()}){Platform.OS === "android" ? "\u00A0\u00A0" : null}
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
