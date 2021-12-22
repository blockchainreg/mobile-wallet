import * as React from 'react';
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg';

export const DepositImage = (props) => {
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
      <Path fill="url(#pattern0-091055)" d="M0 0H70V70H0z" />
      <Defs>
        <Pattern
          id="pattern0-091055"
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
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHGSURBVHgB7dtBSsNAFMbxN1JBdOMR4kmsy+JCPYEeRW+iN9CFdGm9gd7AI3RhERc6zlsUxeZDsJM375Xvv0kZCiE/MhPIkLSXp1nYSlvCeiMMiDAgwoAIAyIMiDAgwoAIAyIMiDAgwoAIAyIMaINg0lwqtiEw+Wlb3g7Kjxup1AbAKMr70TydzRdpciGVcILDfKMsR2rhBIZZRVn2IXK57poTFAaj7ORpVy7qofxnX9YoIMzfKEmkkzULBmODoo2kQlnSbZJ892t0XOb5uVTLDkWrAlOWu+dFOr7+OVL2q/RQCcYWRQswlexRNOcwbVA0xzDtUDSnMG1RNIcw7VE0ZzA+UDRHMH5QNCcwvlA0BzD+ULTGMD5RtIYwflG0RjC+UbQGMP5RNGOYGCiaIUwcFM0IJhaKZgATD0UbGCYmilbp1eZq5YJfRkFRtMFgXtNk1jceAUUzfVxHQdHMYCKhaINNpZ4TdVnkSipV9rJOyl7WqQyUGQxac/7bbr7vyg0/GEywLVq7CAMiDChV+iZyluXzUQxLsnVYDmMZqMSPRfvjVAIRBkQYEGFAhAERBkQYEGFAhAERBkQYEGFAhAERBkQYEGFAX7JOBY7J38prAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  );
};
