import React, { useCallback, useState } from 'react';
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

const inputStyle = {
  color: '#fff',
  fontSize: 17,
  fontFamily: 'Fontfabric-NexaRegular',
};

export default ({ store, web3t }) => {
  const onChangeNetwork = useCallback((network) => {
    if (!!network && network !== store.current.network) {
      store.current.network = network;

      spin(
        store,
        `Changing network to ${network.toUpperCase()}`,
        web3t.refresh.bind(web3t)
      )((err, data) => {});
    }
  }, []);

  const [network, setNetwork] = useState(store.current.network);

  const onClose = useCallback(() => {
    onChangeNetwork(network);
  }, [network]);

  return (
    <RNPickerSelect
      items={networkItems}
      placeholder={{}}
      style={{
        inputAndroid: inputStyle,
        inputIOS: inputStyle,
      }}
      useNativeAndroidPickerStyle={false}
      {...Platform.select({
        android: {
          onValueChange: onChangeNetwork,
          value: store.current.network,
        },
        ios: {
          onClose,
          onValueChange: setNetwork,
          value: network,
        },
      })}
    />
  );
};
