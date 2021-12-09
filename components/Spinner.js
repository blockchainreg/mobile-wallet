import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import styles from '../Styles.js';
import Header from './Header';

const Loader = (props) => {
  const { loading, ...attributes } = props;

  return (
    <Modal transparent={true} animationType={'none'} visible={loading}>
      <Header transparent />
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading}
            color={'white'}
            size={'large'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
