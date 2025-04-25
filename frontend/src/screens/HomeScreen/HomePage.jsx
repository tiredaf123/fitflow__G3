// Enhanced HomeScreen with cleaner layout, modern design, animations, and goal-based filtering
import React, { useState, useRef } from 'react';
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

const { width } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { selectedGoal } = route.params || {};

  const [flippedCardId, setFlippedCardId] = useState(null);
  const flipAnimations = useRef({}).current;

  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#FAFAFA',
    },
    greetingText: {
      fontSize: 24,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    subText: {
      fontSize: 14,
      color: isDarkMode ? '#AAAAAA' : '#555555',
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Navbar */}
        <View style={styles.navbar}>
          <Text style={styles.title}>FitFlow</Text>
          <TouchableOpacity>
            <Icon name="notifications" size={26} color={isDarkMode ? '#FFF' : '#333'} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileWrapper}>
          <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
          <View>
            <Text style={themeStyles.greetingText}>Welcome Back!</Text>
            {selectedGoal && <Text style={themeStyles.subText}>Goal: {selectedGoal}</Text>}
          </View>
        </View>

        {/* Diet Plans */}
        <Text style={styles.sectionTitle}>Diet Plans 🍽️</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {dietFoods.map((item) => renderFlippableCard(item))}
        </ScrollView>

        {/* Workout Plans */}
        <Text style={styles.sectionTitle}>Workouts 💪</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {filteredWorkouts.map((item) => renderFlippableCard(item))}
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('GoalSelection')}
          >
            <Icon name="track-changes" size={22} color="#FEC400" />
            <Text style={styles.actionButtonText}>Update Your Goal</Text>
          </TouchableOpacity>

          {/* NEW Trainer Dashboard Button */}
          <TouchableOpacity
            style={[styles.actionButton, { marginTop: 15 }]}
            onPress={() => navigation.navigate('TrainerDashboard')}
          >
            <Icon name="fitness-center" size={22} color="#FEC400" />
            <Text style={styles.actionButtonText}>Go to Trainer Dashboard</Text>
          </TouchableOpacity>
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

    return (
      <TouchableOpacity key={item.id} onPress={() => handleFlip(item.id)}>
        <View style={styles.cardContainer}>
          <Animated.View
            style={[styles.card, {
              transform: [{ rotateY: frontInterpolate }],
              backfaceVisibility: 'hidden',
              position: 'absolute',
            }]}
          >
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.name}</Text>
          </Animated.View>

          <Animated.View
            style={[styles.card, styles.cardBack, {
              transform: [{ rotateY: backInterpolate }],
              backfaceVisibility: 'hidden',
            }]}
          >
            <Text style={styles.cardText}>{item.name}</Text>
            {item.calories && <Text style={styles.cardText}>Calories: {item.calories}</Text>}
            {item.protein && <Text style={styles.cardText}>Protein: {item.protein}</Text>}
            {item.caloriesBurned && <Text style={styles.cardText}>Burns: {item.caloriesBurned}</Text>}
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FEC400',
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 15,
    color: '#FEC400',
  },
  scrollRow: {
    paddingVertical: 15,
    paddingLeft: 20,
  },
  cardContainer: {
    width: 130,
    height: 160,
    marginRight: 15,
    perspective: 1000,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backgroundColor: '#FFF7E6',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEC400',
  },
  actionButtonText: {
    color: '#FEC400',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});

const workoutLibrary = [
  { id: 'workout-1', name: 'Morning Yoga', goal: 'Improve Flexibility', image: require('../../assets/Images/yoga.png'), caloriesBurned: '100-150 kcal' },
  { id: 'workout-2', name: 'HIIT Training', goal: 'Lose Weight', image: require('../../assets/Images/hiit.png') },
  { id: 'workout-3', name: 'Strength Training', goal: 'Build Muscles', image: require('../../assets/Images/strength.png') },
  { id: 'workout-4', name: 'Cardio Blast', goal: 'Lose Weight', image: require('../../assets/Images/cardio.png') },
  { id: 'workout-5', name: 'Pilates', goal: 'Tone & Define', image: require('../../assets/Images/pilates.png') },
  { id: 'workout-6', name: 'Stretching', goal: 'Improve Flexibility', image: require('../../assets/Images/stretching.png') },
];

const dietFoods = [
  { id: 'diet-1', name: 'Salad Bowl', image: require('../../assets/Images/salad.png'), calories: 150, protein: '3g' },
  { id: 'diet-2', name: 'Grilled Chicken', image: require('../../assets/Images/chicken.png'), calories: 220, protein: '30g' },
  { id: 'diet-3', name: 'Fruit Mix', image: require('../../assets/Images/fruits.png'), calories: 120, protein: '2g' },
  { id: 'diet-4', name: 'Oatmeal', image: require('../../assets/Images/oatmeal.png'), calories: 180, protein: '5g' },
  { id: 'diet-5', name: 'Smoothie', image: require('../../assets/Images/smoothie.png'), calories: 200, protein: '8g' },
];

export default HomeScreen;
