import React from "react";
import {
  Left,
  Right,
  Text,
  Button,
  View,
  Icon,
  Item,
  Input,
  Title,
  Body,
  Header,
  Thumbnail
} from "native-base";
import { observe } from "mobx";
import { observer } from "mobx-react";
import styles from "../Styles.js";
import StandardLinearGradient from "../components/StandardLinearGradient.js";
import Toast from "@rimiti/react-native-toastify";
import GradientButton from "react-native-gradient-buttons";
import RefreshControl from "../components/RefreshControl.js";
import sendFuncs from "../wallet/send-funcs.js";
import walletsFuncs from "../wallet/wallets-funcs.js";
import Spinner from "../utils/spinner.js";
import StatusBar from "../components/StatusBar.js";
import getLang from "../wallet/get-lang.js";

const showToast = message => {
  console.log(message);
  this.toastify.show(message, 3000);
};

const btnWithdrawBtc = ({ store, web3t }) => {
  const {
    token,
    feeToken,
    network,
    send,
    wallet,
    pending,
    recipientChange,
    amountChange,
    amountUsdChange,
    amountEurChange,
    useMaxAmount,
    showData,
    showLabel,
    topup,
    history,
    cancel,
    sendAnyway,
    chooseAuto,
    chooseCheap,
    chosenAuto,
    chosenCheap,
    getAddressLink,
    getAddressTitle,
    round5edit,
    round5,
    sendOptions,
    sendTitle,
    isData,
    encodeDecode,
    changeAmount,
    invoice
  } = sendFuncs(store, web3t);

  const withdrawBtc = async () => {
    try {
      let withdrawSpinner = null;
      let checkingSpinner = new Spinner(store, "Checking balance", {
        displayDescription: true
      });
      let disposerSend = null;
      let disposerCurrent = null;
      //The next code is made to watch sending process and display spinners with adequate text
      //Store's data changes step-by-step in the following way
      //0. sending is true, confirmation is null - checking balance, we display Checking balance spinner
      //1. sending is true, confirmation is not null - user is asked to confirm transaction - we must hide all spinners
      //2. sending is true, confirmation is again null - user confirmed, so we display Sending funds spinner
      //   If the user declined confirmation, we will see this state for a short time
      //3. sending is false, confirmation is null - sending is completed and we must hide all spinners

      store.current.send.error = "";
      // console.log("Before Change", store.current.send.sending, store.current.confirmation);
      const onChange = () => {
        // console.log("Change detected", store.current.send.sending, store.current.confirmation);
        if (
          store.current.send.sending &&
          !withdrawSpinner &&
          !store.current.confirmation &&
          !checkingSpinner
        ) {
          // console.log("Making withdraw spinner");
          withdrawSpinner = new Spinner(store, "Sending funds", {
            displayDescription: true
          });
          return;
        }
        if (!store.current.send.sending && withdrawSpinner) {
          withdrawSpinner.finish();
          withdrawSpinner = null;
        }
        if (!store.current.send.sending && checkingSpinner) {
          checkingSpinner.finish();
          checkingSpinner = null;
        }
        if (!store.current.send.sending) {
          // console.log("Disposing observers spinner");
          disposerSend();
          disposerCurrent();
          return;
        }

        // console.log("Confirmation", store.current.confirmation);
        if (store.current.confirmation && checkingSpinner) {
          checkingSpinner.finish();
          checkingSpinner = null;
          return;
        }
      };

      disposerSend = observe(store.current.send, onChange);
      disposerCurrent = observe(store.current, onChange);

      sendAnyway();
    } catch (e) {
      console.error(e);
      this.toastify.show(e.message, 3000);
    }
  };
  const lang = getLang(store);

  const sendText = /*store.current.send.sending === true ? "..." : */ lang.send;

  return (
    <GradientButton
      style={styles.gradientBtn2}
      text={sendText}
      textStyle={{ fontSize: 18 }}
      gradientBegin="#9d41eb"
      gradientEnd="#9d41eb"
      gradientDirection="diagonal"
      height={56}
      width={"100%"}
      radius={10}
      onPressAction={withdrawBtc}
    />
  );
};

const buttonInactive = ({ store }) => {
  const lang = getLang(store);
  return (
    <GradientButton
      style={styles.gradientBtn2}
      text={lang.continue}
      textStyle={{ fontSize: 18 }}
      gradientBegin="#DDB5FF"
      gradientEnd="#DDB5FF"
      gradientDirection="diagonal"
      height={56}
      width={"100%"}
      radius={10}
    />
  );
};

const wrapNumber = text => {
  return {
    target: {
      value: text.replace(",", ".").replace(/[^0-9\.]/g, "")
    }
  };
};

const wrap = text => {
  return {
    target: {
      value: text
    }
  };
};

