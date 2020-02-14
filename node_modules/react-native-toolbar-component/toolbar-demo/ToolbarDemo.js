import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import ToolbarComponent from 'react-native-toolbar-component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  toolbar: {
    backgroundColor: 'black',
  },
});

export default class ToolbarDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ToolbarComponent
          style={styles.toolbar}
          leftItem={{
            title: 'Left',
            layout: 'title',
            onPress: () => {
              console.log('pressed');
            },
          }}
          rightItem={{
            title: 'Right',
            layout: 'title',
            onPress: () => {
              console.log('pressed');
            },
          }}
        >
          <View>
            <Text style={styles.title}>
              Title
            </Text>
          </View>
        </ToolbarComponent>
      </View>
    );
  }
}
