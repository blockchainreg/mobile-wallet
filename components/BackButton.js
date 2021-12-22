import React, {useEffect} from 'react';
import {BackHandler, Animated, TouchableOpacity} from "react-native";
import {Button, Icon} from 'native-base';

import styles from '../Styles.js';

export default ({onBack, transparent, style }) => {
  const back = () => {
    onBack();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', back);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', back);
    };
  });

	const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
		<Animated.View>
			<AnimatedTouchable onPress={onBack} >
				<Icon
					name="ios-arrow-back"
					style={style || [styles.arrowHeaderIconBlack, { color: "#fff" }]}
				/>
			</AnimatedTouchable>
		</Animated.View>
  );
};
