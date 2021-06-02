import React, { Component, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import {
  Icon,
  Tab,
  Tabs,
  TabHeading,
  Card,
  Container,
  Content,
  Button,
} from "native-base";
import Images from "../Images";
import { ChartIcon, ValidatorsIcon } from "../svg/index";
import ValidatorCard from "./ValidatorCard";
import ButtonBlock from "../components/ButtonBlock.js";
import DetailsValidatorComponent from "../components/DetailsValidatorComponent.js";
import { formatValue } from "../utils/format-value.js";
import TableRewards from "../components/TableRewards";

// import store from "../wallet/data-scheme";

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
const GRAY_COLOR = "rgba(255, 255, 255, 0.18)";

const validatorData = [
  {
    id: 1,
    type: "stake",
    value: "-0.12",
    subtitle: "DOMINANCE",
    info: "Relative validator weight compared to the average. Closer to zero is better",
    icon: <ChartIcon />,
  },
  {
    id: 2,
    type: "stake",
    value: "0.1",
    subtitle: "QUALITY",
    info: "Relative performence metric. Higher is better",
    symbol: "+",
  },
  {
    id: 3,
    type: "stake",
    value: "18.3",
    subtitle: "ANNUAL PERCENTAGE RATE",
    info: "APR is calculated based on the resalts of the previous epoch",
    symbol: "%",
  },
  {
    id: 4,
    type: "stake",
    value: "33",
    subtitle: "YOUR ACTIVE STAKE",
    info: "Only 25% of active stake can be activated per epoch. ",
    btnTooltip: "Read more",
    link: "https://support.velas.com/hc/en-150/articles/360021044820-Delegation-Warmup-and-Cooldown",
    symbol: "%",
  },
  {
    id: 5,
    type: "other",
    value: "15000",
    subtitle: "TOTAL WITHDRAW REQUESTED",
    icon: <ChartIcon />,
  },
  {
    id: 6,
    type: "other",
    value: "5000",
    subtitle: "AVAILABLE FOR WITHDRAW",
    icon: <ChartIcon />,
  },
];

const ADDRESS = "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK";

const filterStake = validatorData.filter((item) => {
  return item.type.includes("stake");
});
const filterOther = validatorData.filter((item) => {
  return item.type.includes("other");
});

const renderValidatorCards = filterStake.map((el) => (
  <ValidatorCard
    key={el.id}
    value={el.value}
    subtitle={el.subtitle}
    info={el.info}
    readMore={el.btnTooltip}
    link={el.link}
    cardSymbol={el.symbol}
    cardIcon={el.icon}
    type={el.type}
  />
));

const renderOtherCards = filterOther.map((el) => (
  <ValidatorCard
    key={el.id}
    value={el.value}
    subtitle={el.subtitle}
    info={el.info}
    readMore={el.btnTooltip}
    link={el.link}
    cardSymbol={el.symbol}
    cardIcon={el.icon}
    type={el.type}
  />
));

export default ({ store, props }) => {
  const [page, setPage] = useState(0);
  const onChangeTab = (changeTabProps) => {
    const newTabIndex = changeTabProps.i;
    setPage(newTabIndex);
  };
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  
  return (
    <>
      <DetailsValidatorComponent
        address={ADDRESS}
        isActive={true}
        value1={"9"}
        value2={formatValue("300000")}
        subtitle1={"VALIDATOR INTEREST"}
        subtitle2={"TOTAL STAKE"}
      />

      <View>
        <Tabs
          initialPage={0}
          onChangeTab={onChangeTab}
          tabBarUnderlineStyle={{
            backgroundColor: Images.colorGreen,
          }}
        >
          <Tab
            style={style.tabStyle}
            heading={
              <TabHeading style={{ backgroundColor: Images.velasColor4 }}>
                <ValidatorsIcon
                  fill={page === 0 ? Images.colorGreen : GRAY_COLOR}
                  type={"STAKE"}
                />
                <Text
                  style={
                    page === 0 ? style.activeTextStyle : style.inactiveTextStyle
                  }
                >
                  Stake
                </Text>
              </TabHeading>
            }
          >
            <View style={style.container}>{renderValidatorCards}</View>
            <View>

              <ButtonBlock type={"STAKE_MORE"} onPress={changePage("sendStake")}/>
              <ButtonBlock type={"REQUEST_WITHDRAW"} onPress={changePage("exitValidator")}/>
            </View>
          </Tab>

          <Tab
            style={style.tabStyle}
            heading={
              <TabHeading style={{ backgroundColor: Images.velasColor4 }}>
                <ValidatorsIcon
                  fill={page === 1 ? Images.colorGreen : GRAY_COLOR}
                  type={"WITHDRAW"}
                />
                <Text
                  style={
                    page === 1 ? style.activeTextStyle : style.inactiveTextStyle
                  }
                >
                  Withdrawals
                </Text>
              </TabHeading>
            }
          >
            <View style={style.container}>{renderOtherCards}</View>
            <View style={style.btnTop}>
              <ButtonBlock type={"WITHDRAW"} />
            </View>
          </Tab>
          <Tab
            tabStyle={{ backgroundColor: "pink", height: "100%" }}
            style={style.tabStyle}
            heading={
              <TabHeading style={{ backgroundColor: Images.velasColor4 }}>
                <ValidatorsIcon
                  fill={page === 2 ? Images.colorGreen : GRAY_COLOR}
                  type={"REWARDS"}
                />
                <Text
                  style={
                    page === 2 ? style.activeTextStyle : style.inactiveTextStyle
                  }
                >
                  Rewards
                </Text>
              </TabHeading>
            }
          >
            <TableRewards />
          </Tab>
        </Tabs>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  activeTextStyle: {
    color: Images.colorGreen,
    fontSize: 14,
    marginLeft: 5,
    fontFamily: "Fontfabric-NexaRegular",
  },
  inactiveTextStyle: {
    color: GRAY_COLOR,
    fontSize: 14,
    marginLeft: 5,
    fontFamily: "Fontfabric-NexaRegular",
  },
  tabStyle: {
    backgroundColor: Images.velasColor4,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "center",
    marginVertical: 15,
  },
  btnTop: {
    top: 140,
    position: "absolute",
    left: 0,
    right: 0,
  },
});
