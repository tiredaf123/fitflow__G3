import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
    <AppNavigator />
  </ThemeProvider>

  )
}
