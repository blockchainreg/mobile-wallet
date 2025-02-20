import React from 'react';
import { Text, View } from 'native-base';
import { transaction } from 'mobx';
import { observer } from 'mobx-react';
import styles from '../Styles.js';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
//import ModalComponent from "react-native-modal-component";
import moment from 'moment';
import RefreshControl from '../components/RefreshControl.js';
import LoadMoreDate from '../components/LoadMoreDate.js';
// import walletFuncs from '../wallet/wallet-funcs.js';
import walletsFuncs from '../wallet/wallets-funcs.js';
import navigate from '../wallet/navigate.js';
import getLang from '../wallet/get-lang.js';
import Background from '../components/Background.js';
import Images from '../Images.js';
import roundNumber from '../round-number';
import roundHuman from '../wallet/round-human';
import Header from '../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { filter, map, objToPairs, pairsToObj } from 'prelude-ls';
import tokenNetworks from '../wallet/swapping/networks';
import contracts from '../wallet/contracts';
import { WithdrawImage } from '../svg/withdraw-image.js';
import normalize from 'react-native-normalize';
import { SwapImage } from '../svg/swap-image.js';
import { ScanImage } from '../svg/scanImage.js';
import { BuyImage } from '../svg/buyImage.js';

export default ({ store, web3t }) => {
  const lang = getLang(store);
  const wallets = walletsFuncs(store, web3t).wallets;
  const wallet = wallets.find((x) => x.coin.token === store.current.wallet);
  const swapDirections = wallet.network.networks || [];
  const swapDirectionsArr = Object.keys(swapDirections).map((it) => {
    return swapDirections[it].referTo;
  });

  const availableNetworks = store.current.account.wallets.filter((it) => {
    return swapDirectionsArr.indexOf(it.coin.token) > -1;
  });
  let hasSwap =
    swapDirections != null &&
    Object.keys(swapDirections).length > 0 &&
    availableNetworks.length > 0;

  const setDefaultSendData = () => {
    store.current.send.data = null;
    store.current.send.gasPrice = null;
    store.current.send.gasPriceAuto = null;
    store.current.send.data = null;
    store.current.send.contractAddress = null;
    store.current.send.chosenNetwork = null;
    store.current.send.amountSend = '';
    store.current.send.amountSendUsd = '';
    store.current.send.amountSendFee = '0';
    store.current.send.amountSendFeeUsd = '0';
    store.current.send.to = '';
    store.current.send.error = '';
    store.current.send.wallet = wallet;
    store.current.send.coin = wallet.coin;
    store.current.send.network = wallet.network;
    store.current.send.checkingAllowed = false;
  };

  /*******  Listeners  ********/
  const sendLocal = () => {
    store.current.send.homeFeePercent = 0;
    store.current.send.isSwap = false;
    if (wallet.balance == '..') return;
    setDefaultSendData();
    navigate(store, web3t, 'send');
  };

  const swapClick = () => {
    store.current.send.isSwap = true;
    if (wallet == null) {
      console.log('Not yet loaded');
      return null;
    }
    if (web3t[wallet.coin.token] == null) {
      console.log('Not yet loaded');
      return null;
    }
    setDefaultSendData();
    setDefaultSwapNetwork();
    var swaps = contracts({ store, web3t });
    if (swaps) {
      swaps.getBridgeInfo((err) => {
        if (err) {
          console.error(err);
        }
        navigate(store, web3t, 'send');
      });
    } else {
      navigate(store, web3t, 'send');
    }
  };
  /**
   * Set default network for swap in Send screen.
   * */
  const setDefaultSwapNetwork = () => {
    let availableNetworks = pairsToObj(
      filter(function (it) {
        return it[1].disabled == null || it[1].disabled === false;
      })(objToPairs(wallet.network.networks))
    );

    let walletSwapNetworksIds = Object.keys(availableNetworks);
    if (walletSwapNetworksIds.length > 0) {
      let defaultNetwork = wallet.network.networks[walletSwapNetworksIds[0]];
      store.current.send.chosenNetwork = defaultNetwork;
      store.current.send.to = tokenNetworks.getDefaultRecipientAddress(store);
      console.log('store.current.send.to', store.current.send.to);
    } else {
      console.error(
        'networks prop in ' +
          store.current.send.token +
          ' wallet is defined but is empty'
      );
    }
  };

  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  const refreshToken = () => {
    store.current.refreshingBalances = true;
    web3t.refresh((err, data) => {
      store.current.refreshingBalances = false;
      console.log('refresh done', err, data);
    });
  };

  //TODO: Refactor this code later.
  const hardCodedStrategyGetAddessPrefix = () => {
    const mapping = {
      vlx: 'wallet',
    };
    return mapping[wallet.coin.token] || 'address';
  };

  const Balance = ({ wallet }) => {
    const balance = wallet.balance || 0;
    const r_amount = roundNumber(balance, { decimals: 6 });
    const walletBalance = roundHuman(r_amount);
    return (
      <Text style={styles.totalBalance}>
        {walletBalance}
        <Text style={styles.nameToken}>
          {' ' + (wallet.coin.nickname || wallet.coin.token).toUpperCase()}
        </Text>
      </Text>
    );
  };

  const prefix = hardCodedStrategyGetAddessPrefix();

  const addressExplorerLink =
    wallet.network.api.url + '/' + prefix + '/' + wallet.address;

  const expand = () => {
    transaction(function () {
      store.history.filterOpen = true;
    });
  };

  const collapse = () => {
    store.history.filterOpen = false;
  };

  const getTxContainer = () => {
    // if (store.history.filterOpen == true)
    //   //return { ...styles.viewMono, height: '80%' }
    //   return (
    //       <View style={{ ...styles.viewMono, height: '80%' }}>
    //       <LinearGradient
    //       colors={[Images.velasColor4, Images.velasColor4]}
    //       style={styles.linearGradientBg}>
    //         <View style={styles.bodyBlockTitle} >
    //           <Text style={styles.titleHistory}>{lang.txLast}</Text>
    //         </View>
    //         <ScrollView>
    //           <View style={styles.viewPt} />
    //           {LoadMoreDate({ store })}
    //           <View style={{ paddingBottom: 150 }} />
    //         </ScrollView>
    //         </LinearGradient>
    //       </View>
    //   )

    return (
      <View style={style.viewMonoWallets}>
        <View style={styles.bodyBlockTitle}>
          <Text style={styles.titleHistory}>{lang.txLast}</Text>
        </View>
        <ScrollView>
          <View style={styles.viewPt} />
          {LoadMoreDate({ store })}
          {/* <View style={{ paddingBottom: 150 }} /> */}
        </ScrollView>
      </View>
    );
  };

  const back = changePage('wallets');

  const scanQRSend = () => {
    if (wallet.balance == '..') return;
    if (store.current.page === 'wallet') {
      store.current.send.isSwap = false;
      setDefaultSendData();
    }
    store.current.returnPage = 'wallet';
    return (store.current.page = 'Scanner');
    //store.current.send.to = "VJWAMYt4A1o3pwSJLzvJqHBL1wxvLBSpsQ";
    //store.current.send.wallet = wallet;
    //store.current.send.coin = wallet.coin;
    //store.current.send.network = wallet.network;
    //navigate(store, web3t, "send", x=> {
    //
    //});
  };

  const locationWallet =
    store.current.network == 'testnet' ? 'wallet_testnet' : 'wallet_mainnet';
  const tokenDisplay = 'VLX';

  const uri_prod = `https://buy.velas.com/?address=${wallet.address}&crypto_currency=${tokenDisplay}&env=${locationWallet}`;
  const uri_test = `https://fiat-payments.testnet.velas.com/?address=${wallet.address}&crypto_currency=${tokenDisplay}&env=${locationWallet}`;

  const uri_provider = store.current.network == 'testnet' ? uri_test : uri_prod;

  const buyVlx = () => {
    Linking.openURL(uri_provider);
  };

  const handleBarCodeScanned = (ev) => {
    console.log(ev);
  };

  return (
    <View style={styles.viewFlex}>
      <Header title={wallet.coin.name} onBack={back} coin={wallet.coin.image} />
      <View
        style={{
          backgroundColor: 'transparent',
          height: '20%',
          // marginTop: hp('5%'),
          alignSelf: 'center',
          width: '66%',
          zIndex: 999,
          position: 'absolute',
        }}
      >
        {RefreshControl({ swipeRefresh: refreshToken, store, children: <></> })}
      </View>

      <View style={style.topView}>
        <View style={styles.bodyBlock3}>
          <Text style={styles.nameTokenSwiper1}>{lang.totalBalance}</Text>
        </View>
        <View style={styles.bodyBlock3}>
          <Balance wallet={wallet} />
        </View>
      </View>

      <View style={style.emptyBlock} />

      <View style={style.buttons}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={sendLocal}
            style={{ ...styles.touchables, backgroundColor: Images.colorBlue }}
          >
            {/* <Image
                        source={Images.withdrawImage}
                        style={styles.sizeIconBtn}
                      /> */}
            <WithdrawImage
              style={styles.sizeIconBtn}
              width={normalize(64 / 2.5)}
              height={normalize(36 / 2.5)}
              left={normalize(1)}
            />
          </TouchableOpacity>
          <Text style={styles.textTouchable}>{lang.send}</Text>
        </View>

        {hasSwap && (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={swapClick}
              style={{
                ...styles.touchables,
                backgroundColor: Images.colorBlue,
              }}
            >
              {/* <Image
                          source={Images.swapImage}
                          style={styles.sizeIconBtnSwap}
                        /> */}
              <SwapImage
                width={normalize(64 / 2.5)}
                height={normalize(25)}
                left={normalize(1)}
              />
            </TouchableOpacity>
            <Text style={styles.textTouchable}>{lang.swapBtn || 'Swap'}</Text>
          </View>
        )}

        {wallet.coin.token == 'vlx_native' || wallet.coin.token == 'vlx_evm' ? (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={buyVlx}
              style={[styles.touchables, { backgroundColor: '#9b55e0' }]}
            >
              <BuyImage
                width={normalize(65 / 2.5)}
                height={normalize(65 / 2.5)}
                left={0}
                bottom={normalize(1)}
              />
            </TouchableOpacity>
            <Text style={styles.textTouchable}>Buy</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={scanQRSend} style={styles.touchables}>
              <ScanImage
                width={normalize(65 / 2.5)}
                height={normalize(65 / 2.5)}
                left={0}
                bottom={normalize(1)}
              />
            </TouchableOpacity>
            <Text style={styles.textTouchable}>{lang.scan}</Text>
          </View>
        )}

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={changePage('invoice')}
            style={{ ...styles.touchables, backgroundColor: Images.colorGreen }}
          >
            <WithdrawImage
              style={[
                styles.sizeIconBtn,
                { transform: [{ rotate: '180deg' }], left: 0, top: 2 },
              ]}
              width={normalize(64 / 2.5)}
              height={normalize(36 / 2.5)}
              left={normalize(1)}
            />
          </TouchableOpacity>
          <Text style={styles.textTouchable}>{lang.receive}</Text>
        </View>
      </View>

      <View style={style.emptyBlock} />
      {getTxContainer()}
    </View>
  );
};

const style = StyleSheet.create({
  topView: {
    flex: 0.15,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  viewMonoWallets: {
    flex: 0.7,
    backgroundColor: Images.velasColor4,
  },
  balance: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Fontfabric-NexaRegular',
  },
  balanceAmount: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Fontfabric-NexaRegular',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: Platform.OS === 'ios' ? 0.15 : 0.2,
  },
  emptyBlock: {
    height: 10,
    backgroundColor: 'transparent',
  },
});
