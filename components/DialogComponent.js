import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import { Dialog } from 'react-native-simple-dialogs';
import { StakingEnteranceIcon, WithdrawalRequest } from '../svg/index';
import Images from '../Images.js';

export default (props) => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Dialog
      contentStyle={style.content}
      visible={modalVisible}
      //   onRequestClose={() => setModalVisible(!modalVisible)}
      onTouchOutside={() => setModalVisible(!modalVisible)}
    >
      <View style={style.container}>
        <StakingEnteranceIcon />
        <Text style={style.subTitle}>
          Something went wrong. Please contact support. You can still use web
          interface for full staking support.
        </Text>
      </View>
    </Dialog>
  );
};

const style = StyleSheet.create({
  content: {
    backgroundColor: Images.velasColor4,
  },
  subTitle: {
    color: '#fff',
    fontFamily: 'Fontfabric-NexaRegular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
  },
  container: {
    marginVertical: 30,
    alignItems: 'center',
  },
});
