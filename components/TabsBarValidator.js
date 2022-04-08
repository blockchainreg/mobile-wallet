import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Clipboard,
  Vibration,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Observer, observer } from 'mobx-react';
import Images from '../Images';
import {
  ChartIcon,
  PercentIcon,
  PlusIcon,
  ValidatorsIcon,
  VelasIcon,
} from '../svg/index';
import ValidatorCard from './ValidatorCard';
import ButtonBlock from '../components/ButtonBlock.js';
import DetailsValidatorComponent from '../components/DetailsValidatorComponent.js';
import TableRewards from '../components/TableRewards';
import getLang from '../wallet/get-lang.js';
import { formatStakeAmount } from '../utils/format-value';
import spin from '../utils/spin.js';
import { TabView, TabBar } from 'react-native-tab-view';

const GRAY_COLOR = 'rgba(255, 255, 255, 0.18)';

const GenericValidatorCard = observer(
  ({ getValue, getSubtitle, getInfo, subtitleSmall, cardIcon }) => (
    <ValidatorCard
      value={getValue()}
      subtitle={getSubtitle()}
      cardIcon={cardIcon}
      info={getInfo()}
      subtitleSmall={subtitleSmall}
    />
  )
);

const Stake = observer(({ details, lang, changePage, stakingStore }) => {
  return (
    <ScrollView>
      <View style={style.container}>
        <GenericValidatorCard
          getValue={() => `${formatStakeAmount(details.activeStake)} VLX`}
          getSubtitle={() => lang.totalStake || 'TOTAL STAKE'}
          getInfo={() => 'Total stake of validator'}
          cardIcon={
            <ValidatorsIcon
              fill={Images.colorGreen}
              type={'STAKE'}
              width="17"
              height="17"
            />
          }
        />
        <GenericValidatorCard
          getValue={() =>
            details.annualPercentageRate === null
              ? '...'
              : details.annualPercentageRate
          }
          getSubtitle={() => lang.annual || 'ANNUAL PERCENTAGE RATE'}
          getInfo={() =>
            lang.info3 ||
            'APR is calculated based on the results of the previous epoch'
          }
          cardIcon={<PercentIcon />}
          subtitleSmall
        />
        <GenericValidatorCard
          getValue={() =>
            details.dominance === null ? '...' : details.dominance.toFixed(4)
          }
          getSubtitle={() => lang.dominance || 'DOMINANCE'}
          getInfo={() =>
            lang.info1 ||
            'Relative validator weight compared to the average. Lower is better'
          }
          cardIcon={<ChartIcon />}
        />

        <GenericValidatorCard
          getValue={() => details.commission}
          getSubtitle={() => lang.validatorInterest || 'VALIDATOR INTEREST'}
          getInfo={() =>
            'A commission that you pay to validator from each reward'
          }
          cardIcon={<PercentIcon />}
        />
      </View>
      <ButtonBlock
        type={'STAKE_MORE'}
        text={
          details.totalActiveStake
            ? lang.stakeMore || 'Stake More'
            : 'Loading...'
        }
        onPress={changePage('sendStake')}
      />
      {details.totalAvailableForWithdrawRequestStake &&
        details.totalAvailableForWithdrawRequestStake.gte(
          stakingStore.rent
        ) && (
          <ButtonBlock
            type={'REQUEST_WITHDRAW'}
            text={lang.requestWithdraw || 'Request Withdraw'}
            onPress={changePage('exitValidator')}
          />
        )}
    </ScrollView>
  );
});

