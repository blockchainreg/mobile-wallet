import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import Images from '../Images';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { observer } from 'mobx-react';
import getLang from '../wallet/get-lang';
import spin from '../utils/spin';
import { RefreshControl } from 'react-native';

export default observer(({ store, web3t, ...props }) => {
  const { renderItem, listData } = props;
  const isLoading = store.current.loadingSpinners.length > 0;
  // const [listData, setListData] = useState(
  // 	Array(5)
  // 		.fill('')
  // 		.map((_, i) => ({
  // 			title: `title${i + 1}`,
  // 			data: [
  // 				...Array(5)
  // 					.fill('')
  // 					.map((_, j) => ({
  // 						key: `${i}.${j}`,
  // 						text: `item #${j}`,
  // 					})),
  // 			],
  // 		}))
  // );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteItem = (rowMap, data) => {
    if (isLoading) return;
    const { coin, name } = data.item;
    const tokenName = (name || '').toUpperCase();
    const lang = getLang(store);
    //BUG: This works unstable
    spin(
      store,
      `${lang.uninstalling || 'Uninstalling'} ${tokenName}`,
      web3t.uninstall.bind(web3t)
    )(coin.token, (err, data) => {});
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const [section] = rowKey.split('.');
    const newData = [...listData];
    const prevIndex = listData[section].data.findIndex(
      (item) => item.key === rowKey
    );
    newData[section].data.splice(prevIndex, 1);
  };

  const onRowDidOpen = (rowKey) => {};

  // const renderItem = data => (
  // 	<TouchableHighlight
  // 		onPress={() => console.log('You touched me')}
  // 		style={styles.rowFront}
  // 		underlayColor={'#AAA'}
  // 	>
  // 		<View>
  // 			<Text>I am {data.item.text} in a SwipeListView</Text>
  // 		</View>
  // 	</TouchableHighlight>
  // );
  //
  const renderHiddenItem = (data, rowMap) => {
    if (
      ['vlx_evm', 'vlx_native', 'vlx2', 'btc', 'eth'].indexOf(
        data.item.coin.token
      ) > -1
    ) {
      return null;
    }
    if (isNaN(data.item.balance)) {
      return null;
    }

    const rowStyle = isLoading ? styles.rowBackDisabled : styles.rowBack;

    return (
      <View style={rowStyle}>
        <Text></Text>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => closeRow(rowMap, data.item.key)}
        >
          <Text style={styles.backTextWhite}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteItem(rowMap, data)}
        >
          <Text style={styles.backTextWhite}>Hide</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.networkStyle}>{section.title}</Text>
  );

  return (
    <View style={styles.heightContainer}>
      <SwipeListView
        useSectionList
        sections={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={<View style={{ height: 50 }} />}
        // leftOpenValue={0}
        rightOpenValue={-70}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        stopLeftSwipe={-0.00001}
        stopRightSwipe={-70}
        refreshControl={
          <RefreshControl
            refreshing={store.current.refreshingBalances}
            onRefresh={props.onRefresh}
            tintColor="#fff"
          />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  heightContainer: {
    ...Platform.select({
      ios: {
        marginBottom: -50,
      },
      android: {
        marginBottom: -50,
      },
    }),
  },
  networkStyle: {
    backgroundColor: Images.colorDarkBlue,
    color: '#fff',
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'Fontfabric-NexaBold',
    marginBottom: 5,
    paddingBottom: 5,
    paddingTop: 15,
    opacity: 1,
  },
  backTextWhite: {
    color: '#FFF',
    marginRight: -75,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: Images.velasColor1,
    paddingLeft: 15,
    marginHorizontal: 0,
    height: 100,
    marginLeft: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  rowBackDisabled: {
    alignItems: 'center',
    backgroundColor: Images.velasColor1,
    paddingLeft: 15,
    marginHorizontal: 0,
    height: 100,
    marginLeft: 10,
    borderRadius: 10,
    marginRight: 10,
    opacity: 0.4,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 150,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
    opacity: 0,
  },
  backRightBtnRight: {
    backgroundColor: Images.coral,
    right: 0.5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
