import React from "react";
import GradientButton from "react-native-gradient-buttons";
// GradientButton truncated last symbol on some phones. That is why we add space here.
export default (props) => <GradientButton
  {...props }
  text={props.text + " "}
/>;
