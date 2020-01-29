import React from "react";
import {
  Content,
  ListItem,
  Left,
  Body,
  Right,
  Text,
  View,
  Title,
  Icon,
  Header,
  Separator,
  Button
} from "native-base";
import Switch from "react-native-switch-pro";
import styles from "../Styles.js";
import Footer from "./Footer.js";

const logout = store => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const logoutBtn = async () => {
    store.current.page = "locked";
  };

  return (
    <ListItem icon style={styles.heightListItem} last onPress={logoutBtn}>
      <Left>
        <Icon name="ios-log-out" />
      </Left>
      <Body style={styles.heightListItem}>
        <Text style={styles.numbersFaq1}>Log Out</Text>
      </Body>
      <Right style={styles.heightListItem} />
    </ListItem>
  );
};

export default ({ store }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  return (
    <View style={styles.container}>
    <View style={styles.viewFlex}>
      <Header style={styles.mtAndroid}>
        <Left style={styles.viewFlex} />
        <Body style={styles.viewFlex}>
          <Title style={styles.titleBlack}>Settings</Title>
        </Body>
        <Right style={styles.viewFlex} />
      </Header>

      <Content>
        <Separator bordered>
          <Text>Account Settings</Text>
        </Separator>
        <ListItem icon style={styles.heightListItem}>
          <Left>
            <Icon name="ios-contact" />
          </Left>
          <Body style={styles.heightListItem}>
            <Text style={styles.numbersFaq1}>{store.userName}</Text>
          </Body>
          <Right style={styles.heightListItem} />
        </ListItem>
        <ListItem icon style={styles.heightListItem}>
          <Left>
            <Icon name="ios-mail" />
          </Left>
          <Body style={styles.heightListItem}>
            <Text style={styles.constMail1}>
              {store.settingsInputMailField}
            </Text>
          </Body>
          <Right style={styles.heightListItem} />
        </ListItem>
        <Separator bordered>
          <Text>Get Help</Text>
        </Separator>
        <ListItem
          icon
          // onPress={changePage('FaqAll')}
          style={styles.heightListItem}
        >
          <Left>
            <Icon name="ios-help-circle-outline" />
          </Left>
          <Body style={styles.heightListItem}>
            <Text style={styles.numbersFaq1}>FAQ</Text>
          </Body>
          <Right style={styles.heightListItem}>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem>
        <ListItem
          icon
          // onPress={changePage('Support')}
          style={styles.heightListItem}
        >
          <Left>
            <Icon name="ios-text" />
          </Left>
          <Body style={styles.heightListItem}>
            <Text style={styles.numbersFaq1}>Support</Text>
          </Body>
          <Right style={styles.heightListItem}>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem>

        <Separator bordered>
          <Text>Security</Text>
        </Separator>

        

        {/* <ListItem icon style={styles.heightListItem} 
       onPress={changePage("SetupSeed")}
        >
          <Left>
            <Icon name="ios-paper" />
          </Left>
          <Body style={styles.heightListItem}>
            <Text>Edit Seed</Text>
          </Body>
          <Right style={styles.heightListItem}>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem> */}

        {logout(store)}
      </Content>
    </View>
    <Footer store={store}></Footer>
    </View>
  );
};
