import React from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import { Left, Body, Right, ListItem } from "native-base";
import Images from "../Images";
import { Avatar } from "../svg";
import { Badge } from "react-native-elements";
import IdentIcon from "./Identicon";
import { formatStakeAmount } from "../utils/format-value";
import getLang from "../wallet/get-lang.js";

var width = Dimensions.get("window").width;
const BG_COLOR = "#161A3F";

export default ({ store, isStaked, ...props }) => {
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

  return (
    <ListItem
      noBorder
      underlayColor={Images.velasColor4}
      avatar
      onPress={props.onPress}
      style={[
        style.listItemStyle,
        { backgroundColor: isStaked ? "#1F2853" : "#161A3F" },
      ]}
    >
      <Left style={{ marginLeft: 10 }}>
        <IdentIcon {...props} />
      </Left>
      <Body>
        <Text
          style={[style.styleTitle, { maxWidth: 150 }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {props.address}
        </Text>
        <Text style={style.styleSubTitle}>
          {isStaked ? lang.myStake || "My Stake" : lang.totalStaked || "Total Staked"}
        </Text>
        <Text
          style={[
            style.styleBalance,
            { color: isStaked ? Images.colorGreen : "#fff" },
          ]}
        >
          {formatStakeAmount(props.myStake || props.totalStaked || 0)} VLX
        </Text>
      </Body>
      <Body style={{ alignItems: "flex-end", marginRight: 20 }}>
        {badgeStatus()}
        <Text style={[style.styleSubTitle, { marginRight: 0 }]}>
          {isStaked ? lang.apr + "," + "%"|| "APR,%" : lang.totalStakers || "Total Stakers"}
        </Text>
        <Text style={[style.styleTitle, { marginRight: 0, marginTop: 3 }]}>
          {isStaked ? props.apr + "%" : props.totalStakers}
        </Text>
      </Body>
    </ListItem>
  );
};

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
  },
  inactive: {
    backgroundColor: "#8A8A8A",
    borderColor: "#8A8A8A",
    paddingHorizontal: 3,
    height: 11,
    borderRadius: 10,
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
});
