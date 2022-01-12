import React, { useState } from 'react';
import {
  Left,
  Right,
  Text,
  Button,
  View,
  Icon,
  Item,
  Input,
  Title,
  Body,
  Thumbnail,
  Label,
  Toast,
} from 'native-base';
import { observe } from 'mobx';
import styles from '../Styles.js';
import RefreshControl from '../components/RefreshControl.js';
import sendFuncs from '../wallet/send-funcs.js';
import walletsFuncs from '../wallet/wallets-funcs.js';
import Spinner from '../utils/spinner.js';
import StatusBar from '../components/StatusBar.js';
import NetworkSlider from '../components/sliders/network-slider';
import getLang from '../wallet/get-lang.js';
import BackButton from '../components/BackButton.js';
import Background from '../components/Background.js';
import Images from '../Images.js';
import { Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import roundNumber from '../round-number';
import roundHuman from '../wallet/round-human';
import Header from '../components/Header';
import InputAmount from '../components/InputAmount';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import math from '../wallet/math.js';
import { ScanImage } from '../svg/scanImage.js';

const wrapNumber = (text) => {
  return {
    target: {
      value: text.replace(',', '.').replace(/[^0-9\.]/g, ''),
    },
  };
};

const wrap = (text) => {
  return {
    target: {
      value: text,
    },
  };
};

const AmountInput = ({
  onChangeText,
  value,
  maxFractionLength = undefined,
}) => (
  <InputAmount
    onChangeText={onChangeText}
    returnKeyType="done"
    autoCompleteType="off"
    style={style.inputStyle}
    selectionColor={Platform.OS === 'ios' ? '#fff' : 'rgba(255,255,255,0.60)'}
    keyboardAppearance="dark"
    placeholder="0.00"
    value={value}
    keyboardType="numeric"
    placeholderTextColor="rgba(255,255,255,0.60)"
    maxLength={20}
    maxFractionLength={maxFractionLength}
  />
);

/* Render Send/Swap sceen */
export default ({ store, web3t }) => {
  const lang = getLang(store);
  const {
    feeToken,
    recipientChange,
    amountChange,
    amountUsdChange,
    checkRecipientAddress,
    beforeSendAnyway,
  } = sendFuncs(store, web3t);

  const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = wallets.find((x) => x.coin.token === store.current.wallet);
  const network = store.current.network;
  if (!wallet || !wallet.coin[network]) {
    return null;
  }
  const recipientMask = wallet.network.mask
    ? wallet.network.mask.substring(25, wallet.network.mask.length - 255) +
      '...'
    : '';
  const send = store.current.send;
  const balance = wallet.balance;
  const r_amount = roundNumber(balance, { decimals: 6 });
  const walletBalance = roundHuman(r_amount);
  const ScreenTitle = send.isSwap ? lang.swapBtn : lang.send;
  const token = wallet.coin.nickname || wallet.coin.token;
  const bridgeFeeNumber = store.current.send.homeFeePercent || 0;
  const bridgeFee = math.times(bridgeFeeNumber, 100);
  const tokenFee = roundNumber(send.amountSendFee, { decimals: 9 });
  const amountSendFeeUsd = roundNumber(send.amountSendFeeUsd, { decimals: 2 });

  /* Methods */
  const handleChangeAmount = (text) => amountChange(wrapNumber(text));
  const handleChangeUsdAmount = (text) => amountUsdChange(wrapNumber(text));

  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const scanQRSend = () => {
    if (isNaN(wallet.balance)) return;
    store.current.returnPage = 'send';
    return (store.current.page = 'Scanner');
  };

  const sendTx = async () => {
    try {
      store.current.send.error = '';
      beforeSendAnyway();
    } catch (e) {
      console.error(e);
      Toast.show({ text: e.message });
    }
  };

  const refreshToken = async (bool) => {
    store.current.refreshingBalances = true;
    web3t.refresh((err, data) => {
      store.current.refreshingBalances = false;
    });
  };

  const back = changePage('wallet', true);

  /* Components */
  const btnWithdraw = ({ store, web3t }) => {
    const sendText = send.isSwap ? lang.swap || 'Swap' : lang.send;
    const disabled =
      !((!send.error || send.error.length === 0) && +send.amountSend > 0) ||
      send.amountChanging === true ||
      store.current.creatingTransaction === true;
    return (
      <Button
        block
        style={disabled ? styles.buttonInactive : styles.btnVelasActive}
        onPress={sendTx}
        disabled={disabled}
      >
        <Text style={styles.textBtn}>{sendText}</Text>
      </Button>
    );
  };

  const InputAddressWithdraw = ({ send }) => (
    <Item style={[style.inputAddressHolder]}>
      <Input
        onChangeText={(text) => recipientChange(wrap(text))}
        onBlur={() => checkRecipientAddress()}
        returnKeyType="done"
        selectionColor={
          Platform.OS === 'ios' ? '#fff' : 'rgba(255,255,255,0.60)'
        }
        keyboardAppearance="dark"
        placeholder={'Wallet address'}
        style={style.inputAddress}
        value={send['to']}
        keyboardType={'default'}
        placeholderTextColor="rgba(255,255,255,0.60)"
      />
      <TouchableOpacity
        onPress={scanQRSend}
        style={{ backgroundColor: 'transparent', width: 50, right: 0 }}
      >
        {/* <Image
					source={Images.scanImage}
					style={styles.sizeIconBtn1}
				/> */}
        <ScanImage width={64 / 4} height={64 / 4} left={30} />
      </TouchableOpacity>
    </Item>
  );

  /* Render */
  return (
    <View style={[styles.viewFlex]}>
      <Background fullscreen={true} />
      <Header title={ScreenTitle} onBack={back} coin={wallet.coin.image} />

      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor={'transparent'}
      />
      {RefreshControl({
        swipeRefresh: refreshToken,
        store,
        children: (
          <>
            <View style={[style.bodyBlockWallet]}>
              <View style={style.balanceCOntainerStyle}>
                <View style={styles.bodyBlock3}>
                  <Text style={[styles.nameTokenSwiper1, style.headerBg]}>
                    {lang.totalBalance}
                  </Text>
                </View>

                <View style={styles.bodyBlock3}>
                  <Text style={[styles.totalBalance]}>
                    {walletBalance}
                    <Text style={[styles.nameToken]}>
                      {' ' +
                        (
                          wallet.coin.nickname || wallet.coin.token
                        ).toUpperCase()}
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.widthCard,
                  { marginHorizontal: 20, width: '90%' },
                ]}
              >
                {NetworkSlider({ store, web3t, wallet })}
                {InputAddressWithdraw({ send: store.current.send })}
                <View>
                  <View
                    style={[
                      style.alignHorizontal,
                      style.borderItem,
                      { paddingRight: 0 },
                    ]}
                  >
                    <Item style={style.itemStyle}>
                      <InputAmount
                        onChangeText={(text) => amountChange(wrapNumber(text))}
                        returnKeyType="done"
                        autoCompleteType="off"
                        style={[
                          styles.inputStyle,
                          { fontSize: 18, width: '100%' },
                        ]}
                        selectionColor={
                          Platform.OS === 'ios'
                            ? '#fff'
                            : 'rgba(255,255,255,0.60)'
                        }
                        keyboardAppearance="dark"
                        placeholder="0.00"
                        value={send.amountSend}
                        keyboardType="numeric"
                        placeholderTextColor="rgba(255,255,255,0.60)"
                        maxLength={20}
                        maxFractionLength={9}
                      />
                    </Item>
                    <Text style={style.tokenStyle}>{token}</Text>
                  </View>
                  {!(
                    wallet.coin.token === 'syx' || wallet.coin.token === 'syx2'
                  ) && (
                    <View style={[style.alignHorizontal, style.borderItem]}>
                      <Item style={style.itemStyle}>
                        <InputAmount
                          onChangeText={(text) =>
                            amountUsdChange(wrapNumber(text))
                          }
                          returnKeyType="done"
                          autoCompleteType="off"
                          style={[
                            styles.inputStyle,
                            { fontSize: 18, width: '100%' },
                          ]}
                          selectionColor={
                            Platform.OS === 'ios'
                              ? '#fff'
                              : 'rgba(255,255,255,0.60)'
                          }
                          keyboardAppearance="dark"
                          placeholder="0.00"
                          value={send.amountSendUsd}
                          keyboardType="numeric"
                          placeholderTextColor="rgba(255,255,255,0.60)"
                          maxLength={20}
                        />
                      </Item>
                      <Text style={style.tokenStyle}>{'USD'}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.padStyle}></View>
                <View style={styles.padStyle}></View>

                <View
                  style={[
                    style.alignHorizontal,
                    style.feeItem,
                    { alignItems: 'flex-start', alignContent: 'flex-start' },
                  ]}
                >
                  <View style={style.feeLabel}>
                    <Text style={style.feeTitle}>{lang.fee}:</Text>
                  </View>

                  <Text style={[style.tokenStyle, { width: '80%' }]}>
                    {tokenFee} {feeToken} (${amountSendFeeUsd})
                  </Text>
                </View>
                {bridgeFee > 0 && (
                  <View
                    style={[
                      style.alignHorizontal,
                      style.feeItem,
                      { alignItems: 'flex-start', alignContent: 'flex-start' },
                    ]}
                  >
                    <View style={[style.bridgeFeeLabel]}>
                      <Text style={style.feeTitle}>{lang.bridgeFee}:</Text>
                    </View>

                    <Text style={[style.tokenStyle, { width: '20%' }]}>
                      {bridgeFee}
                      {'%'}
                    </Text>
                  </View>
                )}
                <View style={styles.padStyle}></View>
                <Text style={styles.error}>{send.error}</Text>
              </View>
              <View style={styles.containerScreen}>
                {btnWithdraw({ store, web3t })}
              </View>
            </View>
            <View style={styles.paddingWithdraw} />
          </>
        ),
      })}
    </View>
  );
};

