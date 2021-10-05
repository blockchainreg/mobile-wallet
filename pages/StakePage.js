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
  FlatList,
  Platform,
  ScrollView,
  LogBox,
  SectionList,
  SafeAreaView,
} from "react-native";
import { Observer } from "mobx-react";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import StakeItem from "../components/StakeItem.js";
import { SkypeIndicator } from "react-native-indicators";
import StatusBar from "../components/StatusBar.js";
import styles from "../Styles.js";

// LogBox.ignoreLogs([
//   "VirtualizedLists should never be nested", // TODO: Remove when fixed
// ]);
export default ({ store, web3t, props }) => {
  const { stakingStore } = store;
  const changePage = (tab, validatorAddress) => () => {
    stakingStore.openedValidatorAddress = validatorAddress;
    store.current.page = tab;
  };

  const lang = getLang(store);

  const EmptyList = () => {
    return (
      <View style={style.listItemStyle}>
        <Text style={style.styleSubTitle}>{lang.nothingToShow}</Text>
      </View>
    );
  };
  const refreshStakeItem = () => {
    stakingStore.reloadWithRetry();
  };
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
          <Left />
          <Body>
            <Title style={styles.headerTitle}>
              {lang.titleStake || "Stake"}
            </Title>
          </Body>
          <Right>
            <Observer>
              {() => {
                return (
                  <>
                    {stakingStore.isRefreshing ? null : (
                      <Button transparent onPress={changePage("searchStake")}>
                        <Icon
                          name="ios-search"
                          style={styles.refreshHeaderIcon}
                        />
                      </Button>
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

  return (
    <Container style={{ backgroundColor: Images.velasColor4 }}>
      <SearchHeader />
      <Observer>
        {() => {
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
              address={item.address}
              myStake={item.myStake}
              totalStaked={item.activeStake}
              apr={item.apr}
              onPress={changePage("detailsValidator", item.address)}
              store={store}
            />
          );
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
                sections={[
                  { title: lang.itemStakedTitle || "Staked Validators", data: filterStake },
                  { title: lang.itemValidatorsTitle || "Other Validators", data: filterTotalStaked },
                ]}
                keyExtractor={(item, index) => item + index}
                renderItem={(item) => renderItems(item)}
                renderSectionHeader={({ section: { title } }) => (
                  <ListItem
                    itemHeader
                    noBorder
                    style={style.listItemHeader}
                  >
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
  }
});
