import React from 'react';
import { Text, Button, View, Item, Input, Toast } from 'native-base';
import styles from '../Styles.js';
import RefreshControl from '../components/RefreshControl.js';
import sendFuncs from '../wallet/send-funcs.js';
import walletsFuncs from '../wallet/wallets-funcs.js';
import StatusBar from '../components/StatusBar.js';
import NetworkSlider from '../components/sliders/network-slider';
import getLang from '../wallet/get-lang.js';
import Background from '../components/Background.js';
import { Platform, TouchableOpacity, Linking } from 'react-native';
import roundNumber from '../round-number';
import roundHuman from '../wallet/round-human';
import Header from '../components/Header';
import InputAmount from '../components/InputAmount';
import { ScanImage } from '../svg/scanImage.js';

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
  const recipientMask = wallet.network.mask
    ? wallet.network.mask.substring(25, wallet.network.mask.length - 255) +
      '...'
    : '';
  const send = store.current.send;
  const balance = wallet.balance;
  const r_amount = roundNumber(balance, { decimals: 6 });
  const walletBalance = roundHuman(r_amount);
  const ScreenTitle = send.isSwap ? lang.swapBtn : lang.send;

  /* Methods */
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

  const changePage = (tab) => () => {
    if (send.errorParse) {
      send.errorParse = null;
    }

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

  /* Styles */
  const padStyle = { paddingTop: 10 };

  /* Components */
  const btnWithdraw = ({ store, web3t }) => {
    const sendText = lang.send;
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
    <Item style={styles.borderItem}>
      <Input
        onChangeText={(text) => recipientChange(wrap(text))}
        onBlur={() => checkRecipientAddress()}
        returnKeyType="done"
        selectionColor={
          Platform.OS === 'ios' ? '#fff' : 'rgba(255,255,255,0.60)'
        }
        keyboardAppearance="dark"
        placeholder={recipientMask}
        style={[styles.inputStyle, { fontSize: 18 }]}
        value={send['to']}
        keyboardType={'default'}
        placeholderTextColor="rgba(255,255,255,0.60)"
      />
      <TouchableOpacity
        onPress={scanQRSend}
        style={{ backgroundColor: 'transparent', width: 50 }}
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
    <View style={styles.viewFlex}>
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
            <View style={styles.bodyBlockWallet}>
              <View style={styles.bodyBlock3}>
                <Text style={styles.nameTokenSwiper1}>{lang.totalBalance}</Text>
              </View>
              <View style={styles.bodyBlock3}>
                <Text style={styles.totalBalance}>
                  {walletBalance}
                  <Text style={styles.nameToken}>
                    {' ' +
                      (wallet.coin.nickname || wallet.coin.token).toUpperCase()}
                  </Text>
                </Text>
              </View>
              <View
                style={[
                  styles.widthCard,
                  { marginHorizontal: 20, width: '90%' },
                ]}
              >
                {NetworkSlider({ store, web3t, wallet })}

                <View style={styles.titleInputSend}>
                  <Text style={styles.titleInput1}>{lang['to']}:</Text>
                </View>

                {InputAddressWithdraw({ send: store.current.send })}

                <View style={padStyle}></View>

                <View style={styles.titleInputSend}>
                  <Text style={styles.titleInput1}>{lang.amount}:</Text>
                </View>

                <View>
                  <Item style={[styles.borderItem, { height: 50 }]}>
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

                  {!(
                    wallet.coin.token === 'syx' || wallet.coin.token === 'syx2'
                  ) && (
                    <Item style={[styles.borderItem, { height: 50 }]}>
                      <Text style={{ color: 'white' }}>$ </Text>
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
                  )}
                </View>

                <View style={padStyle}></View>

                <View style={styles.titleInputSend}>
                  <Text style={styles.titleInput1}>{lang.fee}:</Text>
                </View>

                <Text style={styles.textInputDownRight}>
                  {lang.fee} {send.amountSendFee} {feeToken} ($
                  {send.amountSendFeeUsd})
                </Text>
                <Text style={styles.error}>
                  {send.errorParse && typeof send.errorParse === 'object'
                    ? [
                        <Text style={styles.error} key="errMsg">
                          {send.errorParse.text}
                        </Text>,
                        <Text
                          key="errLink"
                          style={[styles.error, styles.errorLink]}
                          onPress={() =>
                            Linking.openURL(send.errorParse.hyperLink)
                          }
                        >
                          {send.errorParse.textLink}
                        </Text>,
                      ]
                    : send.error}
                </Text>
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
