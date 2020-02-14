import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import Modal from "react-native-modal";
import { Image } from "react-native";
import styles from "../Styles.js";

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
        onPress={() => (store.current.page = "wallet")}
      >
        <Text style={styles.btnTextClose}>Close</Text>
      </TouchableOpacity>
    );
  };
//   return (
//     <View style={styles.containerModal}>
//       {handleOpenModalPress(store)}
//       <Modal isVisible={store.modal} hasBackdrop={true}>
//         <View style={styles.modalContent2}>
//           <Image
//             source={require("../assets/tick.png")}
//             style={styles.imgSizeModal2}
//           />
//           <Text style={styles.textModalRender}>Successful transaction!</Text>
//           <Text style={styles.textModalStyle}>
//             Transaction Id:{" "}
//             <Text
//               style={styles.linkStyle}
//               onPress={() => {
//                 Linking.openURL(url);
//               }}
//             >
//               {store.current.transaction.hash}
//             </Text>
//           </Text>
//           {handleCloseModalPress(store)}
//         </View>
//       </Modal>
//     </View>
//   );
// };

export default ({ store }) => {
  return (
    <View style={styles.containerModal}>
      <Modal isVisible={true} hasBackdrop={true}>
        <View style={styles.modalContent2}>
          <Image
            source={require("../assets/tick.png")}
            style={styles.imgSizeModal2}
          />
          <Text style={styles.textModalRender}>Successful transaction!</Text>
          <Text style={styles.textModalStyle}>
            Transaction Id:{" "}
            <Text
              style={styles.linkStyle}
              onPress={() => {
                Linking.openURL(url);
              }}
            >
              {store.current.transaction.hash}
            </Text>
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