const style = StyleSheet.create({
  inputAddressHolder: {
    borderBottomWidth: 0.4,
    marginTop: 15,
    borderBottomColor: 'white',
    marginLeft: 0,
  },
  inputAddress: {
    color: 'white',
    fontFamily: 'Fontfabric-NexaBold',
    width: '80%',
    borderBottomWidth: 0,
    fontSize: 18,
    paddingBottom: 5,
    paddingTop: 5,
    height: 30,
    marginTop: 8,
  },
  itemStyle: {
    paddingTop: 20,
    width: '80%',
    borderBottomWidth: 0,
  },
  borderItem: {
    borderBottomColor: '#fff',
    borderBottomWidth: 0.4,
    marginTop: 10,
    marginRight: 0,
    ...ifIphoneX({
      borderBottomColor: '#fff',
    }),
  },
  feeLabel: {
    width: '100%',
    maxWidth: '20%',
  },
  bridgeFeeLabel: {
    width: '100%',
    maxWidth: '80%',
  },
  feeItem: {
    marginTop: 10,
    paddingRight: 0,
  },
  alignHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerBg: {
    opacity: 0.3,
  },
  tokenStyle: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 14,
    width: '20%',
    minWidth: 50,
    fontFamily: 'Fontfabric-NexaBold',
    textTransform: 'uppercase',
    paddingBottom: 3,
    textAlign: 'right',
  },
  bodyBlockWallet: {
    marginHorizontal: 0,
    ...Platform.select({
      ios: {
        marginTop: '5%',
      },
      android: { marginTop: 10 },
    }),
  },
  balanceCOntainerStyle: {
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputStyle: {
    width: '100%',
    marginBottom: 0,
    paddingBottom: 2,
    paddingLeft: 0,

    opacity: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Fontfabric-NexaBold',
  },
  feeTitle: {
    color: '#fff',
    //textTransform: "uppercase",
    fontSize: 15,
    opacity: 0.3,
    marginBottom: 0,
    ...ifIphoneX(
      {
        color: '#fff',
        opacity: 0.6,
        fontSize: 15,
        fontFamily: 'Fontfabric-NexaRegular',
        // fontWeight: "bold",
      },
      {
        ...Platform.select({
          ios: {
            opacity: 1,
            marginTop: 0,
            marginBottom: 0,
            fontSize: 15,
            fontWeight: 'bold',
            fontFamily: 'Fontfabric-NexaRegular',
          },
          android: {
            opacity: 1,
            marginTop: 0,
            marginBottom: 0,
            fontSize: 15,
            fontWeight: Platform.OS === 'ios' ? 'bold' : null,
            fontFamily: 'Fontfabric-NexaRegular',
          },
        }),
      }
    ),
  },
  padStyle: {
    paddingTop: 20,
  },
});
