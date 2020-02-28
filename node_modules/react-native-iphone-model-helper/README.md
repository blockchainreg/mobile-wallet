# react-native-iphone-model-helper

Helps you to identify the device model and the screen ratio.
It uses 'react-native-device-info' as peer dependency.

## Installation

Using npm:

```shell
npm install --save react-native-iphone-model-helper
# If you did not install the 'react-native-device-info', run the commands below.
npm install --save react-native-device-info
react-native link react-native-device-info
```

or using yarn:

```shell
yarn add react-native-iphone-model-helper
# If you did not install the 'react-native-device-info', run the commands below.
yarn add react-native-device-info
react-native link react-native-device-info
```

### Elements

- getDeviceModel: Returns a string of the device model name. (Function)

```js
import { getDeviceModel } from "react-native-iphone-model-helper";

console.log(getDeviceModel());
// >> 'iPhone XS Max'
```

- isIphone{model}: Returns a boolean. (Function)
  - Supporting models: "XS, XS Max, XR, X, 8, 8 Plus, 7, 7 Plus, SE, 6, 6 Plus, 5s, 5c
  - Function names:
    isIphoneX,
    isIphoneXs,
    isIphoneXsMax,
    isIphoneXr,
    isIphone8,
    isIphone8Plus,
    isIphone7,
    isIphone7Plus,
    isIphoneSe,
    isIphone6,
    isIphone6Plus,
    isIphone5s,
    isIphone5c

```js
import { isIphoneXsMax } from "react-native-iphone-model-helper";

console.log(isIphoneXsMax());
// if the model is 'iphone xs max':
// >> true
// else:
// >> false
```

- screenHeight: Returns a number of the the screen height of the device. (Static)
- screenWidth: Returns a number of the the screen width of the device. (Static)
- screenRatio: Returns a number of the the screen height of the device. (Static)

```js
import {
  screenHeight,
  screenWidth,
  screenRatio
} from "react-native-responsive-percent";

console.log(screenHeight);
console.log(screenWidth);
console.log(screenRatio);

// >> 896
// >> 414
// >> 2.16
```

#### Example

```js
import modelHelper from "react-native-iphone-model-helper";

console.log(modelHelper.getDeviceModel());
// >> 'iPhone XR'
```
