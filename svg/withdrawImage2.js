import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

export const WithdrawImage2 = (props) => {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0-715934)" d="M0 0H70V70H0z" />
      <Defs>
        <Pattern
          id="pattern0-715934"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0" transform="scale(.01429)" />
        </Pattern>
        <Image
          id="image0"
          width={70}
          height={70}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG0SURBVHgB7duxUcNAEIXhdxYJGSXQAQQYh0gduAS3QAW4E0qRTeShCpXgjMgILTMQYB4Eujvtad6fSeE32pNmThew2vdQZy2gfk0wJMGQBEMSDEkwJMGQBEMSDEkwJMGQBEMSDEkwJMGQBEO6QNLCDv1pj5yF6gHoa4wsLYyhvDZb5Oy+3SIsaoxMo0QSDEkwpMSLb3WDZbtBrCp0ODQ7ZCgtTOjXw0K4Rpw64L1BpkoZpQ5hQDk0HTJVAkx2FMs7DEep2yvctTUS5Rnmb5S3RYuAayTKK8z/KMAtEuYRZnIUyxuMCxTLE4wbFMsLjCsUywOMOxRrahiXKNaUMG5RrKlgXKNYU8C4R7FywxSBYuWEKQbFygVTFIqVA6Y4FCs1TJEoVkqYYlGsVDBFo1gpYIpHsWJvn+RFWQwb+Mv2x81hLwvjD9SEiMdyZvGkfBVrlGaFYsWAmR2KNRbmOEcUayzMFfrq6exu4ShWhFHqN1i9PH9fzgDFivS6/sQBLk+Pc0CxQuRTtEfYeM2g2F++s0Cx9KsZSTAkwZAEQxIMSTAkwZAEQxIMSTAkwZAEQxIMSTCkDwcw43NvWvOGAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  )
}

