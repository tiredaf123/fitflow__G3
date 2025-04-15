module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'comma-dangle': 'off', // disables warning for trailing commas
    'react-native/no-inline-styles': 'off',
    'quotes': ['error', 'single', { avoidEscape: true }],
  },
};
