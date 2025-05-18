// App.js
import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  // Request permission for push notifications
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('Permission Status:', authStatus);

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

  // Get FCM token
  const getTokenFromDevice = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.log('Error fetching FCM token:', error);
    }
  };

  useEffect(() => {
    const setupFirebaseMessaging = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        await getTokenFromDevice();
      } else {
        console.log('Notification permission not granted');
      }
    };

    setupFirebaseMessaging();
  }, []);

  return (
    <StripeProvider
      publishableKey="pk_test_51RNPAV4SrJuut3amYvK6lf6MFTdZv6I42fahASPBkdvnryJWeB5lkDDlC1dVRWZQEEx98uiRckuGUTTbyBpC60kb00oXzHOp6a"
      urlScheme="fitflow" // Required for Android deep linking
      merchantIdentifier="merchant.com.fitflow" // For Apple Pay (use real ID in production)
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
