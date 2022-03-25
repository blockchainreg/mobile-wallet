import React, { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import spin from '../utils/spin.js';

const networkItems = [
  {
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'TestNet',
    value: 'testnet',
  },
];

export default ({ store, web3t }) => {
  const prevNetworkRef = useRef(store.current.network);
  const [network, setNetwork] = useState(store.current.network);

  const changeNetwork = useCallback(() => {
    store.current.network = network;
    spin(
      store,
      `Changing network to ${store.current.network.toUpperCase()}`,
      web3t.refresh.bind(web3t)
    )((err, data) => {});
  }, [network]);

  const onValueChange = useCallback(
    (value) => {
      setNetwork(value);

      if (Platform.OS === 'android') {
        prevNetworkRef.current = value;
        changeNetwork();
      }
    },
    [changeNetwork]
  );

  // for IOS only
  const onDonePress = useCallback(() => {
    if (prevNetworkRef.current !== network) {
      prevNetworkRef.current = network;
      changeNetwork();
    }
  }, [changeNetwork, network]);

  return (
    <RNPickerSelect
      placeholder={{}}
      onValueChange={onValueChange}
      useNativeAndroidPickerStyle={false}
      value={network}
      items={networkItems}
      style={{
        inputIOS: {
          color: '#fff',
          fontSize: 17,
          fontFamily: 'Fontfabric-NexaRegular',
        },
        inputAndroid: {
          color: '#fff',
          fontSize: 17,
          fontFamily: 'Fontfabric-NexaRegular',
        },
      }}
      onDonePress={onDonePress}
    />
  );
};
