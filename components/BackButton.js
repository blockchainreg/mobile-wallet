import React, { useEffect } from 'react';
import {
  BackHandler,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon } from 'native-base';

import styles from '../Styles.js';

const HIT_SLOP = {
  bottom: 20,
  left: 20,
  right: 20,
  top: 20,
};

export default ({ onBack, style }) => {
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
      <AnimatedTouchable onPress={onBack} hitSlop={HIT_SLOP}>
        <Icon
          name="ios-arrow-back"
          style={style || [styles.arrowHeaderIconBlack, styleOwn.arrowIcon]}
        />
      </AnimatedTouchable>
    </Animated.View>
  );
};

const styleOwn = StyleSheet.create({
  arrowIcon: {
    color: '#fff',
  },
});
