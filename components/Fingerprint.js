import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Button,
  Image,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';

export default class Fingerprint extends React.Component {
  constructor(props) {
    super(props);
    if (Platform.OS !== 'android') {
      this.scanFingerPrint();
    }
  }

  state = {
    authenticated: false,
    modalVisible: Platform.OS === 'android',
    failedCount: 0,
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  clearState = () => {
    this.setState({ authenticated: false, failedCount: 0 });
  };

  scanFingerPrint = async () => {
    try {
      console.log("scanFingerPrint");
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        this.setState({
          modalVisible: false,
          authenticated: true,
          failedCount: 0,
        });
        this.props.onSuccess();
      } else {
        console.log("authenticateAsync failed", result);
        this.setState({
          failedCount: this.state.failedCount + 1,
        }, this.scanFingerPrint);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: '#b7b7b7' }
        ]}>

        {this.state.authenticated && (
          <Text style={styles.text}>Authentication Successful! 🎉</Text>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onShow={this.scanFingerPrint}>
          <View style={styles.modal}>
            <View style={styles.innerContainer}>
              <Text>Authenticate with fingerprint</Text>
              <Image
                style={{ width: 128, height: 128 }}
                source={require('../assets/fingerprint.png')}
              />
              {/*this.state.failedCount > 0 && (
                <Text style={{ color: 'red', fontSize: 14 }}>
                  Failed to authenticate try again.
                </Text>
              )*/}
              <TouchableHighlight
                onPress={async () => {
                  LocalAuthentication.cancelAuthenticate();
                  this.props.onCancel && this.props.onCancel();
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  modal: {
    flex: 1,
    marginTop: '90%',
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    marginTop: '30%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: 22,
    paddingTop: 20,
  },
});
