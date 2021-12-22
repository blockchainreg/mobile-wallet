import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const NetworkIcon = (props) => {
  return (
    <Svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.367 9.065c-.557.36-.925.984-.925 1.696 0 .343.094.665.246.947a12.002 12.002 0 01-6.557 3.756 2.005 2.005 0 00-1.522-.76 11.79 11.79 0 01-.757-4.03 11.946 11.946 0 012.63-7.595c.191.06.391.102.603.102a2 2 0 001.328-.508 12.072 12.072 0 014.954 6.392zM10.106 1.16c0 .165-.026.324-.063.479a13.293 13.293 0 015.492 7.107c.034.002.066.008.102.011a11.939 11.939 0 001.14-5.187c-.002-.114-.01-.227-.014-.34A9.479 9.479 0 0011.156 0c-.384.21-.751.443-1.11.69.035.152.06.307.06.47zM4.443 15.04a13.06 13.06 0 01-.803-4.354 13.157 13.157 0 012.844-8.305 2.003 2.003 0 01-.417-1.194c-.333-.09-.67-.17-1.013-.234a9.493 9.493 0 00-2.851 14.47c.535.117 1.082.2 1.639.243.153-.247.354-.465.6-.626zM17.92 4.957a13.197 13.197 0 01-1.155 4.27c.437.37.72.918.72 1.534 0 .868-.55 1.603-1.32 1.887 0 .044.007.088.007.133 0 1.339-.204 2.629-.576 3.847a9.477 9.477 0 002.324-11.67zm-3.371 7.597a13.222 13.222 0 01-6.98 4.055c0 .038.01.075.01.114 0 .382-.111.735-.295 1.039.254.338.524.66.81.969.46.067.926.114 1.406.114 1.57 0 3.048-.388 4.354-1.062a11.951 11.951 0 001.103-5c0-.026-.004-.049-.004-.073a2.225 2.225 0 01-.404-.156z"
        fill="#fff"
      />
    </Svg>
  );
};
