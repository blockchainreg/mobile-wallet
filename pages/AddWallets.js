import React from "react";
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  View,
  Title,
  Icon,
  Content,
  Header
} from "native-base";
import styles from "../Styles.js";
import { ScrollView, TouchableOpacity } from "react-native";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import RefreshControl from "../components/RefreshControl.js";
import Toast from "@rimiti/react-native-toastify";
import StatusBar from "../components/StatusBar.js";

//
import dash from '../registry/dash.json';
import etc from '../registry/etc.json';
import eth from '../registry/eth.json';
import ltc from '../registry/ltc.json';
import usdt from '../registry/usdt.json';
import usdt_erc20 from '../registry/usdt_erc20.json';
//

const coinItems = [ dash, etc, eth, ltc, usdt, usdt_erc20 ];

const wallets = (store, web3t) => {
  
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  
  const renderCoin = item => {
     const add = () => {
        web3t.installQuick(item, (err, data) => {
            console.log("install", err, data);
            store.current.page = "wallets";
        })
     }

     return (
      <ListItem
          thumbnail
          style={styles.mbListItem}
          onPress={add}
        >
          <Left>
            <Thumbnail source={{uri: item.image}} />
          </Left>
          <Body>
          <Text note/>

            <Text style={styles.amountView}>
              {item.token}
            </Text>
            <Text note/>
          </Body>
          <Right>
          <Button transparent onPress={add}>
              <Icon name="ios-add" style={styles.iconBtn} />
            </Button>
            
          </Right>
        </ListItem>
    )
  }

  
  return (
    <Content>
      <List>
        {coinItems.map(renderCoin)}
      </List>
    </Content>
  );
};

export default ({ store, web3t }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const calcUsd = 0;
  const refreshToken = async bool => {

  };
  const checkType = type => {
    switch (type) {
      case "USD":
        return <Text style={styles.textCurrency}>$</Text>;
      default:
        return null;
    }
  };

  return (
    <View style={styles.viewFlex}>
      {/* <StatusBar /> */}
      <StandardLinearGradient>
        <RefreshControl swipeRefresh={refreshToken}>
          <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex}>
            <Button
              transparent
              style={styles.arrowHeaderLeft}
              onPress={changePage("wallets")}
            >
              <Icon name="ios-arrow-back" style={[styles.arrowHeaderIconBlack, {color: '#fff'}]} />
            </Button>
          </Left>
            <Body style={styles.viewFlex}>
              <Title style={styles.title1}>Add Wallets</Title>
            </Body>
            {/* <Right style={styles.viewFlex}><Button transparent><Icon name="ios-add" style={{color: '#fff'}}></Icon></Button></Right> */}
            <Right style={styles.viewFlex} />
          </Header>
        </RefreshControl>
      </StandardLinearGradient>
      <View style={styles.viewMonoWallets}>
        <View style={styles.viewPt} />
        <ScrollView>{wallets(store, web3t)}</ScrollView>
      </View>
    </View>
  );
};
