import React, { Component } from 'react';
import { StatusBar } from 'react-native';

export default class app extends Component {
  render() {
   return (
      <StatusBar barStyle = "dark-content" 
        hidden = {true}
        // backgroundColor="white"
        translucent = {true} 
        />
   )
}
}
