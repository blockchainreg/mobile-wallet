import React from "react";
import { StyleSheet, Dimensions, Text, ActivityIndicator, Platform } from "react-native";
import { Left, Body, Right, ListItem, Thumbnail} from "native-base";
import Images from "../Images";
import { Avatar } from "../svg";
import { Badge } from "react-native-elements";
import IdentIcon from "./Identicon";
import { formatStakeAmount } from "../utils/format-value";
import getLang from "../wallet/get-lang.js";
import { observer } from "mobx-react";
import styles from "../Styles";

export default observer( ({ store, wallet, ...props }) => {
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
          props.active ? style.active : style.inactive
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
        { opacity: props.active ? 1 : 0.4 , position: "relative"},
				{ backgroundColor: "#1F2853", marginBottom: 10 }
      ]}
    >
			
      <Left style={style.leftSide}>
				<Thumbnail 
					square
					style={[{marginTop:16, height: 40, width: 40}]}
					source={{ uri: wallet.coin.image }} />
      </Left>
			
      <Body style={style.bodyPadding}>
        <Text
          style={style.styleTitle}
          numberOfLines={1}
        >
          {props.name}
        </Text>
				
        <Text style={style.styleSubTitle}>
          ${props.usdRate}
        </Text>
        
      </Body>
      <Right style={style.rightSide}>
				{badgeStatus()}
				<Text
					style={[
						style.styleBalance,
						{ color: props.active ? Images.colorGreen : "#fff" },
					]}
				>
					{props.balance}
				</Text>
        <Text style={[style.styleSubTitle, {marginTop: 10}]}>
          ${props.balanceUsd}
        </Text>
        <Text style={style.styleTitle}>
          {/*{null !== props.apr && (props.apr * 100).toFixed(2) + "%"}*/}
          {/*{null === props.apr && (Platform.OS === 'android' ? '...' : <ActivityIndicator/>)}*/}
        </Text>
      </Right>
    </ListItem>
  );
});

const style = StyleSheet.create({
  styleTitle: {
    color: "#fff",
    fontSize: 15,
		// fontWeight: "bold",
		//textTransform:"uppercase",
    fontFamily: "Fontfabric-NexaRegular",
		marginTop: 3
  },
  styleBalance: {
    marginTop: 17,
    fontSize: 15,
		// fontWeight: "bold",
		textShadowColor: 'rgba(255, 255, 255, 0.3)',
		textShadowRadius: 10,
		textShadowOffset: { width: 0, height: 0 },
		fontWeight: '800',
    fontFamily: "Fontfabric-NexaRegular",
  },
  styleSubTitle: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 13,
		textTransform: "uppercase",
    marginTop: 10,
    fontFamily: "Fontfabric-NexaRegular",
  },
  active: {
    backgroundColor: Images.colorGreen,
    borderColor: Images.colorGreen,
    paddingHorizontal: 3,
    height: 11,
    borderRadius: 5,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: 0,
    marginTop: -11,
		marginRight: -9,
		position: 'absolute',
		right: "0%",
		top: "0%",
		zIndex: 2
  },
  inactive: {
    backgroundColor: "#8A8A8A",
    borderColor: "#8A8A8A",
    paddingHorizontal: 3,
    height: 11,
		borderRadius: 5,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: 0,
		marginTop: -11,
		marginRight: -9,
		position: 'absolute',
		right: "0%",
		top: "0%",
		zIndex: 2
  },
  txtStyleBadge: {
    color: "#0B0B25",
    fontSize: 6,
    textTransform: "uppercase",
    fontFamily: "Fontfabric-NexaRegular",
  },
  listItemStyle: {
    marginHorizontal: 0,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "rgba(138,138,138,0.23)",
    height: 100,
		marginLeft: 10,
		borderRadius: 5,
		marginRight: 10,
		backgroundColor: "linear-gradient(75deg, rgba(0, 0, 0, 0.6) 30%, #000 50%, rgba(0, 0, 0, 0.6) 70%)"
  },
  rightSide: {
    paddingLeft: 10, paddingRight: 10
  },
  leftSide: {
    marginLeft: 10
  },
  bodyPadding: {
    paddingRight: 5
  }
});
