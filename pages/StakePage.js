import React, { useState } from "react";
import {
  Container,
  Text,
  Content,
  List,
  ListItem,
  Grid,
  Col,
  Row,
  Input,
  Icon,
  Item,
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
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Observer } from "mobx-react";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import StakeItem from "../components/StakeItem.js";
import { SkypeIndicator } from "react-native-indicators";
import StatusBar from "../components/StatusBar.js";
import styles from "../Styles.js";

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
  const SearchInputHeader = () => {
    const { stakingStore } = store;
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const changePage = (tab, validatorAddress) => () => {
      stakingStore.openedValidatorAddress = validatorAddress;
      store.current.page = tab;
    };
    const [search, setSearch] = useState("");
    const filterStake = stakingStore.getAllValidators();
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const searchFilterFunction = (text) => {
      store.handlechangeText = text;
      if (store.handlechangeText) {
        const newData = filterStake.filter(function (item) {
          const itemData = item.address; //search by address
          const textData = store.handlechangeText;
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(store.handlechangeText);
      } else {
        setFilteredDataSource(masterDataSource);
        setSearch(store.handlechangeText);
      }
    };
    const itemView = ({ item }) => {
      return (
        <>        
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

        </>
      );
    };
    const ModalComponent = () => {
      return (
        <Container style={{ backgroundColor: Images.velasColor4, flex: 1 }}>
              <Headers
                searchBar
                rounded
                style={[{
                  backgroundColor: Images.colorDarkBlue,
                  borderBottomColor: "transparent",
                }, styles.marginTopAndroid]}
              >
                <Item
                  style={{ backgroundColor: Images.velasColor4, height: 40 }}
                >
                  <Icon name="ios-search" />
                  <Input
                    placeholder="Search"
                    autoFocus={true}
                    placeholderTextColor="#ffffff70"
                    selectionColor="#fff"
                    style={{
                      fontFamily: "Fontfabric-NexaRegular",
                      color: "#fff",
                    }}
                    keyboardAppearance="dark"
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                  />
                  {Platform.OS === 'android' && <Icon name="times-circle" fontSize={16} type="FontAwesome" onPress={toggleModal}/>}
                </Item>
                <Button transparent onPress={toggleModal}>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Fontfabric-NexaRegular",
                    }}
                  >
                    {lang.close}
                  </Text>
                </Button>
              </Headers>
              <StatusBar />
              
              <FlatList
              style={{marginTop: 20}}
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                renderItem={itemView}
                />
            </Container>
      )
    }
    return (
      <>
        <Headers
          style={[{
            backgroundColor: Images.colorDarkBlue,
            borderBottomColor: "transparent",
          }, styles.marginTopAndroid]}
        >
          <Left />
          <Body>
            <Title style={styles.headerTitle}>
              {lang.titleStake || "Stake"}
            </Title>
          </Body>
          <Right>
            <Button transparent onPress={toggleModal}>
              <Icon name="ios-search" style={styles.refreshHeaderIcon} />
            </Button>
          </Right>

          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType='fade'
          >
           <ModalComponent/>
          </Modal>
        </Headers>
        <StatusBar />
      </>
    );
  };

  return (
    <Container>
      <SearchInputHeader />
      <Content
        style={{ backgroundColor: Images.velasColor4 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshStakeItem}
            tintColor="transparent"
          />
        }
      >
        <Observer>
          {() => {
            const filterStake = stakingStore.getStakedValidators();
            const filterTotalStaked = stakingStore.getNotStakedValidators();

            if (
              !filterStake ||
              !filterTotalStaked ||
              stakingStore.isRefreshing
            ) {
              return (
                <Content
                  contentContainerStyle={{ flex: 1, alignItems: "center" }}
                >
                  <View style={{ marginTop: 10 }}>
                    <SkypeIndicator color={"white"} />
                  </View>
                </Content>
              );
            }
            const renderItemsMyStake = filterStake.map((el) => (
              <StakeItem
                key={el.address}
                typeBadge={el.status}
                address={el.address}
                myStake={el.myStake}
                apr={el.apr}
                onPress={changePage("detailsValidator", el.address)}
                store={store}
                // isStaked
              />
            ));
            const renderItemsTotalValidators = filterTotalStaked.map((el) => (
              <StakeItem
                key={el.address}
                typeBadge={el.status}
                address={el.address}
                totalStaked={el.activeStake}
                apr={el.apr}
                onPress={changePage("detailsValidator", el.address)}
                store={store}
              />
            ));

            return (
              <List key={Date.now()}>
                {/* <SearchInputHeader /> */}
                <ListItem itemHeader noBorder>
                  <Text style={style.titleText}>
                    {lang.itemStakedTitle || "Staked Validators"}
                  </Text>
                </ListItem>
                {!renderItemsMyStake.length ? (
                  <EmptyList />
                ) : (
                  renderItemsMyStake
                )}
                <ListItem itemHeader noBorder>
                  <Text style={style.titleText}>
                    {lang.itemValidatorsTitle || "Other Validators"}
                  </Text>
                </ListItem>
                {!renderItemsTotalValidators.length ? (
                  <EmptyList />
                ) : (
                  renderItemsTotalValidators
                )}
              </List>
            );
          }}
        </Observer>
      </Content>
      <Footer store={store}></Footer>
    </Container>
  );
};

const style = StyleSheet.create({
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Fontfabric-NexaBold",
    // marginRight: 10
  },
  searchInput: {
    padding: 10,
    borderColor: Images.colorGray,
    borderWidth: 1,
    backgroundColor: Images.velasColor4,
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 20,
    color: "#fff",
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
  modalBackground: {
    flex: 1,
    // alignItems: "center",
    // flexDirection: "row",
    // justifyContent: "center",
    backgroundColor: Images.velasColor4,
  },
  activityIndicatorWrapper: {
    flex: 1,
    backgroundColor: "#00000030",
    height: 100,
    width: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  containerIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  horizontalIndicator: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  itemStyle: {
    padding: 10,
    color: "white",
  },
});
