import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

export const SwapImage = (props) => {
  return (
    <Svg
      width={43}
      height={45}
      viewBox="0 0 43 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0-325758)" d="M0 0H43V45H0z" />
      <Defs>
        <Pattern
          id="pattern0-325758"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0" transform="scale(.02326 .02222)" />
        </Pattern>
        <Image
          id="image0"
          width={43}
          height={45}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAtCAYAAAA3BJLdAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIHSURBVHgB1ZiBdYIwEIZ/fB3AEdigdgO6QTeom+gIbmA36Ai4gXYCsoFucL0roY8Xk5BAkPi9d6IE7n2GkBwAgRDRjlq+kTM90Y4NcsQiKpTIDYfoFbnhEBVqLMSLbaeI8mbvOEclGAa3oihumIqnR1PTcBw5KozhgaImR471M4h2NBQyvPigLeVBQx7hld5WyIOSo3YJF/KhG2t9cA4ojneeMVR/Z9F9eQbhot+au3BhtgYI/3CcEc9aR4U4FCxD4h8R1nemjSMmoHN/URx1SNLGcuKYXrXl31Mc1VBCl3D4apNO+BCS0CacrPiOED4gBItwiYQECm9jEpY6aYUZGBBukBsO4bq7kuYK9oF2LlQcJ+fcNq9wyRu5J2R7YYeTecDO1vVzXfLR0HB5+InEcM41x0FHVNF9pmGSCmvJjnOwMIWTTNiQDRfmg64UThJhsg+9YWGKLyomC3OOjSO3X5jayT6md4UdTVzFPLmdwt1jjcxrUobFFigXjrEvKyr4876bL0L6i8JY4bm4EzYfa7IWtj3WZCfMsm/yZWW2cMPfv8H4sZiaje7Ae1khM2Glwy4rZCKsYJkVnJD/SXdOGjLm8gKB8IlS60q8oq0350TB967g0ZB71bzr0UUhd23gFV1hGUrLPoWBS7+UbGX8VggYo0vJ9ldHhZxuJhNqp0MpBeuYm+kX+xf4ENP5lqoAAAAASUVORK5CYII="
        />
      </Defs>
    </Svg>
  )
}

