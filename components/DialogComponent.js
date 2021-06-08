import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "native-base";
import { Dialog } from "react-native-simple-dialogs";
import { StakingEnteranceIcon, WithdrawalRequest } from "../svg/index";
import Images from "../Images.js";

export default (props) => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Dialog
      contentStyle={style.content}
      visible={modalVisible}
      //   onRequestClose={() => setModalVisible(!modalVisible)}
      onTouchOutside={() => setModalVisible(!modalVisible)}
    >
      <View style={style.container}>
        {props.success ? (
          <>
            <WithdrawalRequest />
            <Text style={style.subTitle}>
              It is not fully active immediately, it may take multiple epochs to
              warm it up!!!
            </Text>
          </>
        ) : (
          <>
            <StakingEnteranceIcon />
            <Text style={style.subTitle}>
              It is not fully active immediately, it may take multiple epochs to
              warm it up.
            </Text>
          </>
        )}
      </View>
    </Dialog>
  );
};

const style = StyleSheet.create({
  content: {
    backgroundColor: Images.velasColor4,
  },
  subTitle: {
    color: "rgba(255, 255, 255, 0.60)",
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
  },
  container: {
    marginVertical: 30,
    alignItems: "center",
  },
});
