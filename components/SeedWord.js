import bip39 from 'bip39';
import Autocomplete from 'react-native-autocomplete-input';
import React from 'react';
import {
  Image,
  Clipboard,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Platform,
} from 'react-native';
import {
  Input,
  Item,
  Text,
  Button,
  View,
  Icon,
  CardItem,
  Body,
  Header,
  Left,
  Right,
  Textarea,
} from 'native-base';

import styles from '../Styles.js';
import getLang from '../wallet/get-lang.js';

export default (store, changeSeed, number) => {
  const lang = getLang(store);
  let autocompleteData =
    !store.signUpConfirmSeedField || store.signUpConfirmSeedField.length < 2
      ? []
      : bip39.wordlists.EN.filter((word) =>
          word.startsWith(store.signUpConfirmSeedField)
        );
  let inputStyle = styles.inputSize;
  if (
    store.signUpConfirmSeedField &&
    store.signUpConfirmSeedField.length >= 2 &&
    !autocompleteData.length
  ) {
    inputStyle = styles.autocompleteInputIncorrect;
  } else if (bip39.wordlists.EN.indexOf(store.signUpConfirmSeedField) !== -1) {
    inputStyle = styles.autocompleteInputCorrect;
  }
  if (
    autocompleteData.length === 1 &&
    autocompleteData[0] === store.signUpConfirmSeedField
  ) {
    autocompleteData = [];
  }
  if (store.current.isAutocompleteHidden) {
    autocompleteData = [];
  }
  const setAutocomplete = (seed) => {
    store.current.isAutocompleteHidden = true;
    changeSeed(seed);
  };
  const changeSeedInternal = (seed) => {
    store.current.isAutocompleteHidden = false;
    changeSeed(seed);
  };

  const input = (
    <View style={styles.bodyConfirm}>
      <Item style={styles.borderItem}>
        <Icon active name="key" style={{ color: '#fff' }} />
        <Input
          autoFocus
          autoCorrect={false}
          value={store.signUpConfirmSeedField}
          onChangeText={changeSeedInternal}
          autoCapitalize="none"
          secureTextEntry={false}
          returnKeyType="done"
          placeholder={lang.placeholderConfirmSeed + ' ' + '#' + (number + 1)}
          placeholderTextColor="rgba(255,255,255,0.60)"
          style={inputStyle}
          selectionColor={
            Platform.OS === 'ios' ? '#fff' : 'rgba(255,255,255,0.60)'
          }
          keyboardAppearance="dark"
        />
      </Item>
    </View>
  );

  return (
    <Autocomplete
      data={autocompleteData}
      keyExtractor={(item) => item}
      containerStyle={styles.autocompleteContainerStyle}
      inputContainerStyle={styles.autocompleteInputContainerStyle}
      listStyle={styles.autocompleteListStyle}
      renderTextInput={(props) => input}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setAutocomplete(item)} key={item}>
          <Text style={styles.autocompleteListItemStyle}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};
