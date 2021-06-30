import React, { useState } from "react";
import { StyleSheet, View, Dimensions, Text, Clipboard, Vibration, Alert } from "react-native";
import { Icon, Tab, Tabs, TabHeading, Content } from "native-base";
import { Observer, observer } from "mobx-react";
import Images from "../Images";
import { ChartIcon, ValidatorsIcon, VelasIcon } from "../svg/index";
import ValidatorCard from "./ValidatorCard";
import ButtonBlock from "../components/ButtonBlock.js";
import DetailsValidatorComponent from "../components/DetailsValidatorComponent.js";
import TableRewards from "../components/TableRewards";
import getLang from "../wallet/get-lang.js";
import { formatStakeAmount } from "../utils/format-value";
import BN from 'bn.js';
import spin from "../utils/spin.js";

const GRAY_COLOR = "rgba(255, 255, 255, 0.18)";

export default ({ store, web3t }) => {
  const { stakingStore } = store;
  const [page, setPage] = useState(0);

  const onChangeTab = (changeTabProps) => {
    const newTabIndex = changeTabProps.i;
    setPage(newTabIndex);
  };

  const changePage = (tab) => () => {
    store.current.page = tab;
  };
  const lang = getLang(store);
  return (
    <Observer>{() => {
      if (stakingStore.isRefreshing) return null;
      const details = stakingStore.getValidatorDetails();
      const DOMINANCE_VALUE = !details.dominance ? '...' : (details.dominance).toFixed(4);
      const QUALITY_VALUE = details.quality >= -10 && details.quality <= 10 ? 0 : details.quality;
      const ANNUAL_RATE = !details.annualPercentageRate ? '...' : details.annualPercentageRate;
      const ACTIVE_STAKE = !details.myActiveStake ? '...' : details.myActiveStake;

      const WITHDRAW_REQUESTED = details.totalWithdrawRequested;
      const AVAILABLE_WITHDRAW = details.availableWithdrawRequested;

      const ADDRESS = details.address;
      const PRESERVE_BALANCE = new BN('1000000000', 10);

      const onPressWithdraw = () => {
        if (!details.totalWithdrawRequested) return null;
        stakingStore.withdrawRequested(ADDRESS).then(() => {
          changePage("stakePage")();
        }).catch(e => {
          debugger;
          console.error(e);
        })
      }

      const copyAddress = async () => {
        const DURATION = 1000/10;
        await Clipboard.setString(details.address);
        Vibration.vibrate(DURATION);
        Alert.alert(lang.copied, "", [{ text: lang.ok }]);
      };
      
      return <>
      <DetailsValidatorComponent
        address={details.address}
        copyAddress={copyAddress}
        isActive={details.status === "active" ? true : false}
        value1={details.commission}
        value2={!details.myStake.isZero() ? `${formatStakeAmount(details.myStake)} VLX` : `${formatStakeAmount(details.activeStake)} VLX`}
        subtitle1={lang.validatorInterest || "VALIDATOR INTEREST"}
        subtitle2={
          !details.myStake.isZero()
            ? lang.myStake || "MY STAKE"
            : lang.totalStake || "TOTAL STAKE"
        }
        store={store}
      />
      <View>
        {!details.myStake.isZero() ? (
          <Tabs
            // initialPage={details.availableWithdrawRequested.isZero() ? 0 : 1} //for the future
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
                      page === 0
                        ? style.activeTextStyle
                        : style.inactiveTextStyle
                    }
                  >
                    {lang.tabStake || "Stake"}
                  </Text>
                </TabHeading>
              }
            >
              <View style={style.container}>
                <ValidatorCard
                  value={DOMINANCE_VALUE}
                  subtitle={lang.dominance || "DOMINANCE"}
                  info={
                    lang.info1 ||
                    "Relative validator weight compared to the average. Lower is better"
                  }
                  cardIcon={<ChartIcon />}
                />
                <ValidatorCard
                  value={QUALITY_VALUE}
                  subtitle={lang.quality || "QUALITY"}
                  info={"0 means average"}
                  cardSymbol={"+"}
                />
                <ValidatorCard
                  value={ANNUAL_RATE}
                  subtitle={lang.annual || "ANNUAL PERCENTAGE RATE"}
                  info={
                    lang.info3 ||
                    "APR is calculated based on the resalts of the previous epoch"
                  }
                  cardSymbol={"%"}
                />
                <ValidatorCard
                  value={ACTIVE_STAKE}
                  subtitle={lang.activeStake || "YOUR ACTIVE STAKE"}
                  info={
                    lang.info4 ||
                    "Only 25% of active stake can be activated per epoch. "
                  }
                  readMore={lang.read || "Read more"}
                  link={
                    "https://support.velas.com/hc/en-150/articles/360021044820-Delegation-Warmup-and-Cooldown"
                  }
                  cardSymbol={"%"}
                />
              </View>
              <View>
                <ButtonBlock
                  type={"STAKE_MORE"}
                  text={lang.stakeMore || "Stake More"}
                  onPress={changePage("sendStake")}
                />
                { details.totalActiveStake && details.totalActiveStake.lte(stakingStore.rent) &&
                <ButtonBlock
                  type={"REQUEST_WITHDRAW"}
                  text={lang.requestWithdraw || "Request Withdraw"}
                  onPress={changePage("exitValidator")}
                />
                }
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
                      page === 1
                        ? style.activeTextStyle
                        : style.inactiveTextStyle
                    }
                  >
                    {lang.tabWithdrawals || "Withdrawals"}
                  </Text>
                </TabHeading>
              }
            >
              <View style={style.container}>
                <ValidatorCard
                  value={WITHDRAW_REQUESTED ? formatStakeAmount(WITHDRAW_REQUESTED) : ''}
                  subtitle={lang.totalWithdraw || "TOTAL WITHDRAW REQUESTED"}
                  cardIcon={<VelasIcon />}
                />
                <ValidatorCard
                  value={AVAILABLE_WITHDRAW ? formatStakeAmount(AVAILABLE_WITHDRAW) : ''}
                  subtitle={lang.availableWithdraw || "AVAILABLE FOR WITHDRAW"}
                  cardIcon={<VelasIcon />}
                />
              </View>
              <View style={style.btnTop}>
                {details.availableWithdrawRequested && details.availableWithdrawRequested.isZero() ? null :
                <ButtonBlock
                  type={"WITHDRAW"}
                  text={lang.withdraw || "Withdraw"}
                  onPress={onPressWithdraw}
                />
                }
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
                      page === 2
                        ? style.activeTextStyle
                        : style.inactiveTextStyle
                    }
                  >
                    {lang.tabRewards || "Rewards"}
                  </Text>
                </TabHeading>
              }
            >
              <TableRewards store={store} />
            </Tab>
          </Tabs>
        ) : (
          <>
            <View style={style.container}>
              <ValidatorCard
                value={DOMINANCE_VALUE}
                subtitle={lang.dominance || "DOMINANCE"}
                info={
                  lang.info1 ||
                  "Relative validator weight compared to the average. Lower is better"
                }
                cardIcon={<ChartIcon />}
              />
              <ValidatorCard
                value={QUALITY_VALUE}
                subtitle={lang.quality || "QUALITY"}
                info={"0 means average"}
                cardSymbol={"+"}
              />
            </View>
            <View>
              <ButtonBlock
                type={"STAKE"}
                text={lang.stake || "Stake"}
                onPress={changePage("sendStake")}
              />
            </View>
          </>
        )}
      </View>
    </>}}</Observer>
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
