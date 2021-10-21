import React from "react";
import { Alert, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import spin from "../utils/spin.js";
import {Icon, Text} from 'native-base'
import style from "../Styles.js";
import Images from "../Images.js";

export default ({ store, web3t, ...props }) => {
  const { stakingStore } = store;

  const sortActiveStake = () => {
    spin(
      store,
      `Sort by: Total Staked`,
      async (cb) => {
        try {
          await stakingStore.sortActiveStake();
          setTimeout(() => {
            cb(null);
          }, 100);
        } catch(err) {
          cb(err);
        }
      }
    )((err, data) => {
      console.log("Sort by Total Staked");
    });
  };
  const sortApr = () => {
    spin(
      store,
      `Sort by: Apr`,
      async (cb) => {
        try {
          await stakingStore.sortApr();
          setTimeout(() => {
            cb(null);
          }, 100);
        } catch(err) {
          cb(err);
        }
      }
    )((err, data) => {
      console.log("Sort by APR");
    });
  };
  const onValueChangeValue = async (value) => {
    store.sort = value;
    Platform.OS === "android" ? store.sort === "total_staked" ? sortActiveStake() : sortApr() : null;
    await console.log("store.sort", store.sort);
  };
  const sortItems = [
    {
      label: "Total Staked",
      value: "total_staked",
    },
    {
      label: "Apr",
      value: "apr",
    },
  ];
  const placeholder = {
    label: 'Sort by:',
    value: null,
    color: '#9EA0A4',
  };

  return (
    <RNPickerSelect
      placeholder={placeholder}
      onValueChange={(value) => {
        onValueChangeValue(value);
      }}
      useNativeAndroidPickerStyle={false}
      value={store.sort}
      items={sortItems}
      Icon={() => {
        return <Icon
        type="MaterialCommunityIcons"
        name="sort"
        style={[style.refreshHeaderIcon, { fontSize: 28 }]}
      />;
      }}
      onDonePress={props.onDonePress}
      style={{
        fontFamily: "Fontfabric-NexaRegular",
        iconContainer: {
        left: 0,
        top: Platform.OS === 'android' ? 0 : -5,
        backgroundColor: Images.colorDarkBlue,
        maxWidth: 70
      },
        inputIOS: {
          color: "transparent",
        },
        inputAndroid: {
          color: "transparent",
        },
      }}
    />
  );
};
