import React, { useRef } from "react";
import { StyleSheet, View, Platform } from "react-native";
import getLang from "../wallet/get-lang.js";
import { Tooltip } from "react-native-elements";
import { Icon, Text } from "native-base";
import { EpochCurrrent } from "../svg/epoch-current.js";
import ProgressBar from "../components/ProgressBar.js";

export default ({ store }) => {
  const lang = getLang(store);
  const { stakingStore } = store;

  const currentEpoch = stakingStore.currentEpoch;
  const epochTime = stakingStore.epochTime;
  
  const EpochValue = () => {
    const tooltipRef = useRef(null);
    const EpochDetail = () => {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={style.tooltipRowStyle}>
            <Text style={style.tooltipRowText}>Epoch:</Text>
            <Text
              style={[
                style.tooltipRowText,
                { fontFamily: "Fontfabric-NexaBold", color: "#fff" },
              ]}
            >
              {" "}
              #{currentEpoch}
            </Text>
          </View>
          <View style={style.tooltipRowStyle}>
            <Text style={style.tooltipRowText}>Time until end:</Text>
            <Text
              style={[
                style.tooltipRowText,
                { fontFamily: "Fontfabric-NexaBold", color: "#fff" },
              ]}
            >
              {" "}
              {Math.round(epochTime)}{" "}hours
            </Text>
          </View>
        </View>
      );
    };

    return (
      <Tooltip
        ref={tooltipRef}
        withOverlay={false}
        containerStyle={style.tooltipContainerStyle}
        pointerColor="#27282C"
        withPointer={false}
        popover={<EpochDetail />}
      >
        <EpochCurrrent current_epoch={currentEpoch}/>
      </Tooltip>
    );
  };
  return <EpochValue store={store} />;
};

const style = StyleSheet.create({
  headerTitle: {
    fontFamily:
      Platform.OS === "ios" ? "Fontfabric-NexaBold" : "Fontfabric-NexaRegular",
    fontSize: 20,
    width: Platform.OS === "ios" ? null : "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Fontfabric-NexaBold",
    color: "#fff",
  },
  styleIcon: {
    color: "#ebab28",
    height: "auto",
    fontSize: 20,
    // marginTop: 2,
  },
  epochText: {
    fontSize: 13,
    color: "#ffffff90",
    fontFamily: "Fontfabric-NexaRegular",
    marginLeft: 10,
    marginTop: 3,
  },
  tooltipContainerStyle: {
    height: "auto",
    width: "100%",
    marginTop: 20,
    backgroundColor: "#ebab28",
    borderRadius: 0,
    left: 0,
    right: 0,
  },
  tooltipRowStyle: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  tooltipRowText: {
    color: "#ffffff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 14,
  },
});
