import React from "react";
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
} from "native-base";
import { Header as Headers } from "native-base";
import Footer from "./Footer.js";
import {
  StyleSheet,
  View,
  RefreshControl,
  SectionList,
  SafeAreaView,
  PlatformColor,
  Platform,
} from "react-native";
import { Observer } from "mobx-react";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import StakeItem from "../components/StakeItem.js";
import { SkypeIndicator } from "react-native-indicators";
import StatusBar from "../components/StatusBar.js";
import styles from "../Styles.js";
import EpochComponent from "../components/EpochComponent.js";
import SortStake from "../components/SortStake.js";
import ProgressBar from "../components/ProgressBar.js";
import PickerSortStake from "../components/PickerSortStake.js";
import { EpochCurrrent } from "../svg/epoch-current.js";
import spin from "../utils/spin.js";



export default ({ store, web3t, props }) => {
  const { stakingStore } = store;
  const changePage = (tab, validatorAddress) => () => {
    stakingStore.openedValidatorAddress = validatorAddress;
    store.current.page = tab;
  };

  const lang = getLang(store);

  const refreshStakeItem = () => {
    stakingStore.reloadWithRetry();
    // store.sort = null;
  };

  const sortActiveStake = () => {
    spin(
      store,
      `Sort by: Total Staked`,
      async (cb) => {
        try {
          await stakingStore.sortActiveStake();
          setTimeout(() => {
            cb(null);
          }, 1000);
        } catch(err) {
          cb(err);
        }
      }
    )((err, data) => {
      console.log("Sort by Total Staked");
    });
  };
  const sortApr = () => {
    spin(
      store,
      `Sort by: APR`,
      async (cb) => {
        try {
          await stakingStore.sortApr();
          setTimeout(() => {
            cb(null);
          }, 1000);
        } catch(err) {
          cb(err);
        }
      }
    )((err, data) => {
      console.log("Sort by APR");
    });
  };

  const currentEpoch = stakingStore.currentEpoch;
  const epochTime = stakingStore.epochTime;



  const SearchHeader = () => {
    const { stakingStore } = store;
    const changePage = (tab, validatorAddress) => () => {
      stakingStore.openedValidatorAddress = validatorAddress;
      store.current.page = tab;
    };
    return (
      <>
        <Headers
          style={[
            {
              backgroundColor: Images.colorDarkBlue,
              borderBottomColor: "transparent",
            },
            styles.marginTopAndroid,
          ]}
        >
          <Left>
            <Observer>
              {() => {
                return (
                  <>
                    {stakingStore.isRefreshing ? null : (
                      PickerSortStake({ store, onDonePress: () => stakingStore.sort === 'total_staked' ? sortActiveStake() :  sortApr()})
                    )}
                  </>
                );
              }}
            </Observer>
          </Left>
          <Body>
          <Title style={styles.headerTitle}>{lang.titleStake || "Stake"}</Title>
          </Body>
          <Right style={{flexDirection: 'row', alignItems: 'center',}}>
            <Observer>
              {() => {
                return (
                  <>
                    {stakingStore.isRefreshing ? null : (<>
                     <EpochComponent store={store} />
                      <Button transparent onPress={changePage("searchStake")}>
                        <Icon
                          name="ios-search"
                          style={styles.refreshHeaderIcon}
                          />
                      </Button></>

                    )}
                  </>
                );
              }}
            </Observer>
          </Right>
        </Headers>
        {/* <ProgressBar store={store}/> */}
        <StatusBar />
      </>
    );
  };

  return (
    <Container style={{ backgroundColor: Images.velasColor4 }}>
      <SearchHeader />
      <Observer>
        {() => {
          // debugger;
          const filterStake = stakingStore.getStakedValidators();
          const filterTotalStaked = stakingStore.getNotStakedValidators();
          if (!filterStake || !filterTotalStaked || stakingStore.isRefreshing) {
            return (
              <View style={{ flex: 1, alignItems: "center" }}>
                <View>
                  <SkypeIndicator color={"white"} />
                </View>
              </View>
            );
          }

            const renderItems = ({ item }) => (
              <StakeItem
                key={item.address}
                typeBadge={item.status}
                name={item.name}
                address={item.address}
                myStake={item.myStake}
                totalStaked={item.activeStake}
                apr={item.apr}
                onPress={changePage("detailsValidator", item.address)}
                store={store}
              />
              )

          const sections = [
            {
              title: lang.itemStakedTitle || "Staked Validators",
              data: filterStake,
            },
            {
              title: "Not Staked Validators",
              data: filterTotalStaked,
            },
          ];
          // console.log('filterTotalStaked.length', filterTotalStaked.length)
          return (
            <SafeAreaView style={style.container}>
              <SectionList
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={refreshStakeItem}
                    tintColor="transparent"
                  />
                }
                sections={
                  !filterStake.length
                    ? [
                        {
                          title: "Not Staked Validators",
                          data: filterTotalStaked,
                        },
                      ]
                    : sections
                }
                legacyImplementation={true}
                horizontal={false}
                windowSize={150}
                removeClippedSubviews={false}
                initialNumToRender={20}
                updateCellsBatchingPeriod={30}
                numColumns={1}
                onEndReachedThreshold={0.07}
                // maxToRenderPerBatch={30}
                // getItemLayout={(data, index) => (
                //   {length: 54, offset: 54 * index, index}
                // )}
                maxToRenderPerBatch={50}
                keyExtractor={(item, index) => item + index}
                renderItem={(item) => renderItems(item)}
                renderSectionHeader={({ section: { title } }) => (
                  <ListItem itemHeader noBorder style={style.listItemHeader}>
                    <Text style={style.titleText}>{title}</Text>
                  </ListItem>
                )}
              />
            </SafeAreaView>
          );
        }}
      </Observer>
      <Footer store={store}></Footer>
    </Container>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Fontfabric-NexaBold",
  },
  listItemStyle: {
    marginHorizontal: 20,

    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  styleSubTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Fontfabric-NexaRegular",
  },
  listItemHeader: {
    backgroundColor: Images.velasColor4,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Fontfabric-NexaBold",
    color: "#fff",
  },
});