const Withdrawals = observer(({ lang, details, onPress }) => (
  <ScrollView>
    <View style={style.container}>
      <GenericValidatorCard
        getValue={() =>
          details.totalWithdrawRequested
            ? formatStakeAmount(details.totalWithdrawRequested)
            : '...'
        }
        getSubtitle={() => lang.totalWithdraw || 'TOTAL WITHDRAW REQUESTED'}
        getInfo={() => lang.totalWithdraw || 'TOTAL WITHDRAW REQUESTED'}
        cardIcon={<VelasIcon />}
        subtitleSmall
      />
      <GenericValidatorCard
        getValue={() =>
          details.availableWithdrawRequested
            ? formatStakeAmount(details.availableWithdrawRequested)
            : '...'
        }
        getSubtitle={() => lang.availableWithdraw || 'AVAILABLE FOR WITHDRAW'}
        getInfo={() => lang.availableWithdraw || 'AVAILABLE FOR WITHDRAW'}
        cardIcon={<VelasIcon />}
        subtitleSmall
      />
    </View>
    {!details.availableWithdrawRequested ||
    details.availableWithdrawRequested.isZero() ? null : (
      <ButtonBlock
        type={'WITHDRAW'}
        text={lang.withdraw || 'Withdraw'}
        onPress={onPress}
      />
    )}
  </ScrollView>
));

const Rewards = observer(({ store }) => {
  return (
    <>
      <TableRewards store={store} />
    </>
  );
});

const DetailsValidatorObserver = observer(
  ({ details, lang, copyAddress, copyName, store }) => {
    const isMyStake = !details.myStake.isZero();

    return (
      <DetailsValidatorComponent
        address={details.address}
        name={details.name}
        copyAddress={copyAddress}
        copyName={copyName}
        isActive={details.status === 'active'}
        infoApr={
          isMyStake
            ? false
            : lang.info3 ||
              'APR is calculated based on the results of the previous epoch'
        }
        infoActiveStake={
          isMyStake
            ? lang.info4 ||
              'Only 25% of active stake can be activated per epoch. '
            : false
        }
        readMore={lang.read || 'Read more'}
        link={
          'https://support.velas.com/hc/en-150/articles/360021044820-Delegation-Warmup-and-Cooldown'
        }
        subtitle1={
          isMyStake ? 'MY ACTIVE STAKE' : lang.totalStake || 'TOTAL STAKE'
        }
        value1={
          isMyStake
            ? `${
                details.myActiveStake === null ? '...' : details.myActiveStake
              } %`
            : `${formatStakeAmount(details.activeStake)} VLX`
        }
        subtitle2={
          isMyStake
            ? lang.myStake || 'MY STAKE'
            : lang.annual || 'ANNUAL PERCENTAGE RATE'
        }
        value2={
          isMyStake
            ? `${formatStakeAmount(details.myStake)} VLX`
            : `${
                details.annualPercentageRate === null
                  ? '...'
                  : details.annualPercentageRate
              } %`
        }
        store={store}
      />
    );
  }
);

const NotStakedValidatorBody = observer(({ lang, details, changePage }) => (
  <ScrollView>
    <View style={style.container}>
      <GenericValidatorCard
        getValue={() =>
          details.dominance === null ? '...' : details.dominance.toFixed(4)
        }
        getSubtitle={() => lang.dominance || 'DOMINANCE'}
        getInfo={() =>
          lang.info1 ||
          'Relative validator weight compared to the average. Lower is better'
        }
        cardIcon={<ChartIcon />}
      />
      <GenericValidatorCard
        getValue={() => details.commission}
        getSubtitle={() => lang.validatorInterest || 'VALIDATOR INTEREST'}
        getInfo={() =>
          'A commission that you pay to validator from each reward'
        }
        cardIcon={<PercentIcon />}
      />
    </View>
    <ButtonBlock
      type={'STAKE'}
      text={lang.stake || 'Stake'}
      onPress={changePage('sendStake')}
    />
  </ScrollView>
));

