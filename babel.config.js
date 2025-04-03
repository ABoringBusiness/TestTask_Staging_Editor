module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null, // Optionally specify variables to blacklist
        whitelist: null, // Optionally specify variables to whitelist
        safe: false, // Set to true if you want to check that all variables are defined
        allowUndefined: true, // Set to false if you want to prevent usage of undefined variables
      },
    ],
  ],
};
