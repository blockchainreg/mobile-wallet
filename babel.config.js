module.exports = function (api) {
  const babelEnv = api.env();
  api.cache(true);

  const plugins = [];
  // For 'module:metro-react-native-babel-preset'
  plugins.push(
    [
      'inline-import',
      {
        extensions: ['.md', '.txt'],
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {},
      },
    ]
  );
  if (babelEnv !== 'development') {
    // Temporaty disabled for capturing logs for sentry crash reports
    // plugins.push(['transform-remove-console']);
  }
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins,
  };
};
