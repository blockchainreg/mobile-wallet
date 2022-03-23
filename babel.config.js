module.exports = function (api) {
  const babelEnv = api.env();
  api.cache(true);

  const plugins = [];
  if (babelEnv !== 'development') {
    // Temporaty disabled for capturing logs for sentry crash reports
    // plugins.push(['transform-remove-console']);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
