import React, { Component } from "react";//import react in our code.
import { ConfirmDialog } from 'react-native-simple-dialogs';
import getLang from '../wallet/get-lang.js';

export default class Confirm extends Component {

  render() {
    //const lang = getLang(store);
    return (
      <ConfirmDialog
        title="Confirm Dialog"
        message={this.props.confirmation}
        visible={true}
        onTouchOutside={this.props.onNo}
        titleStyle={{fontFamily: "Fontfabric-NexaBold", color: '#000'}}
        messageStyle={{fontFamily: "Fontfabric-NexaRegular", color: '#000'}}
        positiveButton={{
            title: "Yes",
            onPress: this.props.onYes
        }}
        negativeButton={{
            title: "No",
            onPress: this.props.onNo
        }}
      />
    );
  }
}
