// screens/HomeScreen/AchievementsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAchievements } from '../../services/achievementService';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';

const AchievementsScreen = () => {
  const { isDarkMode } = useTheme();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F0F0F0',
    },
    header: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    achievementCard: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: isDarkMode ? '#FF6B00' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
    },
    achievementTitle: {
      color: '#FF6B00',
      fontSize: 20,
      fontWeight: 'bold',
    },
    achievementDescription: {
      color: isDarkMode ? '#FFF' : '#444',
      fontSize: 15,
      marginTop: 5,
    },
  });

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn('Token not found');
          return;
        }
        const data = await fetchAchievements(token);
        setAchievements(data);
      } catch (err) {
        console.error('Error loading achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Achievements</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B00" />
        ) : (
          achievements.map((ach, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementTitle}>{ach.title}</Text>
              <Text style={styles.achievementDescription}>{ach.description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <BottomTabBar />
    </View>
  );
};

export default AchievementsScreen;
