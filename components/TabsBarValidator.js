import React, {  useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from "react-native";
import {
  Icon,
  Tab,
  Tabs,
  TabHeading,
} from "native-base";
import Images from "../Images";
import { ChartIcon, ValidatorsIcon } from "../svg/index";
import ValidatorCard from "./ValidatorCard";
import ButtonBlock from "../components/ButtonBlock.js";
import DetailsValidatorComponent from "../components/DetailsValidatorComponent.js";
import { formatValue } from "../utils/format-value.js";
import TableRewards from "../components/TableRewards";
import getLang from "../wallet/get-lang.js";

const GRAY_COLOR = "rgba(255, 255, 255, 0.18)";

const ADDRESS = "G7qfVs595ykz2C6C8LHa2DEEk45GP3uHU6scs454s8HK";

export default ({ store, props }) => {
  const [page, setPage] = useState(0);
  const onChangeTab = (changeTabProps) => {
    const newTabIndex = changeTabProps.i;
    setPage(newTabIndex);
  };
  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);

  store.isStaker = true; // change to false to show without tabs and steps in the file ConfirmStake.js. This is a test demo to visualize.
  
  return (
    <>
      <DetailsValidatorComponent
        address={ADDRESS}
        isActive={true}
        value1={"9"}
        value2={formatValue("300000")}
        subtitle1={lang.validatorInterest || "VALIDATOR INTEREST"}
        subtitle2={store.isStaker ? lang.myStake || "MY STAKE" : lang.totalStake || "TOTAL STAKE"}
        store={store}
      />

      <View>
        {store.isStaker ? (

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
                  {lang.tabStake || "Stake"}
                </Text>
              </TabHeading>
            }
          >
            <View style={style.container}>
              <ValidatorCard
                value={"-0.12"}
                subtitle={lang.dominance || "DOMINANCE"}
                info={lang.info1 || "Relative validator weight compared to the average. Lower is better"}
                cardIcon={<ChartIcon />}
              />
              <ValidatorCard
                value={"0.1"}
                subtitle={lang.quality || "QUALITY"}
                info={lang.info2 || "Relative performence metric. Higher is better"}
                cardSymbol={"+"}
              />
              <ValidatorCard
                value={"18.3"}
                subtitle={lang.annual || "ANNUAL PERCENTAGE RATE"}
                info={lang.info3 || "APR is calculated based on the resalts of the previous epoch"}
                cardSymbol={"%"}
              />
              <ValidatorCard
                value={"33"}
                subtitle={lang.activeStake || "YOUR ACTIVE STAKE"}
                info={lang.info4 || "Only 25% of active stake can be activated per epoch. "}
                readMore={lang.read || "Read more"}
                link={"https://support.velas.com/hc/en-150/articles/360021044820-Delegation-Warmup-and-Cooldown"}
                cardSymbol={"%"}
              />
            </View>
            <View>

              <ButtonBlock type={"STAKE_MORE"} text={lang.stakeMore || "Stake More"} onPress={changePage("sendStake")}/>
              <ButtonBlock type={"REQUEST_WITHDRAW"} text={lang.requestWithdraw || "Request Withdraw"} onPress={changePage("exitValidator")}/>
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
                  {lang.tabWithdrawals || "Withdrawals"}
                </Text>
              </TabHeading>
            }
          >
            <View style={style.container}>
              <ValidatorCard
                value={"15000"}
                subtitle={lang.totalWithdraw || "TOTAL WITHDRAW REQUESTED"}
                cardIcon={<ChartIcon />}
              />
              <ValidatorCard
                value={"5000"}
                subtitle={lang.availableWithdraw || "AVAILABLE FOR WITHDRAW"}
                cardIcon={<ChartIcon />}
              />

            </View>
            <View style={style.btnTop}>
              <ButtonBlock type={"WITHDRAW"} text={lang.withdraw || "Withdraw"}/>
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
                  {lang.tabRewards || "Rewards"}
                </Text>
              </TabHeading>
            }
          >
            <TableRewards store={store}/>
          </Tab>
        </Tabs>
        ) : (
          <>
          <View style={style.container}>
            <ValidatorCard
                value={"-0.12"}
                subtitle={lang.dominance || "DOMINANCE"}
                info={lang.info1 || "Relative validator weight compared to the average. Lower is better"}
                cardIcon={<ChartIcon />}
              />
              <ValidatorCard
                value={"0.1"}
                subtitle={lang.quality || "QUALITY"}
                info={lang.info2 || "Relative performence metric. Higher is better"}
                cardSymbol={"+"}
              />
          </View>
            <View>

              <ButtonBlock type={"STAKE"} text={lang.stake || "Stake"} onPress={changePage("sendStake")}/>
            </View>
            </>
        )}
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
