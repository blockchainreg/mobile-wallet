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
import { Linking } from "react-native";
import Switch from "react-native-switch-pro";
import styles from "../Styles.js";
import Footer from "./Footer.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import PickerSetLang from "../components/PickerSetLang.js";

export default ({ store }) => {
  const logoutBtn = async () => {
    store.current.page = "locked";
  };
  const lang = getLang(store);

  const termsBtn = async () => {
    store.current.page = "terms";
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewFlex}>
        <StatusBar />
        <Header style={styles.mtAndroid}>
          <Left style={styles.viewFlex} />
          <Body style={styles.viewFlex}>
            <Title style={styles.titleBlack}>{lang.settings}</Title>
          </Body>
          <Right style={styles.viewFlex} />
        </Header>

        <Content>
          <Separator bordered>
            <Text>{lang.help}</Text>
          </Separator>
          <ListItem
            icon
            onPress={() => {
              Linking.openURL(`https://t.me/VelasDevelopers`);
            }}
            style={styles.heightListItem}
          >
            <Left>
              <Icon name="ios-text" />
            </Left>
            <Body style={styles.heightListItem}>
              <Text style={styles.numbersFaq1}>{lang.support}</Text>
            </Body>
            <Right style={styles.heightListItem}>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem
            icon
            onPress={() => {
              Linking.openURL(`https://velas.com/privacy.html`);
            }}
            style={styles.heightListItem}
          >
            <Left>
              <Icon name="md-document" />
            </Left>
            <Body style={styles.heightListItem}>
              <Text style={styles.numbersFaq1}>{lang.privacyPolicy}</Text>
            </Body>
            <Right style={styles.heightListItem}>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem
            icon
            onPress={() => {
              Linking.openURL(
                `https://raw.githubusercontent.com/web3space/wallet/master/TERMS.md`
              );
            }}
            style={styles.heightListItem}
          >
            <Left>
              <Icon name="md-document" />
            </Left>
            <Body style={styles.heightListItem}>
              <Text style={styles.numbersFaq1}>{lang.termsOfUse}</Text>
            </Body>
            <Right style={styles.heightListItem}>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <Separator bordered>
            <Text>{lang.profile}</Text>
          </Separator>

          <ListItem icon style={styles.heightListItem} last>
            <Left>
              <Icon name="ios-globe" />
            </Left>
            <Body style={styles.heightListItem}>
              {PickerSetLang({ store })}
            </Body>
            <Right style={styles.heightListItem} />
          </ListItem>

          <Separator bordered>
            <Text>{lang.security}</Text>
          </Separator>

          <ListItem icon style={styles.heightListItem} last onPress={logoutBtn}>
            <Left>
              <Icon name="ios-log-out" />
            </Left>
            <Body style={styles.heightListItem}>
              <Text style={styles.numbersFaq1}>{lang.logOut}</Text>
            </Body>
            <Right style={styles.heightListItem} />
          </ListItem>
        </Content>
      </View>
      <Footer store={store}></Footer>
    </View>
  );
};
