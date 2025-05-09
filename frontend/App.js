// App.js
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';
import Toast from 'react-native-toast-message';

import messaging from '@react-native-firebase/messaging';

const App = () => {

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('Permission Status:', authStatus);

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

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
    <ThemeProvider>
      <>
        <AppNavigator />
        <Toast />
      </>
    </ThemeProvider>
  );
};

export default App;
