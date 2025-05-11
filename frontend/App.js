import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <StripeProvider
      publishableKey="pk_test_51RNPAV4SrJuut3amYvK6lf6MFTdZv6I42fahASPBkdvnryJWeB5lkDDlC1dVRWZQEEx98uiRckuGUTTbyBpC60kb00oXzHOp6a"
      urlScheme="fitflow" // Required for Android redirects
      merchantIdentifier="" // Can be empty string for Android-only
    >
      <ThemeProvider>
        <>
          <AppNavigator />
          <Toast />
        </>
      </ThemeProvider>
    </StripeProvider>
  );
};

export default App;