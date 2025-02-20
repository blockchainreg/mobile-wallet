import * as React from 'react';
import { View, Text, PanResponder } from 'react-native';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { Root } from 'native-base';
import pages from './Pages.js';
import styles from './Styles.js';
import Store from './wallet/data-scheme.js';
import web3 from './wallet/web3.js';
import { saved } from './wallet/seed.js';
import Confirm from './components/Confirm.js';
import ConfirmDetailed from './components/ConfirmDetailed.js';
import BridgeDetailsModal from './components/BridgeDetailsModal.js';
import Spinner from 'react-native-loading-spinner-overlay';
import HistoryDetail from './pages/HistoryDetail.js';

//Extend the store here !!!
//------------------------------
//mobile specific defaults (start)
//Store.current.expanded = false;
Store.current.filterVal = { apply: '', temp: '' };
Store.current.seedIndex = 0;
Store.current.seedIndexes = [];
Store.current.seedWords = [];
Store.lang = localStorage.getItem('lang') || 'en';
Store.sort = localStorage.getItem('sort') || 'apr';
Store.current.auth = {
  isLocalAuthEnabled: null,
  isAuthenticating: false,
  failedCount: 0,
  isLoggingIn: false,
  localAuthError: null,
};
Store.current.isAutocompleteHidden = false;
Store.current.refreshingBalances = false;
Store.current.loadingDescriptions = [];
Store.current.loadingSpinners = [];
Store.current.networkDetails = {};
Store.current.currentNetworkDetails = null;
Store.current.idleTimer = null;

//module specific defaults (end)
//------------------------------
//Extend the store here !!!

const store = observable(Store);
const web3t = web3(store);

//TODO: Move to separate file
const renderSpinner = ({ store }) => {
  const { current } = store;
  const text =
    current.loadingDescriptions.length === 0
      ? ''
      : current.loadingDescriptions[0];
  const isVisible = current.loadingSpinners.length > 0 && !current.confirmation;
  if (!isVisible) return null;
  return (
    <Spinner
      visible={isVisible}
      overlayColor="rgba(11, 12, 39, 0.70)"
      indicatorStyle={{ color: 'white', justifyContent: 'flex-start', top: 50 }}
      size="small"
      animation="fade"
      textContent={text}
      textStyle={styles.spinnerTextStyle}
      cancelable={true}
    />
  );
};

const Main = observer(({ store, current }) => {
  const page = pages[current.page];
  if (!page) {
    return (
      <View
        style={{
          alignItems: 'stretch',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <Text>Page {current.page} not found</Text>
      </View>
    );
  }
  return (
    <Root>
      {renderSpinner({ store })}
      {current.confirmation ? (
        <Confirm
          title={current.title}
          confirmation={current.confirmation}
          onYes={() => {
            current.confirmationCallback(true);
          }}
          onNo={() => {
            current.confirmationCallback(false);
          }}
          store={store}
        />
      ) : null}
      {current.confirmationComponent ? (
        <ConfirmDetailed
          title={current.title}
          confirmation={current.confirmationComponent}
          onYes={() => {
            current.confirmationCallback(true);
          }}
          onNo={() => {
            current.confirmationCallback(false);
          }}
          store={store}
        />
      ) : null}
      {current.currentNetworkDetails ? (
        <BridgeDetailsModal
          store={store}
          data={current.currentNetworkDetails}
          onNo={() => {
            current.bridgeInfoCallback(false);
          }}
        />
      ) : null}
      {page({ store, web3t })}
      {HistoryDetail({ store })}
    </Root>
  );
});

const ALLOWED_IDLE_TIME_MS = 60 * 1000;

const lockWallet = () => {
  store.current.page = 'locked';
};

const resetIdleTimer = () => {
  if (store.current.idleTimer) {
    clearTimeout(store.current.idleTimer);
  }
  if (store.current.loadingSpinners.length === 0) {
    store.current.idleTimer = setTimeout(lockWallet, ALLOWED_IDLE_TIME_MS);
  }
  return true;
};

observe(store.current, 'page', resetIdleTimer);

observe(store.current.loadingSpinners, resetIdleTimer);

export default class AppReady extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true,
    };
  }

  _panResponder = {};

  componentDidMount() {
    store.current.page = saved() === true ? 'locked' : 'register';

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: resetIdleTimer,
      onMoveShouldSetPanResponder: resetIdleTimer,
      onStartShouldSetPanResponderCapture: resetIdleTimer,
      onMoveShouldSetPanResponderCapture: resetIdleTimer,
      onPanResponderTerminationRequest: resetIdleTimer,
      onShouldBlockNativeResponder: resetIdleTimer,
    });
    resetIdleTimer();
  }

  render() {
    if (this.state.ready === false) {
      return <StartPage store={store} />;
    }
    return <Main store={store} current={store.current} />;
  }
}
