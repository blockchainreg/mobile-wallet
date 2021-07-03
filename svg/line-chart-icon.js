import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export const ChartIcon = (props) => {
  return (
    <Svg width={17} height={16} viewBox="0 0 17 16" fill="none" {...props}>
      <G clipPath="url(#clip0-586828)">
        <Path
          d="M15.67 14H2.004V.335a.333.333 0 00-.667 0v13.667h-1a.333.333 0 100 .667h1v1a.333.333 0 10.667 0v-1H15.67a.333.333 0 000-.667z"
          fill="#878787"
        />
        <Path
          d="M3.003 13.334a.333.333 0 01-.26-.542L5.41 9.46a.333.333 0 01.495-.028l1.032 1.032 1.78-2.967a.333.333 0 01.266-.162.349.349 0 01.283.125l.892 1.115 1.186-5.64a.333.333 0 01.562-.167l1.728 1.728 1.77-2.361a.333.333 0 01.533.399l-2 2.667a.333.333 0 01-.502.036L11.87 3.671l-1.207 5.733a.333.333 0 01-.586.14L9.043 8.252l-1.754 2.921a.333.333 0 01-.52.067L5.7 10.174l-2.437 3.035a.334.334 0 01-.26.125z"
          fill="#0BFFB7"
        />
      </G>
      <Defs>
        <ClipPath id="clip0-586828">
          <Path fill="#fff" transform="translate(.004)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}


