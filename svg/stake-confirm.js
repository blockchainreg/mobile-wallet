import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export const StakeConfirm = (props) => {
  return (
    <Svg width={33} height={33} viewBox="0 0 33 33" fill="none" {...props}>
      <G clipPath="url(#clip0-957840)">
        <Path
          d="M32.393 24.682L20.73 3.655c-.87-1.547-2.457-2.495-4.237-2.495-1.78 0-3.365.948-4.236 2.495L.607 24.682a4.78 4.78 0 00.078 4.797 4.782 4.782 0 004.159 2.38h23.312c1.722 0 3.289-.89 4.16-2.38a4.78 4.78 0 00.077-4.797z"
          fill="#0BFFB7"
        />
        <Path
          d="M32.315 29.479a4.782 4.782 0 01-4.158 2.38H16.494V1.16c1.779 0 3.365.948 4.236 2.495l11.663 21.027a4.78 4.78 0 01-.078 4.797z"
          fill="#1BAB81"
        />
        <Path d="M16.494 23.154h1.934v3.869h-1.934v-3.869z" fill="#3E254C" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.428 9.613h-3.869v9.672h3.869V9.613zm0 13.541h-3.869v3.869h3.869v-3.869z"
          fill="#fff"
        />
        <Path d="M16.494 9.613h1.934v9.672h-1.934V9.613z" fill="#fff" />
      </G>
      <Defs>
        <ClipPath id="clip0-957840">
          <Path fill="#fff" d="M0 0H33V33H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
