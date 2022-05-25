import React from 'react';
import { Container, Text, Content } from 'native-base';
import { Observer } from 'mobx-react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import BN from 'bn.js';
import { Button } from 'native-base';
import Images from '../Images.js';
import ButtonBlock from '../components/ButtonBlock.js';
import { WithdrawalRequest } from '../svg/index';
import Header from '../components/Header';
import getLang from '../wallet/get-lang.js';
import spin from '../utils/spin.js';

import {
  formatStakeAmount,
  amountToBN,
  formatAmount,
} from '../utils/format-value';
import { ErrorParser } from '../utils/errorParser';
import styles from '../Styles.js';
import normalize from 'react-native-normalize';
import { Success } from '../svg/success.js';
import { FailIcon } from '../svg/failure-icon.js';

export default ({ store, web3t, props }) => {
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const { stakingStore } = store;
  const transactions = (stakingStore.txsProgress || []).filter(
    (it) => it.transaction
  );

  const lang = getLang(store);

  const title =
    stakingStore.actionLabel === 'withdraw'
      ? 'Finish withdraw'
      : 'Finish request';

  const subtitle =
    stakingStore.actionLabel === 'withdraw'
      ? 'In order to withdraw you should make ' +
        transactions.length +
        ' operations:'
      : 'In order to request withdraw you should make ' +
        transactions.length +
        ' operations:';

  const back = () => {
    changePage('exitValidator')();
    store.amountWithdraw = null;
  };
  const okBtn = async () => {
    spin(
      store,
      lang.progressValidator || 'Validator is loading',
      async (cb) => {
        try {
          const result = await stakingStore.reloadWithRetryAndCleanCache();
          cb(null, result);
        } catch (err) {
          cb(err);
        }
      }
    )((err, result) => {
      if (err) {
        setTimeout(() => {
          Alert.alert(
            'Error',
            lang.wrong ||
              'Something went wrong. Please contact support. You can still use web interface for full staking support.'
          );
        }, 1000);
        console.error(err);
        return;
      }
      changePage('detailsValidator')();
      store.amountWithdraw = null;
    });
  };
  //const signatures = ["5L8CQNFAJXvf3FboLebCtq4sNu67jugca6HkFejAUwU4r84vAqaJvaG7jqssATezfxapt6dQrkJopuYNpDaNoJ18", "512wGX82LKyb2wjZLXGwFD2CHbNjZqG6ToZf2qxadArdHnxWeRncN6vPCzJMTfNJ5UjCmHfD8sYWFKh33Sgc8BfQ"];
  return (
    <Container>
      <Header
        title={title}
        smallTitle={lang.exitValidator.length > 15}
        onBack={back}
      />

      <Content style={style.contentBg}>
        <View style={style.container}>
          <Text style={style.subtitleStyle}>{subtitle}</Text>
          <View className="txs-list" style={style.txsList}>
            {stakingStore.txsProgress
              .filter((it) => it.transaction)
              .map((item, index) => {
                const progress = item.progress;
                const amount = formatStakeAmount(
                  item.sendAmount || new BN('0')
                ).toString(10);

                const sendTx = async () => {
                  if (item.state === 'loading') return;
                  if (item.state === 'loaded') return;

                  item.state = 'loading';
                  try {
                    const signature = await stakingStore.sendTransaction(
                      item.transaction
                    );
                    //Used for sending tx simulation
                    //const signature = signatures.pop();
                    //console.log('send tx', {signature})
                    stakingStore.checkTx(
                      {
                        tx: signature,
                        start: Date.now(),
                      },
                      function (err, info) {
                        console.log({ err, info });
                        if (err != null) {
                          Alert.alert(
                            'Error',
                            lang.wrong ||
                              'Something went wrong. Please contact support. You can still use web interface for full staking support.'
                          );
                          return (item.state = 'error');
                        }
                        item.state = 'loaded';

                        //Check if all txs was completed successfully
                        const allTxsNotCompleted = stakingStore.txsProgress
                          .filter((it) => it.transaction)
                          .find((item) => {
                            return item.state !== 'loaded';
                          });
                        if (!allTxsNotCompleted) {
                          if (stakingStore.actionLabel === 'withdraw') {
                            changePage('confirmWithdrawal')();
                          } else {
                            stakingStore.txsProgress = new Array(20).fill({
                              state: '',
                            });
                            changePage('confirmExit')();
                          }
                          (async () => {
                            await stakingStore.reloadWithRetryAndCleanCache();
                          })();
                        }
                      }
                    );
                  } catch (err) {
                    console.log('[sendTx] err', err);
                    const errMsg = ErrorParser.parse(err);
                    Alert.alert('Error', errMsg);
                    item.state = 'error';
                  }
                };
                const action =
                  stakingStore.actionLabel === 'withdraw'
                    ? lang.withdraw || 'Withdraw'
                    : lang.request || 'Request';
                const btnText =
                  item.state === 'loading'
                    ? lang.loading
                      ? `${lang.loading}...`
                      : 'loading...'
                    : `${action} ${amount} VLX`;

                return (
                  <View
                    key={`row_${index}`}
                    className="tx-progress"
                    style={style.txProgress}
                  >
                    <Button
                      variant="outlined"
                      key={`btn_${index}`}
                      onPress={sendTx}
                      style={style.styleBtnGreen}
                      className="button-block-style-btn-green"
                    >
                      {item.state === 'loaded' && (
                        <Success
                          style={styles.sizeIconBtn}
                          width={normalize(20)}
                          height={normalize(20)}
                          left={normalize(0)}
                        />
                      )}
                      {item.state === 'error' && (
                        <FailIcon
                          style={styles.sizeIconBtn}
                          width={normalize(20)}
                          height={normalize(20)}
                          left={normalize(0)}
                        />
                      )}

                      <Text style={style.buttonTextStyle}>{btnText}</Text>
                    </Button>
                  </View>
                );
              })}
          </View>
        </View>
      </Content>
    </Container>
  );
};

const style = StyleSheet.create({
  contentBg: {
    backgroundColor: Images.velasColor4,
  },
  subtitleStyle: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 25,
  },
  styleBtnGreen: {
    backgroundColor: '#0BFFB7',
    padding: 12,
    minWidth: 180,
    textTransform: 'uppercase',
    margin: 20,
    fontSize: 12,
  },
  buttonTextStyle: {
    fontSize: 12,
    color: Images.velasColor4,
    fontFamily: 'Fontfabric-NexaBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : null,
    textTransform: 'uppercase',
  },
  txsList: {
    overflow: 'scroll',
    maxHeight: 240,
  },
  txProgress: {
    marginBottom: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonBottom: {
    marginTop: 60,
  },
  title: {
    color: '#fff',
    fontFamily: 'Fontfabric-NexaRegular',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  container: {
    marginTop: 45,
    flex: 1,
    alignItems: 'center',
  },
});
