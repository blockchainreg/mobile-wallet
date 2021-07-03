import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const Avatar = (props) => {
  return (
    <Svg width={33} height={34} viewBox="0 0 33 34" fill="none" {...props}>
      <Path 
      fill="#2C3057" 
      d="M0 0H33V34H0z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.265 29H9.735v-4.47h13.53V29zm-4-7h-5.53v-4.47h5.53V22zM5 24.265h4.735v-9.47H5v9.47zm23 0h-4.735v-9.47H28v9.47zm0-13.53V6h-9.47v4.059h-4.06V6H5v4.735h4.735v4.06h13.53v-4.06H28z"
        // fill="#007AFF"
        fill={props.color || "#007AFF"}
      />
    </Svg>
  )
}
