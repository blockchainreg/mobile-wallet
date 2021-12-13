import React, { Fragment } from "react";
import { StyleSheet, Dimensions, Text, ActivityIndicator, Platform } from "react-native";
import { Left, Body, Right, ListItem} from "native-base";
import Images from "../Images";
import { Avatar } from "../svg";
import { Badge } from "react-native-elements";
import IdentIcon from "./Identicon";
import { formatStakeAmount } from "../utils/format-value";
import getLang from "../wallet/get-lang.js";
import { observer } from "mobx-react";

export default observer(({ store, ...props }) => {
  const lang = getLang(store);

  const typeBadge = (type) => {
    switch (type) {
      case "active":
        return lang.badgeActive || "Active";
      case "inactive":
        return lang.badgeInactive || "Inactive";
      default:
        return null;
    }
  };

  const badgeStatus = () => {
    return (
      <Badge
        value={
          <Text style={style.txtStyleBadge}>{typeBadge(props.typeBadge)}</Text>
        }
        badgeStyle={
          props.typeBadge === "active" ? style.active : style.inactive
        }
      />
    );
  };
  const isStaked = props.myStake > 0 ? true : false;
  return (
    <ListItem
      noBorder
      underlayColor={Images.velasColor4}
      avatar
      onPress={props.onPress}
      style={[
        style.listItemStyle,
        { backgroundColor: isStaked ? "#1F2853" : "#161A3F", height: props.name && 100}, 
      ]}
    >
      <Left style={style.leftSide}>
        <IdentIcon {...props} />
      </Left>
      <Body style={style.bodyPadding}>
        <Text
          style={[style.styleTitle, {color: props.name ? "rgba(255, 255, 255, 0.3)" : "#fff"}]}
          numberOfLines={1}
          ellipsizeMode="middle"
          >
          {props.address}
        </Text>
        {props.name ?
          <Text
            style={[style.styleTitle, {marginTop: 2}]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {props.name}
          </Text> 
          :
          null}
        <Text style={style.styleSubTitle}>
          {isStaked ? lang.myStake || "My Stake" : lang.totalStaked || "Total Staked"}
        </Text>
        <Text
          style={[
            style.styleBalance,
            { color: isStaked ? Images.colorGreen : "#fff" },
          ]}
        >
          {isStaked ? formatStakeAmount(props.myStake) : formatStakeAmount(props.totalStaked)} VLX
        </Text>
      </Body>
      <Right style={style.rightSide}>
        {badgeStatus()}
        <Text style={[style.styleSubTitle, {marginTop: props.name ? 25 : 15}]}>
          {lang.apr || "APR"}{","}{"%"}
        </Text>
        <Text style={style.styleTitle}>
          {null !== props.apr && (props.apr * 100).toFixed(2) + "%"}
          {null === props.apr && (Platform.OS === 'android' ? '...' : <ActivityIndicator/>)}
        </Text>
      </Right>
    </ListItem>
  );
});

const style = StyleSheet.create({
  styleTitle: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Fontfabric-NexaRegular",
  },
  styleBalance: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: "Fontfabric-NexaRegular",
  },
  styleSubTitle: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 10,
    marginTop: 10,
    fontFamily: "Fontfabric-NexaRegular",
  },
  active: {
    backgroundColor: Images.colorGreen,
    borderColor: Images.colorGreen,
    paddingHorizontal: 3,
    height: 11,
    borderRadius: 10,
    marginTop: 5
  },
  inactive: {
    backgroundColor: "#8A8A8A",
    borderColor: "#8A8A8A",
    paddingHorizontal: 3,
    height: 11,
    borderRadius: 10,
    marginTop: 5
  },
  txtStyleBadge: {
    color: "#0B0B25",
    fontSize: 6,
    textTransform: "uppercase",
    fontFamily: "Fontfabric-NexaRegular",
  },
  listItemStyle: {
    marginHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: Images.velasColor4,
    height: 90,
  },
  rightSide: {
    paddingLeft: 10, paddingRight: 10, justifyContent: "space-between"
  },
  leftSide: {
    marginLeft: 10
  },
  bodyPadding: {
    paddingRight: 5
  }
});
