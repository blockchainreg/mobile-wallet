import React from 'react';
import { Image } from 'react-native';
import { Text, Button, View, Icon, CardItem, Body } from 'native-base';
import styles from '../Styles.js';
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';
import Background from '../components/Background.js';
import { shuffle } from '../utils/array.js';
import Header from '../components/Header';
import { VelasLogo1 } from '../svg/velas-logo1.js';

export default ({ store, web3t }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const makeRange = (from) => {
    store.current.seed = '';
    store.current.seedIndex = 0;
    store.current.seedIndexes = shuffle([...Array(from).keys()]);
    store.current.seedWords = [...Array(from).keys()].map(() => '');
  };

  const restoreSeed12 = () => {
    store.current.seed = '';
    makeRange(12);
    store.current.page = 'restoreseed';
  };

  const restoreSeed24 = () => {
    store.current.seed = '';
    makeRange(24);
    store.current.page = 'restoreseed';
  };

  const restoreCustom = () => {
    store.current.seed = '';
    makeRange(1);
    store.current.page = 'restoreseed';
  };
  const lang = getLang(store);

  return (
    <View style={styles.viewFlex}>
      <Background fullscreen={true} />
      <Header onBack={changePage('newseed')} />
      <View style={styles.containerFlexStart}>
        {/* <Image
            source={Images.logo}
            style={styles.styleLogo}
          /> */}
        <VelasLogo1
          style={[styles.styleLogo, { alignSelf: 'center' }]}
          width="72"
          height="63"
          viewBox="0 0 72 63"
        />
        <View style={styles.card1}>
          <View style={styles.titleInput}>
            <Text style={styles.textH1Seed}>{lang.from}</Text>
          </View>
          <CardItem style={styles.cardItemSeed}>
            <Body>
              <View style={styles.marginBtn}>
                <Button
                  block
                  style={styles.btnVelasRestore}
                  onPress={restoreSeed12}
                >
                  <Text style={styles.textBtn}>{lang.words12}</Text>
                </Button>
                <View style={{ padding: 10 }}></View>
                <Button
                  block
                  style={styles.btnVelasRestore}
                  onPress={restoreSeed24}
                >
                  <Text style={styles.textBtn}>{lang.words24}</Text>
                </Button>
                <View style={{ padding: 10 }}></View>
                <Button
                  block
                  style={styles.btnVelasRestore}
                  onPress={restoreCustom}
                >
                  <Text style={styles.textBtn}>{lang.customBtn}</Text>
                </Button>
              </View>
            </Body>
          </CardItem>
        </View>
      </View>
    </View>
  );
};
