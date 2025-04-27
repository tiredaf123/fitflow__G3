// App.js
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/navigation/ThemeProvider';
import Toast from 'react-native-toast-message';

import { firebase } from '@react-native-firebase/messaging'; // Modular
import { getMessaging, getToken, requestPermission } from '@react-native-firebase/messaging'; // Modular methods
import { getApp } from '@react-native-firebase/app'; //  Needed for modular setup

const App = () => {

  const requestUserPermission = async () => {
    const app = getApp(); //  Correct app instance
    const messaging = getMessaging(app); //  Correct messaging instance

    const authStatus = await requestPermission(messaging);
    console.log('Permission Status:', authStatus);

    const enabled = authStatus === 1 || authStatus === 2; // 1 = Authorized, 2 = Provisional
    return enabled;
  };

  const getTokenFromDevice = async () => {
    try {
      const app = getApp();
      const messaging = getMessaging(app);

      const token = await getToken(messaging);
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
