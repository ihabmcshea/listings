// detox.config.js
// not really functional unless you modify these values to real ones
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest.config.js',
  configurations: {
    ios: {
      device: {
        type: 'ios.simulator',
      },
      app: {
        type: 'ios.app',
        binaryPath: 'path/to/your/app.app',
      },
      launchArgs: {
        detoxServer: 'ws://localhost:8099',
      },
    },
    android: {
      device: {
        avdName: 'Pixel_API_30',
      },
      app: {
        type: 'android.apk',
        path: 'path/to/your/app.apk',
      },
      launchArgs: {
        detoxServer: 'ws://localhost:8099',
      },
    },
  },
};
