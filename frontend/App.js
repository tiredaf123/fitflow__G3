import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';

const App = () => {
    return (
        <ThemeProvider>
            <AppNavigator />
        </ThemeProvider>
    );
};

export default App;
