import React, {Component} from "react";
import { TextInput } from "react-native";

function isDigit(c) {
  return c >= '0' && c <= '9';
}

export default class InputAmount extends Component{
  state = {
    selection: {start: 0, end: 0},
    value: "",
    fixSelection: null
  };
  inputRef = React.createRef();

  getNormalizedValue(value) {
    return value.split(',').join('').split('.', 2).join('.');
  }

  static getFormattedValue(value) {
    let parts = value.split('.', 2);
    let fraction = parts.length === 2 ? "." + parts[1] : "";
    let int = parts[0];
    let cnt = 0;
    for(let i = int.length - 1; i >= 0; i--) {
      if (cnt === 3 && int[i] === ',' && i > 0) {
        cnt = 0;
        continue;
      }
      if (cnt === 3 && isDigit(int[i])){
        int = [int.slice(0, i+1), int.slice(i+1)].join(',');
        cnt = 1;
        continue;
      }
      if ((cnt !== 3 || i == 0) && int[i] === ',') {
        int = [int.slice(0, i), int.slice(i+1)].join('');
        continue;
      }
      if (isDigit(int[i])) {
        cnt++;
        continue;
      }
      if (int[i] !== '|') {
        int = [int.slice(0, i), int.slice(i+1)].join('');
        continue;
      }
    }
    while (int.length > 1 && (int[0] === '0' || int[0] === ',')) int = int.slice(1);
    fraction = Array.from(fraction).filter(c => c === '.' || isDigit(c)).join('').slice(0, 3);
    return int + fraction;
  }

  handleSelectionChange = (e) => {
    const {selection} = e.nativeEvent;
    if (this.state.fixSelection) {
      return;
    }

    this.setState({selection});
  };

  handleTextChange = (text) => {
    const text2 = [text.slice(0, this.state.selection.end+1), '|', text.slice(this.state.selection.end+1)].join('');
    const formatted = InputAmount.getFormattedValue(text2);
    const newSelection = Math.max(0, formatted.indexOf("|"));
    const value = formatted.split('|').join('');
    this.setState({value});
    if (text !== value) {
      const selection = {
        start: newSelection,
        end: newSelection,
      };
      // this.inputRef.current.setNativeProps({selection});
    }
    this.props.onChangeText && this.props.onChangeText(this.getNormalizedValue(value));
  };

  render() {
    return <TextInput
      value={this.state.value}
      placeholder={this.props.placeholder}
      onSelectionChange={this.handleSelectionChange}
      onChangeText={this.handleTextChange}
      ref={this.inputRef}
      style={this.props.style}
      selectionColor={this.props.selectionColor}
      placeholderTextColor={this.props.placeholderTextColor}
      returnKeyType={this.props.returnKeyType}
      keyboardAppearance={this.props.keyboardAppearance}
      keyboardType={this.props.keyboardType}
      maxLength={this.props.maxLength}
    />;
  }

  static getDerivedStateFromProps(props, state) {
    if (state.value !== props.value) {
      if (typeof props.value !== 'string') {
        console.warn('Expected string value', props.value);
        return null;
      }
      return {value: InputAmount.getFormattedValue(props.value)};
    }
    return null;
  }
}
