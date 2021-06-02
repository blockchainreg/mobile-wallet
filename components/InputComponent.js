import React, { useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import { Text, Input, Item, Label } from "native-base";
import Images from "../Images";
import { formatValue, wrapNumber } from "../utils/format-value";


export default (props) => {
  const [value, setValue] = useState("");
  
  return (
    <>
      <Label style={style.labelTextTop}>{props.title}</Label>
      <Item style={style.styleItem}>
        <Input
          onChangeText={setValue}
          value={wrapNumber(value)}
          returnKeyType="done"
          autoCompleteType="off"
          style={style.input}
          selectionColor={"#fff"}
          keyboardAppearance="dark"
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor="rgba(255,255,255,0.60)"
          />
        <Image source={Images.logo} style={style.labelLogo} />
        <Text style={style.tokenStyle}>{props.token}</Text>
      </Item>

      <View style={style.containerBottomInput}>
        <Text style={style.labelTextBottom}>
          Your Total Stake: {formatValue(props.total_stake)}
        </Text>
        <Image source={Images.logo} style={style.labelLogo} />
        <Text style={style.labelTokenStyle}>{props.token}</Text>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  containerBottomInput: {
    marginLeft: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  labelTextBottom: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 10,
  },
  labelTokenStyle: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 10,
    textTransform: "uppercase"
  },
  tokenStyle: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 12,
    marginRight:10,
    textTransform: "uppercase"
  },
  labelTextTop: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 13,
    margin: 20,
  },
  labelLogo: {
    height: 10,
    width: 10,
    marginHorizontal: 5,
  },
  styleItem: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#12173E",
    borderBottomColor: "transparent",
    paddingLeft: 10,
  },
  input: {
    color: "#fff", fontFamily: "Fontfabric-NexaRegular"
  }
});
