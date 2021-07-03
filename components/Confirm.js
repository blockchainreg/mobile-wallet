import React, { Component } from "react";//import react in our code.
import { ConfirmDialog } from 'react-native-simple-dialogs';
import getLang from '../wallet/get-lang.js';

export default ({store, ...props}) => {

    const lang = getLang(store);
    return (
      <ConfirmDialog
        title={lang.confirmDialog}
        message={props.confirmation}
        visible={true}
        onTouchOutside={props.onNo}
        titleStyle={{fontFamily: "Fontfabric-NexaBold", color: '#000'}}
        messageStyle={{fontFamily: "Fontfabric-NexaRegular", color: '#000'}}
        positiveButton={{
            title: lang.yes,
            onPress: props.onYes
        }}
        negativeButton={{
            title: lang.no,
            onPress: props.onNo
        }}
      />
    );
  }
