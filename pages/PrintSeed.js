import React from 'react';
import { Image, TouchableOpacity, Linking } from 'react-native';
import { Text, View, CardItem, Body, Container, Content } from 'native-base';
import styles from '../Styles.js';
import Images from '../Images.js';
import getLang from '../wallet/get-lang.js';
import Background from '../components/Background.js';
import Header from '../components/Header';
import { Generate } from '../svg/generate.js';

export default ({ store }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);

  const btnPrint = (store) => {
    return (
      <TouchableOpacity
        style={styles.btnPrint}
        onPress={() => {
          Linking.openURL(
            `https://drive.google.com/file/d/1mE53JDe2722D0BY2Mi7qIcXUFtwqSZFx/view`
          );
        }}
      >
        <Text style={styles.txtBtnPrint}>{lang.seedNotifyPrint}</Text>
      </TouchableOpacity>
    );
  };

  const back = changePage('generatedseed');

  return (
    <Container style={styles.viewFlex}>
      <Background fullscreen={true} />
      <Header onBack={back} />
      <Content style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          {/* <Image source={Images.generate} style={styles.setupImg} /> */}
          <Generate height={271 / 4} width={320 / 4} marginBottom={'7%'} />
          <View style={styles.stylePrint}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.bodyConfirm}>
                  <Text style={styles.textCard}>{lang.seedNotify}</Text>
                  <Text style={styles.textCard}>{lang.seedNotify1}</Text>
                  <Text style={styles.textCard}>{lang.seedNotify2}</Text>

                  <View style={styles.containerBtn1}>
                    {btnPrint(store)}
                    <TouchableOpacity
                      style={styles.btnNext}
                      onPress={changePage('confirmseed')}
                    >
                      <Text style={styles.txtBtn}>{lang.continue}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Body>
            </CardItem>
          </View>
        </View>
      </Content>
    </Container>
  );
};
