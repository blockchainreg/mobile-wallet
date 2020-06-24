import React from "react";
import {
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  Text,
  View,
  CardItem,
  Body,
  Header,
  Left,
  Right,
} from "native-base";
import styles from "../Styles.js";
import Images from "../Images.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";
import BackButton from "../components/BackButton.js";
import Background from "../components/Background.js";

export default ({ store }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);

  const btnPrint = (store) => {
    return (
      <TouchableOpacity
        style={styles.btnPrint}
        onPress={() => {
          Linking.openURL(
            `https://drive.google.com/file/d/1mE53JDe2722D0BY2Mi7qIcXUFtwqSZFx/view`
          );
        }}
      >
        <Text style={styles.txtBtnPrint}>{lang.seedNotifyPrint}</Text>
      </TouchableOpacity>
    );
  };

  const back = changePage("generatedseed");

  return (
    <View style={styles.viewFlex}>
      <Background />
      <Header transparent style={styles.mtIphoneX}>
        <Left style={styles.viewFlexHeader}>
          <BackButton onBack={back} />
        </Left>
        <Body style={styles.viewFlexHeader} />
        <Right style={styles.viewFlexHeader} />
      </Header>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor={"transparent"}
      />
      <View style={styles.containerFlexStart}>
        <Image source={Images.generate} style={styles.setupImg} />
        <View style={styles.stylePrint}>
          <CardItem style={styles.cardItemSeed}>
            <Body>
              <View style={styles.bodyConfirm}>
                <Text style={styles.textCard}>{lang.seedNotify}</Text>

                <View style={[styles.containerBtn, { marginBottom: 20 }]}>
                  {btnPrint(store)}
                  <TouchableOpacity
                    style={styles.btnNext}
                    onPress={changePage("confirmseed")}
                  >
                    <Text style={styles.txtBtn}>{lang.continue}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Body>
          </CardItem>
        </View>
      </View>
    </View>
  );
};
