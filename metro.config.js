const nodeLibs = require('node-libs-browser');
const blacklist = require('metro-config/src/defaults/blacklist');
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;

module.exports = {
  resolver: {
    extraNodeModules: nodeLibs,
    blacklistRE: blacklist([
      /node_modules\/.*\/node_modules\/react-native\/.*/,
    ]),
    sourceExts: [...defaultSourceExts, 'md'],
  },
};
