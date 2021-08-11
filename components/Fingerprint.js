import * as React from "react";
import {
  View,
  Modal,
  Image,
  Platform,
  ImageBackground,
  Text
} from "react-native";
import {
  Button,
} from "native-base";
import * as LocalAuthentication from "expo-local-authentication";
import GradientButton from "react-native-gradient-buttons";
// import GradientButton from "../components/GradientButton.js";
import Images from "../Images.js";
import styles from "../Styles.js";
import Background from "./Background.js";
import { LinearGradient } from "expo-linear-gradient";
import getLang from '../wallet/get-lang.js';


export default class Fingerprint extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    authenticated: false,
    modalVisible: Platform.OS === "android",
    failedCount: 0,
    error: null
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  clearState = () => {
    this.setState({ authenticated: false, failedCount: 0, error: null });
  };

  scanFingerPrint = async () => {
    try {
      console.log("scanFingerPrint");
      let results = await LocalAuthentication.authenticateAsync({
        promptMessage:
          "Please Authenticate yourself using Fingerprint or Face ID",
        fallbackLabel: "",
      });
      if (results.success) {
        this.setState({
          modalVisible: false,
          authenticated: true,
          failedCount: 0,
        });
        this.props.onSuccess();
      } else {
        console.log("authenticateAsync failed", result);

        if (results.error === "lockout") {
          alert("Too many failed tries. Restart wallet and try again.");
          return this.props.onCancel && this.props.onCancel();
        }
        this.setState(
          {
            failedCount: this.state.failedCount + 1,
            error: results.error
          },
          this.scanFingerPrint
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  

  render() {
    return (
      <View style={styles.viewFlexFp}>
        <Background fullscreen={true}/>
        {this.state.authenticated && (
          <Text style={styles.textFp}>Authentication Successful! 🎉</Text>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          // onShow={this.scanFingerPrint}
        >
          <View style={styles.modalFp}>
            <LinearGradient
              colors={[Images.velasColor4, Images.velasColor4]}
              style={styles.linearGradientBg}
            >
              <View style={styles.containerScreen}>
                <Text style={[styles.titleBlack , {paddingVertical: 20}]}>
                  {/* Authenticate with fingerprint */}
                  Please Authenticate!
                </Text>
                <Image
                  style={styles.imageFinger}
                  source={Images.fingerPrint}
                />
                {this.state.failedCount > 0 && (
                <Text style={{ color: "white", fontSize: 14 }}>
                  Try again
                </Text>
              )}
                <View style={styles.marginBtn}>
                  <Button block style={styles.btnVelasActive} 
                    onPress={this.scanFingerPrint}>
                    <Text style={styles.textBtn}>{"Press to scan"}</Text>
                  </Button>
                  <Button block style={styles.btnVelasActive} 
                    onPress={() => {
                      LocalAuthentication.cancelAuthenticate();
                      this.props.onCancel && this.props.onCancel();
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.textBtn}>{"Cancel"}</Text>
                  </Button>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    );
  }
}
