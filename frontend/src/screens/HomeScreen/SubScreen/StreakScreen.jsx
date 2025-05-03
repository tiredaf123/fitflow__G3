import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = 'login_streak';
const LAST_LOGIN_KEY = 'last_login_date';

const StreakScreen = () => {
  const [streak, setStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    const fetchStreak = async () => {
      const storedStreak = await AsyncStorage.getItem(STREAK_KEY);
      const storedDate = await AsyncStorage.getItem(LAST_LOGIN_KEY);
      setStreak(storedStreak ? parseInt(storedStreak) : 0);
      setLastLogin(storedDate || 'N/A');
    };

    fetchStreak();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Your Login Streak</Text>
      <Text style={styles.streakCount}>{streak} days</Text>
      <Text style={styles.dateText}>Last login: {lastLogin}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 20 },
  streakCount: { fontSize: 40, color: 'orange', fontWeight: 'bold' },
  dateText: { fontSize: 16, color: '#555', marginTop: 10 },
});

export default StreakScreen;
