import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Touchable,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
  ListItem,
} from 'native-base';
import Images from '../Images';
import { Badge } from 'react-native-elements';
import IdentIcon from './Identicon';
import getLang from '../wallet/get-lang.js';
import { CameraEn } from '../svg/cameraEn';

var width = Dimensions.get('window').width;
const BORDER_COLOR = 'rgba(255, 255, 255, 0.18)';
const GRAY_COLOR = 'rgba(255, 255, 255, 0.50)';

export default ({ store, ...props }) => {
  const lang = getLang(store);

  const badgeStatus = () => {
    return (
      <Badge
        value={
          <Text
            style={{
              color: '#0B0B25',
              fontSize: 6,
              textTransform: 'uppercase',
            }}
          >
            {props.isActive
              ? lang.badgeActive || 'Active'
              : lang.badgeInActive || 'Inactive'}
          </Text>
        }
        badgeStyle={{
          backgroundColor: props.isActive
            ? Images.colorGreen
            : Images.colorGray,
          borderColor: props.isActive ? Images.colorGreen : Images.colorGray,
          paddingHorizontal: 3,
          height: 11,
          borderRadius: 10,
          marginTop: 10,
        }}
      />
    );
  };
  return (
    <View>
      <View style={style.content}>
        <IdentIcon
          {...props}
          size={props.name ? 65 : 80}
          backgroundColor={'rgba(22, 26, 63, 1)'}
        />
        {badgeStatus()}
        {props.name && (
          // <Text style={style.addressStyle} onPress={props.copyName}>{props.name}<CameraEn height={10} width={15}/></Text>
          <Text style={style.addressStyle} onPress={props.copyName}>
            {props.name}
          </Text>
        )}
        <Text
          style={[
            style.addressStyle,
            { color: props.name ? 'rgba(255, 255, 255, 0.3)' : '#fff' },
          ]}
          onPress={props.copyAddress}
        >
          {props.address}
        </Text>
      </View>
      <View style={style.row}>
        <View style={style.column}>
          <Text style={style.value}>{props.value1}%</Text>
          <Text style={style.subtitle}>{props.subtitle1}</Text>
        </View>
        {props.value2 && (
          <View
            style={[
              style.column,
              { borderLeftWidth: 0.5, borderLeftColor: BORDER_COLOR },
            ]}
          >
            <Text style={style.value}>{props.value2}</Text>
            <Text style={style.subtitle}>{props.subtitle2}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  addressStyle: {
    color: '#fff',
    fontFamily: 'Fontfabric-NexaRegular',
    fontSize: 13,
    // width: width * 0.85,
    marginHorizontal: 30,
    textAlign: 'center',
    marginTop: 10,
  },
  row: {
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: BORDER_COLOR,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  column: {
    flex: 0.5,
    minHeight: 50,
    maxHeight: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: '#fff',
    fontFamily: 'Fontfabric-NexaRegular',
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: GRAY_COLOR,
    fontFamily: 'Fontfabric-NexaRegular',
    fontSize: 11,
    textTransform: 'uppercase',
    marginTop: 10,
  },
});
