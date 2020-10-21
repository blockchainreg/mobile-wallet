import React from 'react';
import { Text, View, Button, Alert, Vibration, } from 'react-native';
import styles from "../Styles.js";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";


function AppContent() {
  return (
    <View style={styles.demoView}><Text style={styles.demoTxt}>This is a demo mode. Please save your seed phrase for full access to the wallet</Text></View>
  );
}

export default function App() {
  return (
    <View>
      <AppContent/>
    </View>
  );
}