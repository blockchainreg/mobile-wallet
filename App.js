import "./global.js";
import prngSync from './prng-sync.js';
import * as React from "react";
import { View, StatusBar, SafeAreaView } from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react";
//import Store from "./Store.js";
import pages from "./Pages.js";
import styles from "./Styles.js";
import StartPage from "./pages/StartPage";
//import web3t from './web3t.js';
import Store from './wallet/data-scheme.js';
//console.log(web3);



const store = observable(Store);
let web3t = null;


const Main = observer(({ store }) => {
  return pages[store.current.page]({ store, web3t });
});

const footerVisible = () => {
  store.footerVisible = false;
};


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
  }

  componentDidMount() {
      prngSync.then(() => {
        this.setState({ready: true});
        web3 = require('./wallet/web3.js');
        const { saved } = require('./wallet/seed.js');
        web3t = web3(store);
        store.current.page = saved === true ? "locked" : "register";


        if (true)  { // debug

          store.signUpInputMailField = "a.stegno@gmail.com";
          store.signUpInputPasswordField = "asdfasdf234234WWW";

        }
      });
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
