import React, { Component } from 'react';
import { StatusBar, Platform } from 'react-native';
import getLang from '../wallet/get-lang.js';

export default class app extends Component {
  render() {
    if (Platform.OS === 'ios'/* && !this.props.barStyle*/) {
      return (
         <StatusBar barStyle = "dark-content"
           hidden = {true}
           translucent = {true}
           {...this.props}
         />
     );
    }
   return (
      <StatusBar barStyle = "dark-content"
        backgroundColor="white"
        translucent = {true}
        {...this.props}
      />
  );
 }
}