class Withdraw extends React.Component {
  constructor(props) {
    super(props);
    const { store, web3t } = props;
    store.current.send.amountSend = "";
    store.current.send.to = "";

  }
  render() {
    const { store, web3t } = this.props;
    const lang = getLang(store);
    const {
      token,
      feeToken,
      network,
      send,
      pending,
      recipientChange,
      amountChange,
      amountUsdChange,
      amountEurChange,
      useMaxAmount,
      showData,
      showLabel,
      topup,
      history,
      cancel,
      sendAnyway,
      chooseAuto,
      chooseCheap,
      chosenAuto,
      chosenCheap,
      getAddressLink,
      getAddressTitle,
      round5edit,
      round5,
      sendOptions,
      sendTitle,
      isData,
      encodeDecode,
      changeAmount,
      invoice
    } = sendFuncs(store, web3t);

    const wallets = walletsFuncs(store, web3t).wallets;

    const wallet = wallets.find(x => x.coin.token === store.current.wallet);

    const changePage = tab => () => {
      store.current.page = tab;
    };

    const InputAmountWithdraw = observer(({ send }) => (
      <Item regular style={styles.borderItemInput}>
        <Input
          onChangeText={text => amountChange(wrapNumber(text))}
          returnKeyType="done"
          style={styles.inputStyle}
          placeholder="0"
          value={send.amountSend}
          keyboardType="numeric"
          placeholderTextColor="rgba(255,255,255,0.50)"
          selectionColor={"rgba(255,255,255,0.60)"}
        />
      </Item>
    ));

    const InputAddressWithdrawBtc = observer(({ send }) => (
      <Item regular style={styles.borderItemInput}>
        <Input
          onChangeText={text => recipientChange(wrap(text))}
          returnKeyType="done"
          placeholder={wallet.network.mask}
          style={[styles.inputStyle, { fontSize: 18 }]}
          value={send.to}
          keyboardType={"default"}
          placeholderTextColor="rgba(255,255,255,0.50)"
          selectionColor={"rgba(255,255,255,0.60)"}
        />
      </Item>
    ));

    const SendButton = observer(({ send }) =>
      send.amountSend
        ? btnWithdrawBtc({ store, web3t })
        : buttonInactive({ store, web3t })
    );

    const refreshToken = async bool => {
      web3t.refresh((err, data) => {});
    };
    return (
      <View style={styles.viewFlex}>
        <StandardLinearGradient>
          <Toast
            ref={c => (this.toastify = c)}
            position={"top"}
            style={styles.toastStyle}
          />

          <Header style={styles.mtAndroid}>
            <Left style={styles.viewFlex}>
              <Button
                transparent
                style={styles.arrowHeaderLeft}
                onPress={changePage("wallet", true)}
              >
                <Icon
                  name="ios-arrow-back"
                  style={styles.arrowHeaderIconBlack}
                />
              </Button>
            </Left>
            <Body style={styles.viewFlex}>
              <Title style={styles.titleBlack}>{lang.send}</Title>
            </Body>
            <Right style={styles.viewFlex}>
              <Thumbnail small source={{ uri: wallet.coin.image }} />
            </Right>
          </Header>
          <StatusBar />
          <RefreshControl swipeRefresh={refreshToken}>
            <View style={styles.bodyBlock}>
              <View>
                <View style={styles.bodyBalance}>
                  <View style={styles.bodyBlock3}>
                    <Text style={styles.nameTokenSwiper1}>
                      {lang.totalBalance}
                    </Text>
                  </View>
                  <View style={styles.bodyBlock3}>
                    <Text style={styles.totalBalance}>
                      {wallet.balance}{" "}
                      <Text style={styles.nameToken}>
                        {wallet.coin.token.toUpperCase()}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.viewMt}>
                  <View>
                    <Text style={styles.titleHeader}>{lang.amount}:</Text>
                  </View>
                  <InputAmountWithdraw send={store.current.send} />
                  <View style={styles.viewTextInputDown}>
                    <Text note style={styles.textInputDownRight}>
                      {lang.fee} {store.current.send.amountSendFee}{" "}
                      {wallet.coin.token.toUpperCase()}
                    </Text>
                    <Text style={styles.errorSend}>
                      {store.current.send.error}
                    </Text>
                  </View>
                </View>
                <View style={styles.viewMt}>
                  <View>
                    <Text style={styles.titleHeader}>
                      {lang.recipient} {wallet.coin.token.toUpperCase()}{" "}
                      {lang.address}:
                    </Text>
                  </View>
                  <InputAddressWithdrawBtc send={store.current.send} />
                </View>
              </View>
            </View>
          </RefreshControl>
        </StandardLinearGradient>
        <View style={styles.viewMonoBuy}>
          <View style={styles.containerScreen}>
            <View style={styles.marginBtn}>
              <SendButton send={store.current.send} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default ({ store, web3t }) => <Withdraw store={store} web3t={web3t} />;
