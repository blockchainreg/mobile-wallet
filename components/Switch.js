import React, { useState } from "react";
import {
  Text,
} from "native-base";
import {
    View,
    StyleSheet,
    Switch
  } from "react-native";
import Images from "../Images";


export default (props) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    return (
        <View style={styles.container}>
            <Text style={styles.styleTitleSwitch}>{props.text}</Text>
          <Switch
            trackColor={{ false: "#808080", true: Images.colorGreen }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#808080"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      styleTitleSwitch: {
          color: Images.colorGreen,
          fontSize: 13,
          fontFamily: "Fontfabric-NexaBold",
          marginRight: 10

      }
});
