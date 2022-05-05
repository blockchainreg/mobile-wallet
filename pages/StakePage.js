import React, { memo } from 'react';
import {
  Container,
  Text,
  ListItem,
  Icon,
  Button,
  Left,
  Body,
  Title,
  Right,
  Content,
} from 'native-base';
import { Header as Headers } from 'native-base';
import Footer from './Footer.js';
import {
  StyleSheet,
  View,
  RefreshControl,
  SectionList,
  Platform,
  FlatList,
} from 'react-native';
import { Observer } from 'mobx-react';
import getLang from '../wallet/get-lang.js';
import Images from '../Images.js';
import StakeItem from '../components/StakeItem.js';
import { SkypeIndicator } from 'react-native-indicators';
import StatusBar from '../components/StatusBar.js';
import styles from '../Styles.js';
import EpochComponent from '../components/EpochComponent.js';
import SortStake from '../components/SortStake.js';
import ProgressBar from '../components/ProgressBar.js';
import PickerSortStake from '../components/PickerSortStake.js';
import { EpochCurrrent } from '../svg/epoch-current.js';
import spin from '../utils/spin.js';

const LoaderText = ({ text }) => <Text style={style.loaderText}>{text}</Text>;

const SplittedText = ({ text }) => {
  const textParts = text.split('.');

  const renderItem = ({ item: textPart }) => <LoaderText text={textPart} />;
  return (
    <FlatList
      data={textParts}
      keyExtractor={(textPart, index) => `${textPart} ${index.toString()}`}
      renderItem={renderItem}
    />
  );
};

const ValidatorsList = memo(
  ({
    lang,
    stakedValidators,
    notStakedValidators,
    onPressItem,
    refreshControl,
  }) => {
    const renderItem = ({ item }) => {
      const goToDetailsValidator = () => onPressItem(item.address);

      return (
        <StakeItem
          key={item.address}
          typeBadge={item.status}
          name={item.name}
          address={item.address}
          myStake={item.myStake}
          totalStaked={item.activeStake}
          apr={item.apr}
          onPress={goToDetailsValidator}
          lang={lang}
        />
      );
    };

    const getItemLayout = (data, index) => ({
      length: 100,
      offset: 100 * index,
      index,
    });

    const keyExtractor = (item, index) => item.address;

    const renderSectionHeader = ({ section: { title } }) => (
      <ListItem itemHeader noBorder style={style.listItemHeader}>
        <Text style={style.titleText}>{title}</Text>
      </ListItem>
    );

    const sections = [
      {
        title: lang.itemStakedTitle || 'Staked Validators',
        data: stakedValidators,
      },
      {
        title: 'Not Staked Validators',
        data: notStakedValidators,
      },
    ];
    return (
      <View style={style.container}>
        <SectionList
          refreshControl={refreshControl}
          sections={
            !stakedValidators.length
              ? [
                  {
                    title: 'Not Staked Validators',
                    data: notStakedValidators,
                  },
                ]
              : sections
          }
          horizontal={false}
          windowSize={150}
          removeClippedSubviews={false}
          initialNumToRender={20}
          updateCellsBatchingPeriod={30}
          numColumns={1}
          maxToRenderPerBatch={50}
          getItemLayout={getItemLayout}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
        />
      </View>
    );
  }
);

const SearchHeader = ({ store }) => {
  const { stakingStore } = store;
  const lang = getLang(store);

  const changePage = (tab, validatorAddress) => () => {
    stakingStore.openedValidatorAddress = validatorAddress;
    store.current.page = tab;
  };
  const stakedValidators = stakingStore.getStakedValidators();
  const notStakedValidators = stakingStore.getNotStakedValidators();
  const sortActiveStake = () => {
    spin(store, `Sort by: Total Staked`, async (cb) => {
      try {
        await stakingStore.sortActiveStake();
        setTimeout(() => {
          cb(null);
        }, 1000);
      } catch (err) {
        cb(err);
      }
    })((err, data) => {
      console.log('Sort by Total Staked');
    });
  };
  const sortApr = () => {
    spin(store, `Sort by: APR`, async (cb) => {
      try {
        await stakingStore.sortApr();
        setTimeout(() => {
          cb(null);
        }, 1000);
      } catch (err) {
        cb(err);
      }
    })((err, data) => {
      console.log('Sort by APR');
    });
  };
  return (
    <>
      <Headers
        style={[
          {
            backgroundColor: Images.colorDarkBlue,
            borderBottomColor: 'transparent',
          },
          styles.marginTopAndroid,
        ]}
      >
        <Left>
          <Observer>
            {() => {
              return (
                <>
                  {!stakedValidators ||
                  !notStakedValidators ||
                  stakingStore.isRefreshing
                    ? null
                    : PickerSortStake({
                        store,
                        onDonePress: () =>
                          stakingStore.sort === 'total_staked'
                            ? sortActiveStake()
                            : sortApr(),
                      })}
                </>
              );
            }}
          </Observer>
        </Left>
        <Body>
          <Title style={styles.headerTitle}>{lang.titleStake || 'Stake'}</Title>
        </Body>
        <Right style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Observer>
            {() => {
              return (
                <>
                  {!stakedValidators ||
                  !notStakedValidators ||
                  stakingStore.isRefreshing ? null : (
                    <>
                      <EpochComponent store={store} />
                      <Button transparent onPress={changePage('searchStake')}>
                        <Icon
                          name="ios-search"
                          style={styles.refreshHeaderIcon}
                        />
                      </Button>
                    </>
                  )}
                </>
              );
            }}
          </Observer>
        </Right>
      </Headers>
      <StatusBar />
    </>
  );
};

const StakePage = ({ store, web3t, props }) => {
  const { stakingStore } = store;

  const changePage = (tab) => (validatorAddress) => {
    stakingStore.openedValidatorAddress = validatorAddress;
    store.current.page = tab;
  };

  const lang = getLang(store);

  const refreshStakeItem = () => {
    stakingStore.reloadWithRetryAndCleanCache();
    // store.sort = null;
  };

  const stakedValidators = stakingStore.getStakedValidators();
  const notStakedValidators = stakingStore.getNotStakedValidators();

  const goToDetailsValidatorTab = changePage('detailsValidator');

  return (
    <Container style={{ backgroundColor: Images.velasColor4 }}>
      <SearchHeader store={store} />
      {!stakedValidators ||
      !notStakedValidators ||
      stakingStore.isRefreshing ? (
        <View style={{ flex: 1, alignItems: 'center', alignContent: 'center' }}>
          <SkypeIndicator color={'white'} />
          {stakingStore.loaderText ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                alignContent: 'center',
              }}
            >
              {!stakingStore.loaderText.includes('.') ? (
                <LoaderText text={stakingStore.loaderText} />
              ) : (
                <SplittedText text={stakingStore.loaderText} />
              )}
            </View>
          ) : null}
        </View>
      ) : (
        <ValidatorsList
          lang={lang}
          stakedValidators={stakedValidators}
          notStakedValidators={notStakedValidators}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refreshStakeItem}
              tintColor="transparent"
            />
          }
          onPressItem={goToDetailsValidatorTab}
        />
      )}
      <Footer store={store}></Footer>
    </Container>
  );
};

export default StakePage;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Fontfabric-NexaBold',
  },
  loaderText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Fontfabric-NexaBold',
  },
  listItemStyle: {
    marginHorizontal: 20,

    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleSubTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Fontfabric-NexaRegular',
  },
  listItemHeader: {
    backgroundColor: Images.velasColor4,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Fontfabric-NexaBold',
    color: '#fff',
  },
});
