import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import Modal from "react-native-modal";
import { Image } from "react-native";
import styles from "../Styles.js";
import getLang from '../wallet/get-lang.js';
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Title,
  Icon,
  Content,
  Header
} from "native-base";

// export default ({ store }) => {
//   const handleOpenModalPress = store => {
//     return (
//       <TouchableOpacity onPress={() => (store.modal = true)}>
//         <Text>Show success modal</Text>
//       </TouchableOpacity>
//     );
//   };
//   const url = store.current.lastTxUrl;
//
  const handleCloseModalPress = store => {
    return (
      <TouchableOpacity
        style={styles.btnClose}
        onPress={() => (store.current.page = "wallets")}
      >
        <Text style={styles.btnTextClose}>Close</Text>
      </TouchableOpacity>
    );
  };


export default ({ store }) => {
  return (
    <View style={styles.containerModal}>
      <Modal isVisible={true} hasBackdrop={true}>
        <View style={styles.modalContent2}>
          <Text style={styles.textModalRender}>Oops!</Text>
          <Text style={styles.textModalStyle}>
              {store.current.error}
          </Text>
          {handleCloseModalPress(store)}
        </View>
      </Modal>
    </View>
  );
};

// add new styles



// paste to Store.js

/*
const transaction ={
  hash: '0xac05bc598a84b7f9f69732d5a02db5beec96b6f30a95d98d8f44de032f724408',
}

export default {
.....
transaction: transaction,
}
*/
