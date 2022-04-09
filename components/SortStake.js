import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import Modal from 'react-native-modal'; // 2.4.0
import { ListItem } from 'native-base';
import style from '../Styles.js';
import { Button, Icon, Left, Body, Right } from 'native-base';
import Images from '../Images.js';
import { CheckBox } from 'react-native-elements';

class App extends Component {
  constructor(props, store) {
    super(props);
    this.state = {
      visibleModal: null,
      checked1: this.props.checked1,
      checked2: this.props.checked2,
    };
    console.log('props.checked1', props.checked1);
    console.log('props.checked2', props.checked2);
  }
  _onPressTotal = () => {
    this.setState({ checked1: !this.state.checked1 });
    this.props.onPressTotal();
  };
  _onPressApr = () => {
    this.setState({ checked2: !this.state.checked2 });
    this.props.onPressApr();
  };
  _closeModal = () => {
    this.setState({ visibleModal: null });
  };

  _renderButton = (onPress) => (
    <Button transparent onPress={onPress}>
      <Icon
        type="MaterialCommunityIcons"
        name="sort"
        style={[style.refreshHeaderIcon, { fontSize: 28 }]}
      />
    </Button>
  );
  _renderItems = () => {
    return (
      <View style={styles.CheckBox}>
        <CheckBox
          title={'Total staked'}
          iconRight
          containerStyle={styles.checkBox}
          textStyle={styles.text}
          checkedColor={Images.colorGreen}
          checked={this.state.checked1}
          onPress={this._onPressTotal}
        />
        <CheckBox
          title={'APR'}
          iconRight
          containerStyle={styles.checkBox}
          textStyle={styles.text}
          checkedColor={Images.colorGreen}
          checked={this.state.checked2}
          onPress={this._onPressApr}
        />
      </View>
    );
  };
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <ListItem itemHeader noBorder style={styles.listItemHeader}>
        <Left style={{ flex: 0 }} />
        <Body style={{ flex: 1 }}>
          <Text style={styles.titleText}>Sort by</Text>
        </Body>
        <Right style={{ flex: 1 }}>
          <Button
            transparent
            // onPress={() => this.setState({ visibleModal: null })}
            onPress={this._closeModal}
          >
            <Icon
              type="MaterialIcons"
              name="close"
              style={[style.refreshHeaderIcon, { fontSize: 28 }]}
            />
          </Button>
        </Right>
      </ListItem>
      {this._renderItems()}
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this._renderButton(() => this.setState({ visibleModal: 1 }))}
        <Modal
          isVisible={this.state.visibleModal === 1}
          style={styles.bottomModal}
          onBackdropPress={() => this.setState({ visibleModal: null })}
        >
          {this._renderModalContent()}
        </Modal>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  modalContent: {
    backgroundColor: Images.velasColor4,
    flex: 0.3,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  CheckBox: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#ffffff20',
  },
  checkBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  text: {
    color: '#fff',
    flex: 1,
    fontSize: 18,
    marginLeft: 0,
    fontFamily: 'Fontfabric-NexaRegular',
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Fontfabric-NexaBold',
  },
  listItemHeader: {
    backgroundColor: Images.velasColor4,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ffffff40',
  },
});
