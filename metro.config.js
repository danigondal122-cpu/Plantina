const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add blockList and ensure proper formatting
module.exports = withNativeWind(
    {
        ...config,
        resolver: {
            ...config.resolver,
            blockList: /.*node_modules\/react-native-svg\/src\/.*/,
        },
    },
    { input: "./global.css" }
);
