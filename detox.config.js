module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest-runner-config.js',
  skipLegacyWorkersInjection: true,
  behavior: {
    init: {
      exposeGlobals: true,
      reinstallApp: true,
    },
  },
  apps: {
    'ios.sim.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/walletmobile.app',
      build:
        'xcodebuild -workspace ios/Velaswallet.xcworkspace -scheme Velaswallet -configuration Release -sdk iphonesimulator -derivedDataPath ios/build EXCLUDED_ARCHS=arm64',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew app:assembleRelease app:assembleAndroidTest -DtestBuildType=release && cd ..',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 11',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_XL_API_29',
      },
    },
  },
  configurations: {
    ios: {
      device: 'simulator',
      app: 'ios.sim.release',
    },
    android: {
      device: 'emulator',
      app: 'android.release',
    },
  },
  artifacts: {
    rootDir: './artifacts',
    plugins: {
      instruments: 'all',
      log: { enabled: false },
      uiHierarchy: 'disabled',
      screenshot: {
        shouldTakeAutomaticSnapshots: true,
        keepOnlyFailedTestsArtifacts: true,
        takeWhen: {
          testStart: false,
          testFails: true,
          testDone: false,
        },
      },
      video: {
        android: {
          bitRate: 4000000,
        },
        simulator: {
          codec: 'hevc',
        },
      },
    },
  },
};
