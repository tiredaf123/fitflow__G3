import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAchievements } from '../../services/achievementService';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';


const AchievementsScreen = () => {
  const { isDarkMode } = useTheme();
  const [achievements, setAchievements] = useState({
    unlocked: [],
    new: [],
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const streakAnimation = useRef(new Animated.Value(0)).current;

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const data = await fetchAchievements(token);
        setAchievements(data);
        if (data.streak > 0) animateStreak();
      } catch (err) {
        console.error('Error loading achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const animateStreak = () => {
    streakAnimation.setValue(0);
    Animated.timing(streakAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  };

  const streakScale = streakAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const renderAchievement = ({ item }) => (
    <View
      style={[
        styles.achievementCard,
        {
          backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
        },
      ]}
    >
      <View style={styles.achievementHeader}>
        <View style={styles.iconContainer}>
          <Feather
            name={item.icon || 'award'}
            size={24}
            color={item.isNew ? '#FFD700' : '#FF6B00'}
          />
          {item.isNew && <View style={styles.newBadge} />}
        </View>
        <View style={styles.achievementTextContainer}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {item.unlockedAt
              ? new Date(item.unlockedAt).toLocaleDateString()
              : ''}
          </Text>
        </View>
      </View>
    </View>
  );

  const filteredAchievements =
    activeTab === 'new'
      ? achievements.new
      : activeTab === 'unlocked'
      ? achievements.unlocked
      : [...achievements.new, ...achievements.unlocked];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Achievements</Text>
        <Animated.View
          style={[styles.streakContainer, { transform: [{ scale: streakScale }] }]}
        >
           <Icon name="local-fire-department" size={24} color="#FF6B00" />
          <Text style={styles.streakText}>{achievements.streak} day streak</Text>
        </Animated.View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['all'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {tab === 'new' && achievements.new.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{achievements.new.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
      ) : filteredAchievements.length === 0 ? (
        <View style={styles.emptyContainer}>
          
          <Text style={styles.emptyText}>No achievements yet</Text>
          <Text style={styles.emptySubtext}>Keep going to unlock rewards!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAchievements}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderAchievement}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomTabBar />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
      paddingTop: 20,
    },
    headerContainer: {
      paddingHorizontal: 20,
      marginBottom: 15,
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 5,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF',
      padding: 12,
      borderRadius: 12,
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    streakText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFF' : '#000',
      marginLeft: 10,
    },
    tabContainer: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
    },
    tab: {
      paddingBottom: 12,
      marginRight: 25,
      flexDirection: 'row',
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#FF6B00',
    },
    tabText: {
      fontSize: 16,
      color: isDarkMode ? '#AAA' : '#666',
      fontWeight: '500',
    },
    activeTabText: {
      color: '#FF6B00',
      fontWeight: '600',
    },
    badge: {
      backgroundColor: '#FF6B00',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 5,
    },
    badgeText: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    achievementCard: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 6,
      elevation: 3,
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDarkMode ? '#333' : '#EEE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      position: 'relative',
    },
    newBadge: {
      position: 'absolute',
      top: -3,
      right: -3,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FFD700',
      borderWidth: 2,
      borderColor: isDarkMode ? '#121212' : '#F5F5F5',
    },
    achievementTextContainer: {
      flex: 1,
    },
    achievementTitle: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 3,
    },
    achievementDescription: {
      color: isDarkMode ? '#AAA' : '#666',
      fontSize: 14,
    },
    dateContainer: {
      alignItems: 'flex-end',
    },
    dateText: {
      color: isDarkMode ? '#666' : '#999',
      fontSize: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyImage: {
      width: 150,
      height: 150,
      marginBottom: 20,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 5,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: isDarkMode ? '#AAA' : '#666',
      textAlign: 'center',
    },
    loader: {
      marginTop: 50,
    },
  });

export default AchievementsScreen;
