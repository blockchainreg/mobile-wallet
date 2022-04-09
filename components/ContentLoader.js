import React from 'react';
import ContentLoader, {
  Rect,
  Circle,
  Path,
  Code,
  List,
} from 'react-content-loader/native';
import styles from '../Styles.js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const defaultViewBox = '0 -5 360 130';
const heightViewBox = hp('10%');

const MyLoader = (props) => (
  <ContentLoader
    {...props}
    speed={1}
    style={props.style || styles.contentLoader}
    backgroundColor="#262681"
    foregroundColor="#16135C"
    preserveAspectRatio="none"
    viewBox={props.viewBox || defaultViewBox}
    width={200}
    height={props.height || heightViewBox}
  >
    <Rect x="0" y="0" width="90%" height="90" rx="20" ry="20" />
  </ContentLoader>
);

export default MyLoader;
