import React from 'react';
import { Content } from 'native-base';
import Footer from './Footer.js';
import { View } from 'react-native';
import styles from '../Styles.js';
import moment from 'moment';
import LoadMoreDate from '../components/LoadMoreDate';
import getLang from '../wallet/get-lang.js';
import Background from '../components/Background.js';
import Images from '../Images.js';
import Header from '../components/Header';

export default ({ store, web3t }) => {
  const lang = getLang(store);
  const changePage = (tab) => () => {
    store.tab = tab;
  };

  const refreshToken = async (bool) => {
    web3t.refresh((err, data) => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewFlex}>
        <Background fullscreen={true} />
        <Header title={lang.history} />
        <Content style={{ backgroundColor: Images.velasColor4 }}>
          {LoadMoreDate({ store })}
        </Content>
      </View>
      <Footer store={store}></Footer>
    </View>
  );
};
