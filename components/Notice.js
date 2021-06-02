import React from "react";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from "native-base";
import { View, StyleSheet } from "react-native";
import Images from "../Images";
import { ChartIcon, StakeConfirm } from "../svg/index";


export default (props) => {
  const checkIcon = (icon) => {
    switch (icon) {
      case "warning":
        return <StakeConfirm/>;
      default:
        return null;
    }
  };
  return (
    <List style={{ marginVertical: 20 }}>
      <ListItem noBorder underlayColor={Images.velasColor4} avatar>
        <Left style={{ marginLeft: 10 }}>
          {checkIcon(props.icon)}
        </Left>
        <Body style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={style.styleTxtStep}>
            {props.text}
          </Text>
        </Body>
        <Right />
      </ListItem>
    </List>
  );
};

const style = StyleSheet.create({
  styleTxtStep: {
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 17,
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
