const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { linkAssetsPlugin } = require('expo-asset/tools/link-assets-plugin');

const config = getDefaultConfig(__dirname);

// Add asset plugin for fonts
config.transformer.assetPlugins = [linkAssetsPlugin];

module.exports = config;
