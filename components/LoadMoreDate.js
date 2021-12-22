import React, { Component } from 'react'; //import react in our code.
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Header,
  Item,
  Icon,
  Button,
  Input,
  Content,
} from 'native-base';
import styles from '../Styles.js';
import moment from 'moment';
import Images from '../Images.js';
import applyTransactions from '../wallet/apply-transactions.js';
import getLang from '../wallet/get-lang.js';
import roundNumber from '../round-number.js';
import roundHuman2 from '../wallet/round-human2';
import roundHuman from '../wallet/round-human';
import { SkypeIndicator } from 'react-native-indicators';
import walletsFuncs from "../wallet/wallets-funcs";
import { Trx } from '../svg/trx.js';

var ref$ = require('prelude-ls'),
  sortBy = ref$.sortBy,
  reverse = ref$.reverse,
  filter = ref$.filter,
  find = ref$.find,
  keys = ref$.keys,
  map = ref$.map;


const filterTxs = curry$(function (store, tx) {
  var type, token, from, to, filterProps, found;
  (type = tx.type), (token = tx.token), (from = tx.from), (to = tx.to);
  filterProps = keys(store.current.filter);
  found = filter(function (prop) {
    return store.current.filter[prop] === tx[prop];
  })(filterProps);
  return found.length === filterProps.length;
});
function curry$(f, bound) {
  var context,
    _curry = function (args) {
      return f.length > 1
        ? function () {
            var params = args ? args.concat() : [];
            context = bound ? context || this : this;
            return params.push.apply(params, arguments) < f.length &&
              arguments.length
              ? _curry.call(context, params)
              : f.apply(context, params);
          }
        : f;
    };
  return _curry();
}
function in$(x, xs) {
  var i = -1,
    l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}

export default ({ store, web3t }) => {
  const lang = getLang(store);
  const checkType = ({ type, to, txType }) => {
    if (txType) {
      return (
        <Text style={[styles.txtSizeHistory, { textTransform: 'capitalize' }]}>
          {txType}
        </Text>
      );
    }
    if (
      to === 'V8sA8Q5jR44E4q6S59eUhhSJQiRBBFdZA8' ||
      to === '0x56454c41532d434841494e000000000053574150'
    )
      return (
        <Text style={styles.txtSizeHistory}>
          {lang.swapEvm || 'Swap EVM to Native'}
        </Text>
      );

    switch (type) {
      case 'IN':
        return <Text style={styles.txtSizeHistory}>{lang.received}</Text>;
      case 'OUT':
        return <Text style={styles.txtSizeHistory}>{lang.sent}</Text>;
      default:
        return null;
    }
  };

	const index = type => {
		if (type === 'IN') return <Text>+ </Text>;
		return <Text>- </Text>;
	};
	const amountStyle = type => {
		if (type === 'IN') return styles.styleCoinIn;
		return styles.styleCoinOut;
	};
	const thumbnail = type => {
		switch (type) {
			case 'IN':
				return <Thumbnail small square source={Images.depositImage} />;
			case 'OUT':
				return (
					<Thumbnail small square source={Images.withdrawImage2} />
				);
			default:
				return null;
		}
	};

  const txs = store.transactions.applied;

  const showTransaction = (transaction) => {
    store.infoTransaction = transaction;
  };

  const applyFilter = () => {
    store.current.filterVal.apply = store.current.filterVal.temp;
    applyTransactions(store);
  };

  const changeSearch = (e) => {
    store.current.filterVal.temp = e;
  };

  const clearFilter = () => {
    store.current.filterVal.temp = '';
    store.current.filterVal.apply = '';
    applyTransactions(store);
  };

	const renderTransaction = (transaction) => {
		const { tx, amount, token, fee, type, time } = transaction;
		const wallet = wallets.find((x) => x.coin.token === token);
		if (!wallet) {
			return null;
		}
		const r_amount = roundNumber(amount, {decimals: 2});
		const txAmount = roundHuman(r_amount);
		const network = store.current.network;
		if (!wallet.coin[network]) {
			return null;
		}
		const txCurrency = (wallet.coin.nickname || wallet.coin.token).toUpperCase();
		const txFeeCurrency = (wallet.coin[network].txFeeIn || wallet.coin.nickname).toUpperCase();
		const txFee = roundHuman(fee);


		return (
			<ListItem
				thumbnail
				underlayColor={Images.color1}
				onPress={() => {
					showTransaction(transaction);
				}}
				key={Date.now() + token + tx + type}
			>
				<Left>{thumbnail(type)}</Left>
				<Body style={{ paddingRight: 10 }}>
					<Text style={styles.txtSizeHistory}>
						{checkType(transaction)}
					</Text>
					<Text style={styles.constDate}>
						{time
							? moment(time * 1000).format(
								"MMM D YYYY h:mm A"
							)
							: null
						}
					</Text>
				</Body>
				<Right>
					<Text style={amountStyle(type)}>
						{index(type)}
						{txAmount}{"\u00A0"}{txCurrency}{Platform.OS === "android" ? "\u00A0\u00A0" : null}
					</Text>
					{fee
						?(
							<Text style={styles.constDate}>
								({lang.fee}: {txFee}{" "}{txFeeCurrency}){Platform.OS === "android" ? "\u00A0\u00A0" : null}
							</Text>
						)
						: null
					}
				</Right>
			</ListItem>
		);
	}


  return (
    <View style={styles.container}>
      {store.history.filterOpen ? (
        <Header searchBar style={styles.headerSearchBar}>
          <Item style={{ backgroundColor: Images.color4 }}>
            <Icon name="ios-search" style={{ color: '#fff' }} />
            <Input
              placeholder="Search"
              value={store.current.filterVal.temp}
              placeholderTextColor="#fff"
              onChangeText={changeSearch}
              selectionColor={
                Platform.OS === 'ios' ? '#fff' : 'rgba(255,255,255,0.60)'
              }
              style={{ color: '#fff', backgroundColor: 'transparent' }}
            />
            <Icon
              name="ios-trash"
              onPress={clearFilter}
              style={{ color: '#fff' }}
            />
          </Item>
          <Button transparent onPress={applyFilter}>
            <Text style={{ color: '#fff' }}>{lang.filter}</Text>
          </Button>
        </Header>
      ) : null}

      {store.current.refreshing || store.current.transactionsAreLoading ? (
        //   <ActivityIndicator color="#fff" />
        <Content contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
          <View style={{ marginTop: 10 }}>
            <SkypeIndicator color={'white'} />
          </View>
        </Content>
      ) : (
        <View>
          {txs.length == 0 && (
            <View style={styles.footer}>
            <Trx height={27.3 * 2} width={31.7 * 2} />
          </View>
        )}
        <List>{txs.map(renderTransaction)}</List>
      </View>
      )}
  </View>
  );
};
