## React Native ToolbarComponent

Pull request are welcomed. Please follow the Airbnb style guide [Airbnb JavaScript](https://github.com/airbnb/javascript)

[Try it with Exponent](https://exp.host/@jacklam718/toolbar-demo)

##### Preview
<img src="https://jacklam718.github.io/react-native-toolbar-component/assets/toolbar-screenshot.png" width="250">


## Installation
###### yarn
`yarn add react-native-toolbar-component`
###### npm
`npm install --save react-native-toolbar-component`


## Basic Usage
```javascript
import { Text } from 'react-native';
import ToolbarComponent from 'react-native-toolbar-component';
```

```javascript
<ToolbarComponent
  leftItem={{
    title: 'Left',
    layout: 'title',
    onPress: () => {
      console.log('pressed');
    },
  }}
  righttem={{
    title: 'Right',
    layout: 'title',
    onPress: () => {
      console.log('pressed');
    },
  }}
>
  <Text>
    Title
  </Text>
</ToolbarComponent>
```
