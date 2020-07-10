import React from "react";
import GradientButton from "react-native-gradient-buttons";
// GradientButton truncated last symbol(s) on some phones. That is why we add spaces here.
// It also truncate by word boundary so replace spaces to nbsp.
export default (props) => <GradientButton
  {...props }
  text={(props.text + '   ').split(' ').join('\u00A0')}
/>;
