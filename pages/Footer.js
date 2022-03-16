import React from 'react';
import { Button } from 'native-base';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
// import styles from '../Styles.js';
import applyTransactions from '../wallet/apply-transactions.js';
import getLang from '../wallet/get-lang.js';
import Images from '../Images.js';
import { StakeIcon, WalletIcon, HistoryIcon, SettingsIcon } from '../svg/index';
import initStaking from '../initStaking.js';
import spin from '../utils/spin.js';

export default ({ store }) => {
  const changeTab = (tab) => () => {
    store.current.page = tab;
    if (tab == 'history') {
      store.current.filter = ['*'];
      store.current.filterVal.temp = '';
      store.current.filterVal.apply = '';
      applyTransactions(store);
    }
  };

  const goToStaking = () => {
    initStaking(store);
    changeTab('stakePage')();
  };
  const goToWallets = () => {
    // initStaking(store);
    changeTab('wallets')();
  };
  const renderNetwork = () => {
    if (store.current.network === 'mainnet') {
      return null;
    }
    return (
      <View style={styles.demoView}>
        <Text style={styles.demoTxt}>
          The network for all transactions is Testnet
        </Text>
        <Text />
      </View>
    );
  };
  const goToHistory = () => {
    spin(store, 'History is loading', async (cb) => {
      try {
        const result = await changeTab('history')();
        cb(null, result);
      } catch (err) {
        cb(err);
      }
    })((err, result) => {});
  };
  //DO NOT generate footer if transaction info is visible
  if (store.infoTransaction != null) return null;
  return (
    <>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab} onPress={goToWallets}>
          <WalletIcon
            fill={store.current.page == 'wallets' && Images.colorGreen}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={goToStaking}>
          <StakeIcon
            fill={store.current.page == 'stakePage' && Images.colorGreen}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={goToHistory}>
          <HistoryIcon
            fill={store.current.page == 'history' && Images.colorGreen}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={changeTab('settings')}
        >
          <SettingsIcon
            fill={store.current.page == 'settings' && Images.colorGreen}
          />
        </TouchableOpacity>
      </View>
      {/* <Footer style={styles.footerHeight}>
        <FooterTab style={styles.footerTab}>
          <Button
            active={store.current.page == 'wallets'}
            style={styles.footerButtonStyle}
            onPress={goToWallets}
          >
            <WalletIcon
              fill={store.current.page == 'wallets' && Images.colorGreen}
              onPress={goToWallets}
            />
          </Button>
          <Button
            active={store.current.page == 'stakePage'}
            style={styles.footerButtonStyle}
            onPress={goToStaking}
          >
            <StakeIcon
              fill={store.current.page == 'stakePage' && Images.colorGreen}
              onPress={goToStaking}
            />
          </Button>
          <Button
            vertical
            active={store.current.page == 'history'}
            style={styles.footerButtonStyle}
            onPress={goToHistory}
          >
            <HistoryIcon
              fill={store.current.page == 'history' && Images.colorGreen}
              onPress={goToHistory}
            />
          </Button>
          <Button
            vertical
            active={store.current.page == 'settings'}
            style={styles.footerButtonStyle}
            onPress={changeTab('settings')}
          >
            <SettingsIcon
              fill={store.current.page == 'settings' && Images.colorGreen}
              onPress={changeTab('settings')}
            />
          </Button>
        </FooterTab>
      </Footer> */}
      {renderNetwork()}
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Images.velasColor1,
    height: 50,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  footerTab: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
  },
});
