import React from "react";
import { Badge, Text } from "native-base";
import { View, StyleSheet } from "react-native";

export default (props) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  return (
    <View style={style.row}>
      <Badge style={style.badge}>
        <Text style={{ color: "white" }}>{props.index}</Text>
      </Badge>
      <View style={{ flex: 1 }}>
        <Text style={style.styleTxtStep}>{props.text}&nbsp;</Text>
        <Text style={{ ...style.styleTxtStep, color: "#FFA607" }}>
          {props.address}
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  styleTxtStep: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 17,
    marginLeft: 20,
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.20)",
    borderColor: "rgba(255, 255, 255, 0.40)",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    marginTop: 35,
    marginLeft: 20,
  },
  title: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 20,
    textAlign: "center",
  },
});
