import * as React from "react";
import { Modal, Image, Platform, Alert } from "react-native";
import { Text, Button, View, Icon, CardItem, Body } from "native-base";
import * as LocalAuthentication from "expo-local-authentication";
import Images from "../Images.js";
import styles from "../Styles.js";
import Background from "./Background.js";
import Header from "../components/Header.js";
import * as SecureStore from "expo-secure-store";
import { FingerPrint } from "../svg/fingerPrint.js";

export default class Fingerprint extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    authenticated: false,
    modalVisible: Platform.OS === "android",
    failedCount: 0,
    error: null,
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
            error: results.error,
          },
          this.scanFingerPrint
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  onPressDisable = () => {
    SecureStore.getItemAsync("localAuthToken").then(pin => {
      if (pin) {
        SecureStore.deleteItemAsync("localAuthToken").then(() => {
          this.props.onCancel && this.props.onCancel();
          Alert.alert(
            Platform.OS === 'ios' ? "Touch ID / Face ID" : "Fingerprint ID",
            "Disabled successfully",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        });
      } else return null;
    })
  }
  
  render() {
    return (
      <View style={styles.viewFlex}>
        <View style={{ display: "none" }}>
          <Header
            onBackHandlerOnly={() => {
              LocalAuthentication.cancelAuthenticate();
              this.props.onCancel && this.props.onCancel();
              this.setModalVisible(!this.state.modalVisible);
            }}
          />
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1  }}>
          {/* <Image style={styles.imageFinger} source={Images.fingerPrint} /> */}
          <FingerPrint  width={150 / 2} height={173 / 2}/>
          <View style={styles.card1}>
            <View style={styles.titleInput}>
              <Text style={styles.textH1Seed}>Authenticate!</Text>
            </View>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.marginBtn}>
                  {this.props.onSuccess && (
                  <>
                  <Button
                    block
                    style={styles.btnVelasCreate}
                    onPress={this.scanFingerPrint}
                  >
                    <Text style={[styles.textBtn, { color: "#fff" }]}>
                      Enable
                    </Text>
                  </Button>
                  <View style={{ padding: 10 }}></View>
                  </>
                  )}

                  {this.props.onDisable && (
                    <>
                    <Button
                      block
                      style={[styles.btnVelasCreate, {backgroundColor: "orange"}]}
                      onPress={this.onPressDisable}
                    >
                      <Text style={[styles.textBtn, { color: "#fff" }]}>
                      Disable
                      </Text>
                    </Button>
                    <View style={{ padding: 10 }}></View>
                    </>
                  )}

                  <Button
                    block
                    style={styles.btnVelasRestore}
                    onPress={() => {
                      LocalAuthentication.cancelAuthenticate();
                      this.props.onCancel && this.props.onCancel();
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  >
                    <Text style={styles.textBtn}>Cancel</Text>
                  </Button>
                </View>
              </Body>
            </CardItem>
            {this.state.failedCount > 0 && (
            <Text style={[styles.textH1Seed, { color: "red", fontSize: 16 , textAlign: "center"}]}>
              Try again
            </Text>
          )}
          </View>
        </View>
      </View>
    );
  }
}
