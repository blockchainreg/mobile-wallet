import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Left, Body, Right, ListItem, Thumbnail} from "native-base";
import Images from "../Images";
import { Badge } from "react-native-elements";
import getLang from "../wallet/get-lang.js";
import { observer } from "mobx-react";
import { LinearGradient } from "expo-linear-gradient";

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
  
  const legacyBadge = ()=> {
		if ((props.name).toLowerCase().indexOf('legacy') === -1) return null;
		const legacyBadgeStyle = {
			fontFamily: "Fontfabric-NexaRegular",
			fontSize: 12,
			backgroundColor: 'gray' ,
			width: 60,
			textAlign: "center",
			color: "white",
			padding: 5,
			paddingBottom: 2,
			paddingTop: 1,
			position: "absolute",
			top: 0,
			right: 0,
			zIndex:1,
			marginTop: -0,
			marginRight: -0,
			borderColor: Images.colorGreen,
			paddingHorizontal: 3,
			borderRadius: 5,
			borderBottomRightRadius: 0,
			borderTopLeftRadius: 0,
		};
		return (
			<Text
				style={legacyBadgeStyle}
			>
				Legacy
			</Text>
		)
	}
  
  const renderName = () => {
  	switch (true) {
			case wallet.coin.token === 'vlx2':
				return (
					<Text
						style={style.styleTitle}
						numberOfLines={1}
					>
						{props.name}
					</Text>
				);
			// case (props.name).toLowerCase().indexOf('legacy') !== -1 && props.key !== 'vlx2':
			// 	const index = (props.name).toLowerCase().indexOf('legacy');
			// 	const baseName = props.name.substr(0, index);
			//	
			// 	return (
			// 	<View style={{ fontFamily: 'Fontfabric-NexaRegular'}}>
			// 		<Text
			// 			style={style.styleTitle}
			// 		>
			// 			{baseName}
			// 		</Text>
			// 	</View>
			// 	)
				
			default:
				return (
					<Text
						style={style.styleTitle}
						numberOfLines={1}
					>
						{props.name}
					</Text>
				)
		}
	}

  const badgeStatus = () => {
		return(<></>)
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
			<LinearGradient
				colors={['#1F2853', '#1F2853', 'rgba(11,12,39,0.63)', 'rgba(11,12,39,0.63)']}
				start={[0, 0.5]}
				end={[0.1, 1.7]}
				location={[0.25, 0.4, 1]}
				style={style.linearGradientBg}
			/> 
			
      <Left style={style.leftSide}>
				<Thumbnail 
					square
					style={[{marginTop:16, height: 40, width: 40}]}
					source={{ uri: wallet.coin.image }} />
      </Left>
			
      <Body style={style.bodyPadding}>
				{ renderName() }
				
        <Text style={style.styleSubTitle}>
          ${props.usdRate}
        </Text>
        
      </Body>
      <Right style={style.rightSide}>
				{/*{badgeStatus()}*/}
				{/*{legacyBadge()}*/}
				<Text
					style={[
						style.styleBalance,
						{ color: props.active ?  "#fff" : "#fff" },
					]}
				>
					{props.balance}
				</Text>
        <Text style={[style.styleSubTitle, {marginTop: 10}]}>
          ${props.balanceUsd}
        </Text>
        
      </Right>
    </ListItem>
  );
});

const style = StyleSheet.create({
	linearGradientBg:{
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		borderRadius: 10,
		// borderTopWidth: .6,
		// borderColor: "#fff"
		// zIndex:1
	},
  styleTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Fontfabric-NexaRegular",
		marginTop: 3
  },
  styleBalance: {
    marginTop: 17,
    fontSize: 17,
		textShadowColor: 'rgba(255, 255, 255, 0.3)',
		textShadowRadius: 10,
		textShadowOffset: { width: 0, height: 0 },
		fontWeight: '800',
    fontFamily: "Fontfabric-NexaBold",
  },
  styleSubTitle: {
    color: "rgba(122,124,199,0.74)",
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
    height: 100,
		marginLeft: 10,
		borderRadius: 10,
		borderTopLeftRadius: 10,
		marginRight: 10,
		//borderTopWidth: 1.4
		// borderTopWidth: 1.4,
		// borderColor: '#262d4f'
  },
  rightSide: {
    paddingLeft: 10, paddingRight: 10
  },
  leftSide: {
    marginLeft: 10,
  },
  bodyPadding: {
    paddingRight: 5
  }
});
