import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { selectedGoal } = route.params || {};

  const [flippedCardId, setFlippedCardId] = useState(null);
  const flipAnimations = useRef({}).current;
  const [selectedDate, setSelectedDate] = useState(moment());
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    moment().clone().add(i, 'days')
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserName(data?.fullName || data?.username || '');
          setUserPhoto(data?.photoURL || null);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#FAFAFA',
    },
    greetingText: {
      fontSize: 20,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    subText: {
      fontSize: 12,
      color: isDarkMode ? '#AAAAAA' : '#555555',
    },
    cardBackground: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    cardBackBackground: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF7E6',
    },
    cardTextColor: {
      color: isDarkMode ? '#FFFFFF' : '#333333',
    },
  });

  const getFlipAnimation = (id) => {
    if (!flipAnimations[id]) {
      flipAnimations[id] = new Animated.Value(0);
    }
    return flipAnimations[id];
  };

  const handleFlip = (id) => {
    if (flippedCardId && flippedCardId !== id) {
      Animated.timing(getFlipAnimation(flippedCardId), {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {
        setFlippedCardId(id);
        Animated.timing(getFlipAnimation(id), {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();
      });
    } else if (flippedCardId === id) {
      Animated.timing(getFlipAnimation(id), {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => setFlippedCardId(null));
    } else {
      setFlippedCardId(id);
      Animated.timing(getFlipAnimation(id), {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    }
  };

  const filteredWorkouts = selectedGoal
    ? workoutLibrary.filter((item) => item.goal === selectedGoal)
    : workoutLibrary;

  return (
    <View style={themeStyles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.navbar}>
          <Text style={styles.title}>FitFlow</Text>
          <TouchableOpacity>
            <Icon name="notifications" size={24} color={isDarkMode ? '#FFF' : '#333'} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileWrapper}>
          <Image
            source={userPhoto ? { uri: userPhoto } : require('../../assets/Images/profile.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={themeStyles.greetingText}>
              {userName ? `Welcome, ${userName}!` : 'Welcome!'}
            </Text>
            {selectedGoal && (
              <View style={styles.goalTag}>
                <Text style={styles.goalTagText}>Goal: {selectedGoal}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendar */}
        <View style={styles.calendarSection}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FEC400' : '#FF9500' }]}>
            Today's Plan
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContainer}
          >
            {daysOfWeek.map((day, index) => {
              const isSelected = selectedDate.isSame(day, 'day');
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayItem,
                    isSelected && styles.selectedDay,
                    isDarkMode && !isSelected && styles.darkDayItem
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isDarkMode && !isSelected && { color: '#AAA' }
                  ]}>
                    {day.format('ddd')}
                  </Text>
                  <Text style={[
                    styles.dateText,
                    isSelected && styles.selectedDateText,
                    isDarkMode && !isSelected && { color: '#FFF' }
                  ]}>
                    {day.format('D')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Diet Plans */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FEC400' : '#FF9500' }]}>
            Nutrition Plans
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {dietFoods.map((item) => (
              <View style={{ marginRight: 15 }} key={item.id}>
                {renderFlippableCard(item)}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Workout Plans */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FEC400' : '#FF9500' }]}>
            Workout Programs
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {filteredWorkouts.map((item) => (
              <View style={{ marginRight: 15 }} key={item.id}>
                {renderFlippableCard(item)}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <BottomTabBar />
    </View>
  );

  function renderFlippableCard(item) {
    const anim = getFlipAnimation(item.id);
    const frontInterpolate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
      transform: [{ rotateY: frontInterpolate }],
    };
    const backAnimatedStyle = {
      transform: [{ rotateY: backInterpolate }],
    };

    return (
      <TouchableOpacity onPress={() => handleFlip(item.id)} activeOpacity={0.9}>
        <View style={styles.cardContainer}>
          {/* Front Card */}
          <Animated.View style={[
            styles.card,
            themeStyles.cardBackground,
            frontAnimatedStyle,
            { position: 'absolute' }
          ]}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={[styles.cardTitle, themeStyles.cardTextColor]}>{item.name}</Text>
            <View style={[
              styles.cardBadge,
              { backgroundColor: isDarkMode ? '#333' : '#FFF7E6' }
            ]}>
              <Text style={[
                styles.cardBadgeText,
                { color: isDarkMode ? '#FEC400' : '#FF9500' }
              ]}>
                {item.caloriesBurned ? '🔥 ' + item.caloriesBurned : '🍏 ' + item.calories + ' kcal'}
              </Text>
            </View>
          </Animated.View>

          {/* Back Card */}
          <Animated.View style={[
            styles.card,
            styles.cardBack,
            themeStyles.cardBackBackground,
            backAnimatedStyle,
          ]}>
            <Text style={[styles.cardTitle, themeStyles.cardTextColor]}>{item.name}</Text>
            {item.calories && (
              <View style={styles.detailRow}>
                <Icon name="local-fire-department" size={16} color="#FEC400" />
                <Text style={[styles.detailText, { color: isDarkMode ? '#FFF' : '#333' }]}>
                  {item.calories} kcal
                </Text>
              </View>
            )}
            {item.protein && (
              <View style={styles.detailRow}>
                <Icon name="whatshot" size={16} color="#FEC400" />
                <Text style={[styles.detailText, { color: isDarkMode ? '#FFF' : '#333' }]}>
                  {item.protein} protein
                </Text>
              </View>
            )}
            {item.caloriesBurned && (
              <View style={styles.detailRow}>
                <Icon name="bolt" size={16} color="#FEC400" />
                <Text style={[styles.detailText, { color: isDarkMode ? '#FFF' : '#333' }]}>
                  Burns {item.caloriesBurned}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FEC400',
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FEC400',
  },
  goalTag: {
    backgroundColor: 'rgba(254, 196, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  goalTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FEC400',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  calendarSection: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
  },
  sectionContainer: {
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  scrollRow: {
    paddingBottom: 10,
  },
  calendarContainer: {
    paddingTop: 5,
  },
  dayItem: {
    width: 55,
    height: 65,
    marginRight: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7E6',
  },
  darkDayItem: {
    backgroundColor: '#2A2A2A',
  },
  selectedDay: {
    backgroundColor: '#FEC400',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 3,
  },
  selectedDayText: {
    color: '#000',
  },
  selectedDateText: {
    color: '#000',
  },
  cardContainer: {
    width: 160,
    height: 200,
    marginRight: 15,
    perspective: 1000,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  detailText: {
    fontSize: 13,
    marginLeft: 5,
    fontWeight: '500',
  },
});

const workoutLibrary = [
  { id: 'workout-1', name: 'Morning Yoga', goal: 'Improve Flexibility', image: require('../../assets/Images/yoga.png'), caloriesBurned: '100 kcal' },
  { id: 'workout-2', name: 'HIIT Training', goal: 'Lose Weight', image: require('../../assets/Images/hiit.png'), caloriesBurned: '300 kcal' },
  { id: 'workout-3', name: 'Strength Training', goal: 'Build Muscles', image: require('../../assets/Images/strength.png'), caloriesBurned: '250 kcal' },
  { id: 'workout-4', name: 'Cardio Blast', goal: 'Lose Weight', image: require('../../assets/Images/cardio.png'), caloriesBurned: '280 kcal' },
  { id: 'workout-5', name: 'Pilates', goal: 'Tone & Define', image: require('../../assets/Images/pilates.png'), caloriesBurned: '180 kcal' },
  { id: 'workout-6', name: 'Stretching', goal: 'Improve Flexibility', image: require('../../assets/Images/stretching.png'), caloriesBurned: '70 kcal' },
];

const dietFoods = [
  { id: 'diet-1', name: 'Salad Bowl', image: require('../../assets/Images/salad.png'), calories: 150, protein: '3g' },
  { id: 'diet-2', name: 'Grilled Chicken', image: require('../../assets/Images/chicken.png'), calories: 220, protein: '30g' },
  { id: 'diet-3', name: 'Fruit Mix', image: require('../../assets/Images/fruits.png'), calories: 120, protein: '2g' },
  { id: 'diet-4', name: 'Oatmeal', image: require('../../assets/Images/oatmeal.png'), calories: 180, protein: '5g' },
  { id: 'diet-5', name: 'Smoothie', image: require('../../assets/Images/smoothie.png'), calories: 200, protein: '8g' },
];

export default HomeScreen;