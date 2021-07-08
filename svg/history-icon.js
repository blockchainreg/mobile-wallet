import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const HistoryIcon = (props) => {
  return (
    <Svg width={28} height={24} viewBox="0 0 28 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.517 10.144C4.34 4.42 9.266 0 15.217 0 21.741 0 27.05 5.31 27.05 11.835c0 6.525-5.309 11.835-11.835 11.835-3.668 0-7.07-1.661-9.332-4.555l1.333-1.04a10.091 10.091 0 008 3.904c5.593 0 10.144-4.55 10.144-10.144S20.81 1.691 15.216 1.691c-5.016 0-9.182 3.663-9.991 8.453h3.229l-4.227 4.227L0 10.144h3.517zm10.005 2.533l.002-5.914h1.69l-.002 5.564 3.984 3.982L18 17.506l-4.23-4.23a.844.844 0 01-.248-.598z"
        fill={props.fill || "#fff"}
      />
    </Svg>
  )
}