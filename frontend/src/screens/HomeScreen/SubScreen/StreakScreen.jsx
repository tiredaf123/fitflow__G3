//Adharsh Sapkota
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../../config/config';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';
import Feather from 'react-native-vector-icons/Feather';


const StreakScreen = () => {
  const [streak, setStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [calendarDays, setCalendarDays] = useState([]);

  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const generateCalendar = (streakCount) => {
    const days = [];
    const today = new Date();
    
    // Generate 30 days (4 weeks + 2 days)
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const isStreakDay = i >= (29 - streakCount + 1) && streakCount > 0;
      
      days.push({
        date: date,
        day: date.getDate(),
        month: date.getMonth(),
        isStreakDay: isStreakDay,
        isToday: i === 29
      });
    }
    
    return days;
  };

  const fetchStreak = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login again.');

      const response = await fetch(`${BASE_URL}/users/streak`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error ${response.status}: ${errText}`);
      }

      const data = await response.json();

      setStreak(data.loginStreak || 0);
      const calendarData = generateCalendar(data.loginStreak || 0);
      setCalendarDays(calendarData);

      const parsedDate = data.lastLoginDate
        ? new Date(data.lastLoginDate).toLocaleDateString()
        : 'N/A';
      setLastLogin(parsedDate);
    } catch (err) {
      console.error('Streak fetch error:', err.message);
      Toast.show({
        type: 'error',
        text1: 'Streak Fetch Error',
        text2: err.message || 'Failed to load login streak',
      });
      setStreak(0);
      setLastLogin('N/A');
      setCalendarDays(generateCalendar(0));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  const renderDay = ({ item }) => {
    return (
      <View style={styles.dayContainer}>
        <View style={[
          styles.dayCircle,
          item.isStreakDay && styles.activeDayCircle,
          item.isToday && styles.todayCircle
        ]}>
          {item.isStreakDay ? (
            <Feather name="check" size={16} color={isDarkMode ? '#121212' : '#ffffff'} />
          ) : null}
        </View>
        <Text style={[
          styles.dayText,
          item.isToday && styles.todayText
        ]}>
          {item.day}
        </Text>
        {(item.day === 1 || item.date.getDate() === 1) && (
          <Text style={styles.monthText}>
            {item.date.toLocaleString('default', { month: 'short' })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.heading}>🔥 Current Streak</Text>
          <View style={styles.streakContainer}>
            <Text style={styles.streakCount}>{streak}</Text>
            <Text style={styles.streakLabel}>days</Text>
          </View>
          <Text style={styles.lastLogin}>Last login: {lastLogin}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="orange" style={styles.loader} />
        ) : (
          <>
            <View style={styles.calendarContainer}>
              <FlatList
                data={calendarDays}
                renderItem={renderDay}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.calendarScroll}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Keep your streak going!</Text>
              <View style={styles.tipItem}>
                <Feather name="check-circle" size={18} color="#4CAF50" />
                <Text style={styles.tipText}>Log in every day to maintain your streak</Text>
              </View>
              <View style={styles.tipItem}>
                <Feather name="award" size={18} color="#FFC107" />
                <Text style={styles.tipText}>Earn bonus points for longer streaks</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomTabBar />
      <Toast />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    header: {
      alignItems: 'center',
      padding: 20,
      paddingTop: 30,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 10,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 5,
    },
    streakCount: {
      fontSize: 48,
      fontWeight: 'bold',
      color: 'orange',
      marginRight: 5,
    },
    streakLabel: {
      fontSize: 18,
      color: isDarkMode ? '#cccccc' : '#666666',
    },
    lastLogin: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#666666',
    },
    loader: {
      marginTop: 50,
    },
    calendarContainer: {
      marginVertical: 20,
    },
    calendarScroll: {
      paddingHorizontal: 15,
    },
    dayContainer: {
      alignItems: 'center',
      marginHorizontal: 6,
      width: 40,
    },
    dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDarkMode ? '#333333' : '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    activeDayCircle: {
      backgroundColor: '#FFA500',
    },
    todayCircle: {
      borderWidth: 2,
      borderColor: '#FFA500',
    },
    dayText: {
      fontSize: 12,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    todayText: {
      fontWeight: 'bold',
      color: '#FFA500',
    },
    monthText: {
      fontSize: 10,
      color: isDarkMode ? '#aaaaaa' : '#666666',
      marginTop: 2,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
      paddingHorizontal: 20,
    },
    statCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      width: '45%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 6,
      elevation: 3,
    },
    statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#666666',
      textAlign: 'center',
    },
    tipsContainer: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 20,
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 6,
      elevation: 3,
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 15,
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    tipText: {
      fontSize: 14,
      color: isDarkMode ? '#cccccc' : '#333333',
      marginLeft: 10,
      flex: 1,
    },
  });

export default StreakScreen;