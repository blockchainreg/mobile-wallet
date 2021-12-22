import * as React from 'react';
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg';

export const ScanImage = (props) => {
  return (
    <Svg
      width={68}
      height={68}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0-909219)" d="M0 0H68V68H0z" />
      <Defs>
        <Pattern
          id="pattern0-909219"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0" transform="scale(.0147)" />
        </Pattern>
        <Image
          id="image0"
          width={68}
          height={68}
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
};