const renderTabBar = (props) => (
  <TabBar
    {...props}
    renderIcon={({ route, focused }) => (
      <ValidatorsIcon
        fill={focused ? Images.colorGreen : GRAY_COLOR}
        type={route.type}
      />
    )}
    renderLabel={({ route, focused, color }) => (
      <Text
        style={{
          color: focused ? Images.colorGreen : GRAY_COLOR,
          fontFamily: 'Fontfabric-NexaRegular',
          fontSize: 14,
        }}
      >
        {route.title}
      </Text>
    )}
    indicatorStyle={{ backgroundColor: Images.colorGreen }}
    style={{ backgroundColor: Images.velasColor4 }}
    activeColor={Images.colorGreen}
    inactiveColor={GRAY_COLOR}
    tabStyle={{
      flexDirection: 'row',
      borderBottomColor: GRAY_COLOR,
      borderBottomWidth: 0.5,
    }}
  />
);

const TabsBarValidator = ({ store }) => {
  const { stakingStore } = store;

  const [index, setIndex] = React.useState(0);
  const lang = getLang(store);
  const [routes] = React.useState([
    { key: 'first', title: lang.tabStake || 'Stake', type: 'STAKE' },
    {
      key: 'second',
      title: lang.tabWithdrawals || 'Withdrawals',
      type: 'WITHDRAW',
    },
    { key: 'third', title: lang.tabRewards || 'Rewards', type: 'REWARDS' },
  ]);
  const changePage = (tab) => () => {
    store.current.page = tab;
  };

  return (
    <Observer>
      {() => {
        if (stakingStore.isRefreshing) return null;
        const details = stakingStore.getValidatorDetails();

        const ADDRESS = details.address;

        const copyAddress = async () => {
          const DURATION = 1000 / 10;
          await Clipboard.setString(details.address);
          Vibration.vibrate(DURATION);
          Alert.alert(lang.copied, '', [{ text: lang.ok }]);
        };
        const copyName = async () => {
          const DURATION = 1000 / 10;
          await Clipboard.setString(details.name);
          Vibration.vibrate(DURATION);
          Alert.alert(lang.copied, '', [{ text: lang.ok }]);
        };

        const onPressWithdraw = async () => {
          if (!details.availableWithdrawRequested) return null;
          spin(
            store,
            lang.progressWithdraw || 'Withdrawal in progress',
            async (cb) => {
              try {
                const result = await stakingStore.withdrawRequested(ADDRESS);
                const result1 =
                  await stakingStore.reloadWithRetryAndCleanCache();
                cb(null, result, result1);
              } catch (err) {
                cb(err);
              }
            }
          )((err, result, result1) => {
            if (err) {
              setTimeout(() => {
                Alert.alert(
                  lang.wrong ||
                    'Something went wrong. Please contact support. You can still use web interface for full staking support.'
                );
              }, 1000);
              console.error(err);
              return;
            }
            changePage('confirmWithdrawal')();
          });
        };

        const renderScene = ({ route }) => {
          switch (route.key) {
            case 'first':
              return (
                <Stake
                  details={details}
                  lang={lang}
                  changePage={changePage}
                  stakingStore={stakingStore}
                />
              );
            case 'second': {
              return (
                <Withdrawals
                  onPress={onPressWithdraw}
                  lang={lang}
                  details={details}
                />
              );
            }
            case 'third':
              return <Rewards store={store} />;
            default:
              return null;
          }
        };

        const isMyStake = !details.myStake.isZero();
        return (
          <>
            <DetailsValidatorObserver
              details={details}
              lang={lang}
              copyAddress={copyAddress}
              copyName={copyName}
              store={store}
            />
            {isMyStake ? (
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                style={{ backgroundColor: Images.velasColor4 }}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
              />
            ) : (
              <NotStakedValidatorBody
                lang={lang}
                details={details}
                changePage={changePage}
              />
            )}
          </>
        );
      }}
    </Observer>
  );
};

export default TabsBarValidator;

const style = StyleSheet.create({
  activeTextStyle: {
    color: Images.colorGreen,
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Fontfabric-NexaRegular',
  },
  inactiveTextStyle: {
    color: GRAY_COLOR,
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Fontfabric-NexaRegular',
  },
  tabStyle: {
    backgroundColor: Images.velasColor4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  btnBottom: {
    marginBottom: 20,
  },
});
