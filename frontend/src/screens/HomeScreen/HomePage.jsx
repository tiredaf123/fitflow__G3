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
  FlatList,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';
//Satya shrestha and Sohan koirala for the backend
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_SPACING = 16;
const CARD_MARGIN = 8;

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { selectedGoal } = route.params || {};

  const [flippedCardId, setFlippedCardId] = useState(null);
  const flipAnimations = useRef({}).current;
  const scrollRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');


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
  const fetchQuote = async () => {
    try {
      const res = await fetch(`${BASE_URL}/quotes`);
      const data = await res.json();
      if (data) {
        setQuoteText(data.text || '');
        setQuoteAuthor(data.author || '');
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
    }
  };

  fetchQuote();


  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F8F9FA',
    },
    greetingText: {
      fontSize: 24,
      fontWeight: '700',
      color: isDarkMode ? '#FFFFFF' : '#2D3436',
      marginBottom: 4,
    },
    subText: {
      fontSize: 14,
      color: isDarkMode ? '#B2BEC3' : '#636E72',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginLeft: 24,
      marginTop: 24,
      marginBottom: 16,
      color: isDarkMode ? '#FFFFFF' : '#2D3436',
    },
    card: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    cardBack: {
      backgroundColor: isDarkMode ? '#2D3436' : '#F5F5F5',
    },
    cardText: {
      color: isDarkMode ? '#FFFFFF' : '#2D3436',
    },
    dayItem: {
      backgroundColor: isDarkMode ? '#2D3436' : '#FFFFFF',
    },
    selectedDay: {
      backgroundColor: '#00B894',
    },
    dayText: {
      color: isDarkMode ? '#B2BEC3' : '#636E72',
    },
    selectedDayText: {
      color: '#FFFFFF',
    },
    dateText: {
      color: isDarkMode ? '#FFFFFF' : '#2D3436',
    },
    selectedDateText: {
      color: '#FFFFFF',
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
    <SafeAreaView style={themeStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={isDarkMode ? ['#121212', '#1E1E1E'] : ['#00B894', '#55EFC4']}
          style={styles.header}
        >
          <View style={styles.navbar}>
            <Text style={styles.title}>FitFlow</Text>
            <TouchableOpacity>
              <Icon name="notifications" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileWrapper}>
            <Image
              source={userPhoto ? { uri: userPhoto } : require('../../assets/Images/profile.png')}
              style={styles.profileImage}
            />
            <View>
              <Text style={[themeStyles.greetingText, { color: '#FFFFFF' }]}>
                {userName ? `Welcome, ${userName}!` : 'Welcome!'}
              </Text>
              {selectedGoal && (
                <Text style={[themeStyles.subText, { color: '#FFFFFF' }]}>
                  Current Goal: {selectedGoal}
                </Text>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <Text style={themeStyles.sectionTitle}>Today's Plan</Text>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContainer}
            snapToInterval={80}
            decelerationRate="fast"
          >
            {daysOfWeek.map((day, index) => {
              const isSelected = selectedDate.isSame(day, 'day');
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayItem,
                    themeStyles.dayItem,
                    isSelected && themeStyles.selectedDay
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text style={[
                    styles.dayText,
                    themeStyles.dayText,
                    isSelected && themeStyles.selectedDayText
                  ]}>
                    {day.format('ddd')}
                  </Text>
                  <Text style={[
                    styles.dateText,
                    themeStyles.dateText,
                    isSelected && themeStyles.selectedDateText
                  ]}>
                    {day.format('D')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
<View style={{
          marginHorizontal: 24,
          marginTop: 20,
          marginBottom: 10,
          backgroundColor: isDarkMode ? '#2D3436' : '#FFF',
          padding: 16,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{
            fontSize: 16,
            fontStyle: 'italic',
            color: isDarkMode ? '#B2BEC3' : '#2D3436',
            marginBottom: 6,
          }}>
            {quoteText}
          </Text>
          {quoteAuthor && (
            <Text style={{
              fontSize: 14,
              textAlign: 'right',
              color: isDarkMode ? '#B2BEC3' : '#636E72',
            }}>
              — {quoteAuthor}
            </Text>
          )}
        </View>
        {/* Diet Plans */}
        <Text style={themeStyles.sectionTitle}>Recommended Meals</Text>
        <FlatList
          data={dietFoods}
          renderItem={({ item }) => renderFlippableCard(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
        />

        {/* Workout Plans */}
        <Text style={themeStyles.sectionTitle}>Workout Plans</Text>
        <FlatList
          data={filteredWorkouts}
          renderItem={({ item }) => renderFlippableCard(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
        />
      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
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
      <TouchableOpacity
        onPress={() => handleFlip(item.id)}
        activeOpacity={0.9}
      >
        <View style={[styles.cardContainer, { marginHorizontal: CARD_MARGIN }]}>
          <Animated.View
            style={[
              styles.card,
              themeStyles.card,
              frontAnimatedStyle,
              styles.cardFront,
            ]}
          >
            <Image source={item.image} style={styles.cardImage} />
            <Text style={[styles.cardTitle, themeStyles.cardText]}>{item.name}</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>
                {item.calories ? `${item.calories} kcal` : item.caloriesBurned}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              themeStyles.card,
              themeStyles.cardBack,
              backAnimatedStyle,
              styles.cardBack,
            ]}
          >
            <Text style={[styles.cardTitle, themeStyles.cardText, styles.backTitle]}>{item.name}</Text>

            {/* Detailed Description */}
            <View style={styles.detailsContainer}>
              {item.description && (
                <Text style={[styles.descriptionText, themeStyles.cardText]}>
                  {item.description}
                </Text>
              )}

              {/* Dynamic details based on card type */}
              {item.calories && (
                <View style={styles.detailRow}>
                  <Icon name="local-fire-department" size={20} color="#00B894" />
                  <Text style={[styles.detailText, themeStyles.cardText]}>
                    Calories: {item.calories}
                  </Text>
                </View>
              )}

              {item.protein && (
                <View style={styles.detailRow}>
                  <Icon name="fitness-center" size={20} color="#00B894" />
                  <Text style={[styles.detailText, themeStyles.cardText]}>
                    Protein: {item.protein}
                  </Text>
                </View>
              )}

              {item.caloriesBurned && (
                <View style={styles.detailRow}>
                  <Icon name="whatshot" size={20} color="#00B894" />
                  <Text style={[styles.detailText, themeStyles.cardText]}>
                    Burns: {item.caloriesBurned}
                  </Text>
                </View>
              )}

              {item.duration && (
                <View style={styles.detailRow}>
                  <Icon name="timer" size={20} color="#00B894" />
                  <Text style={[styles.detailText, themeStyles.cardText]}>
                    Duration: {item.duration}
                  </Text>
                </View>
              )}

              {item.difficulty && (
                <View style={styles.detailRow}>
                  <Icon name="star" size={20} color="#00B894" />
                  <Text style={[styles.detailText, themeStyles.cardText]}>
                    Level: {item.difficulty}
                  </Text>
                </View>
              )}

              {item.prepTime && (
                <View style={styles.detailRow}>
                  <Icon name="access-time" size={20} color="#00B894" />
                  <Text style={[styles.detailText, themeStyles.cardText]}>
                    Prep: {item.prepTime}
                  </Text>
                </View>
              )}
            </View>


          </Animated.View>
        </View>
        

      </TouchableOpacity>
      
    );
  }
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'sans-serif-medium',

    marginTop: -18,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  calendarSection: {
    marginTop: 24,
  },
  calendarContainer: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 8,
  },
  dayItem: {
    width: 64,
    height: 80,
    marginRight: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  horizontalList: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 16,

  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 60
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardFront: {
    justifyContent: 'center',
  },
  cardBack: {
    padding: 20,
  },
  cardImage: {
    width: CARD_WIDTH - 32,
    height: CARD_WIDTH - 32,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  backTitle: {
    marginBottom: 10,
  },
  cardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 184, 148, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    width: '100%',
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    width: '100%',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#00B894',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

const workoutLibrary = [
  {
    id: 'workout-1',
    name: 'Morning Yoga',
    goal: 'Improve Flexibility',
    image: require('../../assets/Images/yoga.png'),
    description: 'Gentle yoga flow to awaken your body and mind, perfect for starting your day with energy and focus.',
    caloriesBurned: '100 kcal',
    duration: '20 min',
    difficulty: 'Beginner',
    benefits: 'Improves flexibility, reduces stress, enhances breathing'
  },
  {
    id: 'workout-2',
    name: 'HIIT Training',
    goal: 'Lose Weight',
    image: require('../../assets/Images/hiit.png'),
    description: 'High intensity interval training that maximizes calorie burn and boosts metabolism for hours after.',
    caloriesBurned: '300 kcal',
    duration: '30 min',
    difficulty: 'Advanced',
    benefits: 'Burns fat, improves endurance, time-efficient'
  },
  {
    id: 'workout-3',
    name: 'Strength Training',
    goal: 'Build Muscles',
    image: require('../../assets/Images/strength.png'),
    description: 'Compound exercises targeting all major muscle groups to build strength and definition.',
    caloriesBurned: '250 kcal',
    duration: '45 min',
    difficulty: 'Intermediate',
    benefits: 'Builds muscle, strengthens bones, boosts metabolism'
  },
];

const dietFoods = [
  {
    id: 'diet-1',
    name: 'Salad Bowl',
    image: require('../../assets/Images/salad.png'),
    description: 'Fresh and crunchy salad packed with nutrients and antioxidants to fuel your body.',
    calories: 150,
    protein: '3g',
    prepTime: '10 min',
    benefits: 'Low calorie, high fiber, rich in vitamins'
  },
  {
    id: 'diet-2',
    name: 'Grilled Chicken',
    image: require('../../assets/Images/chicken.png'),
    description: 'Lean protein source with minimal fat, perfect for muscle recovery and growth.',
    calories: 220,
    protein: '30g',
    prepTime: '20 min',
    benefits: 'High protein, low carb, versatile'
  },
  {
    id: 'diet-3',
    name: 'Fruit Mix',
    image: require('../../assets/Images/fruits.png'),
    description: 'Natural sweetness with essential vitamins, minerals and fiber for healthy digestion.',
    calories: 120,
    protein: '2g',
    prepTime: '5 min',
    benefits: 'Natural energy, hydrating, antioxidant-rich'
  },
];

export default HomeScreen;