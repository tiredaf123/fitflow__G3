// App.js
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <ThemeProvider>
      <>
        <AppNavigator />
        <Toast />
      </>
    </ThemeProvider>
  );
};

export default App;
