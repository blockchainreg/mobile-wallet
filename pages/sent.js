import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import Modal from "react-native-modal";
import { Image } from "react-native";
import styles from "../Styles.js";
import Images from '../Images.js';
import StandardLinearGradient from "../components/StandardLinearGradient.js";

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
  const handleCloseModalPress = (store, web3t) => {
    const refreshAndBack = () => {

        //store.current.wallet = wallet.coin.token;
        //store.current.walletIndex = wallets.indexOf(wallet);
        //store.current.filter.length = 0;
        //store.current.filter.push("IN");
        //store.current.filter.push("OUT");
        //store.current.filter.push(wallet.coin.token);
        store.current.page = "wallets";

        web3t.refresh((err,data) => {
          
        });

    }
    return (
      <TouchableOpacity
        style={styles.btnClose}
        onPress={refreshAndBack}
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
//             source={Images.tick}
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

export default ({ store, web3t }) => {
  const url = store.current.lastTxUrl;
  return (
    <View style={styles.containerModal}>
      <StandardLinearGradient>
        <Modal isVisible={true} hasBackdrop={false}>
          <View style={styles.modalContent2}>
            <Image
              source={Images.tick}
              style={styles.imgSizeModal2}
            />
            <Text style={styles.textModalRender}>Your Transaction has been sent</Text>
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
            {handleCloseModalPress(store, web3t)}
          </View>
        </Modal>
      </StandardLinearGradient>
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
