import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import Modal from "react-native-modal";
import { Image } from "react-native";
import styles from "../Styles.js";
import Images from '../Images.js';
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import getLang from '../wallet/get-lang.js';
import { Tick } from "../svg/tick.js";

  const handleCloseModalPress = (store, web3t) => {
    const lang = getLang(store);
    const refreshAndBack = () => {
        store.current.page = "wallets";
        setTimeout(() => {
          web3t.refresh((err,data) => {});
        }, 0);
    };
    
    return (
      <TouchableOpacity
        style={styles.btnClose}
        onPress={refreshAndBack}
      >
        <Text style={styles.btnTextClose}>{lang.close}</Text>
      </TouchableOpacity>
    );
  };


export default ({ store, web3t }) => {
  const url = store.current.lastTxUrl;
  const lang = getLang(store);
  return (
    <View style={styles.containerModal}>
      <StandardLinearGradient>
        <Modal isVisible={true} hasBackdrop={false}>
          <View style={styles.modalContent2}>
            {/* <Image
              source={Images.tick}
              style={styles.imgSizeModal2}
            /> */}
            <Tick width={76}
    height={73}/>
            <Text style={styles.textModalRender}>{lang.txSend}</Text>
            <Text style={styles.textModalStyle}>
              {lang.txId}:{" "}
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


