# React Native and Web3.js

Version node v16.X.X

1. Clone project

```
git clone https://github.com/velas/mobile-wallet.git
```

2. Install yarn

```
npm install -g yarn
```

3. Enter the Mobile Wallet, install packages and pods

```
cd mobile-wallet/ && yarn && cd ios/ && pod install
```

4. Run Ios or Android

```
yarn ios
```

```
yarn android
```

5. Setup Sentry (ask developers for credentials)

```
yarn sentry-wizard -i reactNative -p ios android
```

# Problem solving

## Android

If have error

> Task :app:installDebug FAILED
> try use for resolve

```
rm -rf node_modules/ && yarn && cd android && ./gradlew clean && ./gradlew :app:bundleRelease
```
