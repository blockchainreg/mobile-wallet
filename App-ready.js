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
//console.log(web3);

const store = observable(Store);
const web3t = web3(store);

const Main = observer(({ store }) => {
  const {current} = store;
  // console.log("current descriptions", current.loadingDescriptions);
  const renderSpinner = () => {
    const text = current.loadingDescriptions.join(", ");
    const isVisible = current.loading || current.loadingSpinners.length > 0;
    return (
      <Spinner
        visible={isVisible}
        overlayColor="rgba(41, 12, 100, 0.90)"
        textStyle={{ color: 'white', textShadowColor: 'transparent' }}
        indicatorStyle={{ color: 'white', justifyContent: 'start', top: 50 }}
        size="large"
        animation="fade"
        textContent={text}
        textStyle={styles.spinnerTextStyle}
        cancelable={true}
      />
    );
  };

  const page = pages[store.current.page];
  if (!page) {
    return (
      <View style={{alignItems: 'stretch', justifyContent: 'center', flex: 1, backgroundColor: '#fff'}}>
        <Text>Page {store.current.page} not found</Text>
      </View>
    );
  }
  return (
    <>
      {renderSpinner()}
      {store.current.confirmation
        ?<Confirm
          confirmation={store.current.confirmation}
          onYes={() => {store.current.confirmationCallback(true)}}
          onNo={() => {store.current.confirmationCallback(false)}}
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
    //console.log("reset timer");
    clearTimeout(state.timer);
    state.timer = setTimeout(lockWallet, 120000)
    return true;
}


const lockWallet = () => {

      if (store.current.page !== "wallets" || store.current.loading == true) {
        return resetTimer();
      }
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
      <Main store={store} />
    );
  }
}
