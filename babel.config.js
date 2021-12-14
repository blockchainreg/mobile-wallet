module.exports = function (api) {
  const babelEnv = api.env();
  api.cache(true);

  const plugins = [];
  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console']);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
