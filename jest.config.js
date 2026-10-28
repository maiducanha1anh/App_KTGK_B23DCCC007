module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((@react-native|@react-native-async-storage|react-native|@react-navigation)/))',
  ],
};
