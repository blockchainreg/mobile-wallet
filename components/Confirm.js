import React, { Component } from "react";//import react in our code.
import { ConfirmDialog } from 'react-native-simple-dialogs';

export default class Confirm extends Component {

  render() {
    return (
      <ConfirmDialog
        title="Confirm Dialog"
        message={this.props.confirmation}
        visible={true}
        onTouchOutside={this.props.onNo}
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
