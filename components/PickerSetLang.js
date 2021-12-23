import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { StakeIcon, WalletIcon, HistoryIcon, SettingsIcon } from '../svg/index';

export default ({ store, width, align }) => {
  const onValueChangeValue = async (value) => {
    store.lang = value;
    localStorage.setItem('lang', value);

    await console.log('store.lang', store.lang);
  };
  const langItems = [
    {
      label: '🇺🇸 English',
      value: 'en',
    },
    {
      label: '🇷🇺 Русский',
      value: 'ru',
    },
    {
      label: '🇺🇦 Українська',
      value: 'ua',
    },
    {
      label: '🇨🇳 中文',
      value: 'zh',
    },
    {
      label: '🇪🇸 Español',
      value: 'es',
    },
    {
      label: '🇰🇷 한국어',
      value: 'ko',
    },
    {
      label: '🇦🇪 العربية ',
      value: 'ar',
    },
    {
      label: '🇮🇩 Bahasa Indonesia',
      value: 'id',
    },
    {
      label: '🇵🇭 Filipino',
      value: 'ph',
    },
    {
      label: '🇳🇬 Yorùbá',
      value: 'yr',
    },
    {
      label: '🇻🇳 Tiếng Việt',
      value: 'vn',
    },
    {
      label: '🇮🇳 हिन्दी',
      value: 'hi',
    },
  ];

  return (
    <RNPickerSelect
      placeholder={{}}
      onValueChange={(value) => {
        onValueChangeValue(value);
      }}
      useNativeAndroidPickerStyle={false}
      value={store.lang}
      items={langItems}
      Icon={() => {
        return <Ionicons name="md-arrow-down" size={24} color="transparent" />;
      }}
      style={{
        inputIOS: {
          color: '#fff',
          fontSize: 17,
          fontFamily: 'Fontfabric-NexaRegular',
          minWidth: width,
          textAlign: align,
        },
        inputAndroid: {
          color: '#fff',
          fontSize: 17,
          fontFamily: 'Fontfabric-NexaRegular',
          minWidth: width,
          textAlign: align,
        },
      }}
    />
  );
};
