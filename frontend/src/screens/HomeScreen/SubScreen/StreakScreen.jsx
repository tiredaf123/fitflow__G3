import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../../config/config';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

/**
 * StreakScreen Component
 * -----------------------
 * Displays user's login streak and last login date,
 * fetches data from the backend, and adapts to dark/light mode.
 */
const StreakScreen = () => {
  // State variables to hold streak and last login
  const [streak, setStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState('');

  // Access dark mode preference from theme provider
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode); // Get dynamic styles

  /**
   * Fetch login streak data securely from backend
   */
  const fetchStreak = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve JWT token

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${BASE_URL}/users/streak`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error ${response.status}: ${errText}`);
      }

      const data = await response.json(); // Parse response JSON
      setStreak(data.loginStreak || 0);
      setLastLogin(data.lastLoginDate || 'N/A');
    } catch (err) {
      console.error('Streak fetch error:', err.message);
      setStreak(0);
      setLastLogin('N/A');
      Toast.show({
        type: 'error',
        text1: 'Streak Fetch Error',
        text2: err.message,
      });
    }
  };

  // Fetch streak info once on component mount
  useEffect(() => {
    fetchStreak();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Heading for the screen */}
        <Text style={styles.heading}>
          <Text>🔥</Text> <Text>Your Login Streak</Text>
        </Text>

        {/* Display number of days */}
        <Text style={styles.streakCount}>
          {streak} {streak === 1 ? 'day' : 'days'}
        </Text>

        {/* Show last login date */}
        <Text style={styles.dateText}>
          Last login: {lastLogin}
        </Text>
      </ScrollView>

      {/* Bottom tab bar for navigation */}
      <BottomTabBar />

      {/* Toast for showing messages */}
      <Toast />
    </View>
  );
};

/**
 * Generate themed styles for light/dark mode
 * @param {boolean} isDarkMode
 * @returns {object} styles
 */
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 20,
      textAlign: 'center',
    },
    streakCount: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'orange',
    },
    dateText: {
      fontSize: 16,
      marginTop: 10,
      color: isDarkMode ? '#cccccc' : '#333333',
    },
  });

export default StreakScreen;
