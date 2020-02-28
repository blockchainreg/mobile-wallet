import * as React from "react";
import { View, Text, PanResponder} from "react-native";
import { observable, intercept } from "mobx";
import { observer } from "mobx-react";
//import Store from "./Store.js";
import pages from "./Pages.js";
import styles from "./Styles.js";
import StartPage from "./pages/StartPage";
//import web3t from './web3t.js';
import Store from './wallet/data-scheme.js';
import web3 from './wallet/web3.js';
import { saved } from './wallet/seed.js';
import Confirm from './components/Confirm.js';
import Spinner from 'react-native-loading-spinner-overlay';
import HistoryDetail from './pages/HistoryDetail.js';
//console.log(web3);

//mobile specific defaults (start)
//Store.current.expanded = false;
Store.current.filterVal = { apply: "", temp: "" }
//module specific defaults (end)

const store = observable(Store);
const web3t = web3(store);

//TODO: Move to separate file
const renderSpinner = ({ store }) => {
    const {current} = store;
    const text = current.loadingDescriptions.join(", ");
    const isVisible = current.loading || current.loadingSpinners.length > 0;
    return (
      <Spinner
        visible={isVisible}
        overlayColor="rgba(41, 12, 100, 0.90)"
        textStyle={{ color: 'white', textShadowColor: 'transparent' }}
        indicatorStyle={{ color: 'white', justifyContent: 'flex-start', top: 50 }}
        size="large"
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
  if (!page) {
    return (
      <View style={{alignItems: 'stretch', justifyContent: 'flex-center', flex: 1, backgroundColor: '#fff'}}>
        <Text>Page {current.page} not found</Text>
      </View>
    );
  }
  return (
    <>
      {renderSpinner({ store })}
      {HistoryDetail({ store })}
      {current.confirmation
        ?<Confirm
          confirmation={current.confirmation}
          onYes={() => {current.confirmationCallback(true)}}
          onNo={() => {current.confirmationCallback(false)}}
        />
        :null
      }
      {page( {store, web3t })}
    </>
  );
});


const state = {
  timer: null
}

intercept(store.current, "page", (x)=> {
  resetTimer();
  return x;
})

const resetTimer = () => {
    clearTimeout(state.timer);
    state.timer = setTimeout(lockWallet, 60000)
    return true;
}


const lockWallet = () => {

      if (store.current.page !== "wallets" || store.current.loading == true)
        return resetTimer();

      store.current.page = "locked";
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
