import React, { useState } from "react";
import { Image, StyleSheet, View, Dimensions, Alert, Touchable, TouchableOpacity } from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from "native-base";
import Images from "../Images";
import { Avatar } from "../svg";
import { Badge } from "react-native-elements";

var width = Dimensions.get("window").width;
const BG_COLOR = "#161A3F";

export default (props) => {
  //   const [isEnabled, setIsEnabled] = useState();
  //   const onPress = () => setIsEnabled(!isEnabled);
  const onPress = () => {};

  return (
    <TouchableOpacity style={style.cardStyle} onPress={onPress}>
      <Card
        noShadow
        style={[
          style.bgCard,
          { borderColor: props.isMine ? Images.colorGreen : BG_COLOR },
        ]}
      >
        <CardItem style={style.bgItem}>
          <Body style={{ flex: 0.8 }}>
            <Text note style={{ fontSize: 8 }}>
              Total Staked
            </Text>
            <Text style={{ fontSize: 11, color: "#fff" }}>
              {props.totalStaked || "0.00"} VLX
            </Text>
          </Body>
          <Right style={{ flex: 0.2 }}>
            <Avatar {...props} />
          </Right>
        </CardItem>

        <CardItem
          style={[
            style.bgItem,
            { marginTop: -20, backgroundColor: "transparent" },
          ]}
        >
          <Body style={{ flex: 0.8 }}>
            {props.isMine ? (
              <>
                <Text note style={{ fontSize: 8 }}>
                  Mine
                </Text>
                <Text style={{ fontSize: 11, color: Images.colorGreen }}>
                  {props.isMine || "0"} VLX
                </Text>
              </>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <Text note style={{ fontSize: 8 }}>
                    Total Stakers
                  </Text>
                  <Text style={{ fontSize: 11, color: "#fff" }}>
                    {props.totalStakers || "0"}
                  </Text>
                </View>
                {props.isStatus && (
                  <View>
                    <View>
                      <Text note style={{ fontSize: 8 }}>
                        Status
                      </Text>
                    </View>
                    <Badge
                      value={
                        <Text
                          style={{
                            color: "#0B0B25",
                            fontSize: 5,
                            textTransform: "uppercase",
                          }}
                        >
                          {props.isActive ? "Active" : "Inactive"}
                        </Text>
                      }
                      badgeStyle={{
                        backgroundColor: props.isActive ? Images.colorGreen : Images.colorOrange,
                        borderColor: props.isActive ? Images.colorGreen : Images.colorOrange,
                        width: "auto",
                        paddingHorizontal: 3,
                        height: 7,
                        borderRadius: 10,
                      }}
                      containerStyle={{
                        position: "absolute",
                        left: 0,
                        top: 13,
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          </Body>
        </CardItem>
      </Card>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  cardStyle: {
    width: width * 0.475,
  },
  bgItem: {
    backgroundColor: BG_COLOR,
  },
  bgCard: {
    backgroundColor: BG_COLOR,
  },
});
