import React from "react";
import { Text, Button, View } from "native-base";
import styles from "../Styles.js";
import { ScrollView } from "react-native";
import walletUserHistoryDetail from "../components/walletUserHistoryDetail.js";


module.exports = ({ store }) => {
    if (store.infoTransaction == null) return null;
    return (
      <View style={styles.viewMonoHistory}>
        <View style={{ paddingTop: 30 }}>
          <Button
            onPress={() => {
              store.infoTransaction = null;
            }}
            transparent
          >
            <Text>Done</Text>
          </Button>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            {walletUserHistoryDetail(store)}
          </ScrollView>
        </View>
      </View>
    );
}
