import React from "react";
import { Text, Button, View } from "native-base";
import styles from "../Styles.js";
import { ScrollView } from "react-native";
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";
import getLang from "../wallet/get-lang.js";
import { LinearGradient } from "expo-linear-gradient";
import Images from '../Images.js';


module.exports = ({ store }) => {
  if (store.infoTransaction == null) return null;
  const lang = getLang(store);
  return (
    <View style={styles.viewMonoHistory}>
      <LinearGradient
            colors={[Images.color1, Images.color1, Images.color2]}
            style={styles.linearGradientBg}>
      <View style={{ paddingTop: 30 }}>
        <Button
          onPress={() => {
            store.infoTransaction = null;
          }}
          transparent
        >
          <Text style={{color: "#fff"}}>{lang.done}</Text>
        </Button>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {walletUserHistoryDetail(store)}
        </ScrollView>
      </View>
      </LinearGradient>
    </View>
  );
};
