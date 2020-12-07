import * as React from "react";
import { View, Text, PanResponder, SafeAreaView} from "react-native";
import { observable, intercept, observe } from "mobx";
import { observer } from "mobx-react";
import { Root } from "native-base";
//import Store from "./Store.js";
import pages from "./Pages.js";
import styles from "./Styles.js";
// import StartPage from "./pages/StartPage";
//import web3t from './web3t.js';
import Store from './wallet/data-scheme.js';
import web3 from './wallet/web3.js';
import { saved } from './wallet/seed.js';
import Confirm from './components/Confirm.js';
import Spinner from 'react-native-loading-spinner-overlay';
import HistoryDetail from './pages/HistoryDetail.js';



//Extend the store here !!!
//------------------------------
//mobile specific defaults (start)
//Store.current.expanded = false;
Store.current.filterVal = { apply: "", temp: "" }
Store.current.seedIndex = 0
Store.current.seedIndexes = [];
Store.current.seedWords = [];
// if ((localStorage.getItem("lang") || "").length === 0)
//   Store.current.page = "LangPage"
Store.lang = localStorage.getItem("lang") || "en";
Store.current.auth = {
    isLocalAuthEnabled: null,
    isAuthenticating: false,
    failedCount: 0,
    isLoggingIn: false,
    localAuthError: null
};
Store.current.isAutocompleteHidden = false;
Store.current.refreshingBalances = false;
Store.current.loadingDescriptions = [];
Store.current.loadingSpinners = [];

//module specific defaults (end)
//------------------------------
//Extend the store here !!!

const store = observable(Store);
const web3t = web3(store);

//TODO: Move to separate file
const renderSpinner = ({ store }) => {
    const {current} = store;
    const text = current.loadingDescriptions.length === 0 ? "" : current.loadingDescriptions[0];
    const isVisible = current.loadingSpinners.length > 0;
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

  // console.log("current descriptions", current.loadingDescriptions);


  const page = pages[current.page];
  console.log('Rendering', current.page);
  if (!page) {
    return (
      <View style={{alignItems: 'stretch', justifyContent: 'center', flex: 1, backgroundColor: '#fff'}}>
        <Text>Page {current.page} not found</Text>
      </View>
    );
  }
  return (
    <Root>
      {renderSpinner({ store })}
      {current.confirmation
        ?<Confirm
          confirmation={current.confirmation}
          onYes={() => {current.confirmationCallback(true)}}
          onNo={() => {current.confirmationCallback(false)}}
        />
        :null
      }
      {page( {store, web3t })}
      {HistoryDetail({ store })}
    </Root>
  );
});


const state = {
  timer: null
}

observe(store.current, "page", ()=> {
  resetTimer();
});

observe(store.current.loadingSpinners, () => {
  resetTimer();
});

const resetTimer = () => {
    clearTimeout(state.timer);
    if (store.current.loadingSpinners.length === 0) {
      state.timer = setTimeout(lockWallet, 60000);
    }
    return true;
}


const lockWallet = () => {

      if (store.current.page !== "wallets")
        return resetTimer();
      //console.log("lang",localStorage.getItem("lang"));
      //if (!localStorage.getItem("lang"))
      //   store.current.page = "LangPage";
      resetTimer();
};


export default class AppReady extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true
    };
  }


  _panResponder = {};



  componentDidMount() {
    store.current.page = saved() === true ? "locked" : "register";

    this._panResponder = PanResponder.create({

      onStartShouldSetPanResponder: resetTimer,
      onMoveShouldSetPanResponder: resetTimer,
      onStartShouldSetPanResponderCapture: resetTimer,
      onMoveShouldSetPanResponderCapture: resetTimer,
      onPanResponderTerminationRequest: resetTimer,
      onShouldBlockNativeResponder: resetTimer,
    });
    resetTimer();

  }


  render() {
    if (this.state.ready === false) {
      return <StartPage store={store} />;
    }
    return (
      <Main store={store} current={store.current}/>
    );
  }
}
