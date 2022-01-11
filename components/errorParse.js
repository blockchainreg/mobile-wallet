import React from 'react';
import { Text, View } from 'native-base';

import { Linking, StyleSheet } from 'react-native';

export default ({ error: { text1, text2, textLink, hyperLink } }) => {
  const openHyperlink = () => Linking.openURL(hyperLink);
  return (
    <View transparent style={styles.container}>
      <Text style={styles.error} key="errMsg">
        {text1}
      </Text>
      <View style={styles.row}>
        <Text style={[styles.error, styles.errorLink]} onPress={openHyperlink}>
          {textLink}
        </Text>
        <Text style={styles.error} key="errMsg">
          {text2}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  error: {
    fontSize: 14,
    color: 'red',
    top: 2,
    fontFamily: 'Fontfabric-NexaRegular',
  },
  errorLink: {
    textDecorationLine: 'underline',
  },
});
