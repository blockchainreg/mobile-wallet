import React from 'react';
import { StyleSheet, Text, Platform, Vibration, Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Button } from 'native-base';
import Images from '../Images';

export default (props) => {
  const netInfo = useNetInfo();
  const validatorNet =
    !netInfo.details ||
    netInfo.isConnected ||
    netInfo.type === 'cellular' ||
    netInfo.type === 'wifi';

  const checkStyle = (type) => {
    switch (type) {
      case 'STAKE_MORE':
        return { backgroundColor: Images.colorGreen };
      case 'STAKE':
        return { backgroundColor: Images.colorGreen };
      case 'OK':
        return { backgroundColor: Images.colorGreen };
      case 'NEXT':
        return { backgroundColor: Images.colorGreen };
      case 'CONFIRM':
        return { backgroundColor: Images.colorGreen };
      case 'REQUEST_WITHDRAW':
        return { backgroundColor: Images.coral };
      case 'WITHDRAW':
        return { backgroundColor: Images.coral };
      case 'DISABLED':
        return { backgroundColor: Images.colorGray };
      default:
        return null;
    }
  };

  const checkTextStyle = (type) => {
    switch (type) {
      case 'REQUEST_WITHDRAW':
        return { color: '#fff' };
      case 'WITHDRAW':
        return { color: '#fff' };
      case 'DISABLED':
        return { color: 'gray' };
      default:
        return null;
    }
  };
  return (
    <Button
      block
      style={[
        style.btnStyle,
        checkStyle(props.type),
        !validatorNet && { backgroundColor: '#F2F2F290' },
      ]}
      onPress={
        validatorNet
          ? props.onPress
          : () => {
              const DURATION = 1000 / 10;
              Vibration.vibrate(DURATION);
              Alert.alert('No Internet Connection', '', [{ text: 'Ok' }]);
            }
      }
    >
      <Text
        style={[
          style.textBtn,
          checkTextStyle(props.type),
          !validatorNet && { color: '#00000050' },
        ]}
      >
        {props.text}
      </Text>
    </Button>
  );
};

const style = StyleSheet.create({
  textBtn: {
    fontSize: 12,
    color: Images.velasColor4,
    fontFamily: 'Fontfabric-NexaBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : null,
    textTransform: 'uppercase',
  },
  btnStyle: {
    marginVertical: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 0,
    marginHorizontal: 20,
    backgroundColor: '#fff',
  },
});
