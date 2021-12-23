import * as React from 'react';
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg';

export const VelasLogo1 = (props) => {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox={props.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0-667059)" d="M0 0H144V125H0z" />
      <Defs>
        <Pattern
          id="pattern0-667059"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0" transform="scale(.00694 .008)" />
        </Pattern>
        <Image
          id="image0"
          width={props.width}
          height={props.height}
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
};
