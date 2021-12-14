import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const WalletIcon = (props) => {
  return (
    <Svg width={27} height={24} viewBox="0 0 27 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.215 2.721h-.013c-.09.017-.178.038-.266.06C.688 3.346.03 5.383.03 6.617v1.422c-.02.155-.03.31-.03.468V19.85a3.785 3.785 0 003.781 3.781h18.905a3.785 3.785 0 003.78-3.781V8.506a3.785 3.785 0 00-3.78-3.78H7.59c-1 0-1.11-1.213-.26-1.419h15.355c.22 0 .441.014.66.042A3.897 3.897 0 0018.767.067L3.837 2.616c-.206.031-.414.066-.622.105zM18.829 15.75a1.89 1.89 0 102.1-3.142 1.89 1.89 0 00-2.1 3.142z"
        fill={props.fill || '#fff'}
      />
    </Svg>
  );
};
