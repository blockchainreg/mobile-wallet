import React, { useState } from "react";
import { Container, Text, Header } from "native-base";
import {
  StyleSheet,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  LogBox,
} from "react-native";
import getLang from "../wallet/get-lang.js";
import Images from "../Images.js";
import StakeItem from "../components/StakeItem.js";
import StatusBar from "../components/StatusBar.js";
import { SearchBar } from "react-native-elements";

// LogBox.ignoreLogs([
//   "VirtualizedLists should never be nested", // TODO: Remove when fixed
// ]);
export default ({ store }) => {
  const lang = getLang(store);
  const EmptyList = () => {
    return (
      <View style={style.listItemStyle}>
        <Text style={style.styleSubTitle}>{lang.nothingToShow}</Text>
      </View>
    );
  };
  const Search = () => {
    const { stakingStore } = store;
    const changePage = (tab, validatorAddress) => () => {
      stakingStore.openedValidatorAddress = validatorAddress;
      store.current.page = tab;
    };
    const [search, setSearch] = useState("");
    const filterStake = stakingStore.getAllValidators();
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    // const inputRef = React.useRef(null);

    const searchFilterFunction = (text) => {
      store.handlechangeText = text;
      if (store.handlechangeText) {
        const newData = filterStake.filter(function (item) {
          const itemData = item.address ? item.address.toUpperCase()
          : ''.toUpperCase(); //search by address
          const itemIdentity = item.identity ? item.identity.toUpperCase()
          : ''.toUpperCase(); //search by identity
          const textData = store.handlechangeText.toUpperCase();
          return itemData.indexOf(textData) > -1 || itemIdentity.indexOf(textData) > -1;
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
    };
    return (
      <View style={style.container} keyboardShouldPersistTaps="always">
        <Header
          searchBar
          style={style.header}
          androidStatusBarColor="black"
          noShadow={false}
          transparent
        >
          <SearchBar
            round
            searchIcon={{ size: 24 }}
            style={style.input}
            value={search}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction(text)}
            placeholder="Search"
            autoFocus={true}
            keyboardType="default"
            placeholderTextColor={"#ffffff80"}
            inputStyle={style.inputStyle}
            selectionColor={"#fff"}
            keyboardAppearance={"dark"}
            containerStyle={style.containerStyle}
            inputContainerStyle={style.inputContainerStyle}
            cancelIcon
            showCancels
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity onPress={changePage("stakePage")} style={style.btn}>
            <Text style={style.txtBtn}>Close</Text>
          </TouchableOpacity>
        </Header>
        <StatusBar barStyle="light-content" />
        <FlatList
          ListEmptyComponent={<EmptyList />}
          keyboardShouldPersistTaps="always"
          style={style.flatlistMargin}
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={itemView}
        />
      </View>
    );
  };

  return (
    <Container style={{ backgroundColor: Images.velasColor4 }}>
      <Search />
    </Container>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Images.velasColor4,
  },
  inputStyle: {
    fontFamily: "Fontfabric-NexaRegular",
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: "#05061f",
    width: "80%",
  },
  inputContainerStyle: {
    backgroundColor: "#0b0c27",
    borderRadius: 50,
    borderTopColor: "transparent",
    borderTopWidth: 1,
  },
  flatlistMargin: {
    marginTop: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: Platform.OS === "ios" ? null : 5,

    backgroundColor: Images.colorDarkBlue,
    borderBottomColor: "transparent",
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Fontfabric-NexaRegular",
  },
  btn: {
    justifyContent: "center",
    marginRight: 10,
  },
  txtBtn: {
    color: "white",
    fontFamily: "Fontfabric-NexaRegular",
  },
});
