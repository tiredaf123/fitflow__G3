import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../navigation/ThemeProvider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { WebView } from 'react-native-webview';

const exerciseData = [
  {
    name: 'Pull-ups',
    video: 'https://www.youtube.com/embed/eGo4IYlbE5g',
  },
  {
    name: 'Lat Pull-down',
    video: 'https://www.youtube.com/embed/CAwf7n6Luuc',
  },
  {
    name: 'T-Bar Row',
    video: 'https://www.youtube.com/embed/UjEiHJxMsRM',
  },
  {
    name: 'Machine Row',
    video: 'https://www.youtube.com/embed/Q_HvP9PQE3k',
  },
  {
    name: 'Cable Cruncher',
    video: 'https://www.youtube.com/embed/mqDTPtOjZB0',
  },
  {
    name: 'Deadlift',
    video: 'https://www.youtube.com/embed/op9kVnSso6Q',
  },
];

const STATUS_OPTIONS = ['Incomplete', 'In Progress', 'Done'];

const BackWorkout = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // Matching the data structure from Arms/Abs workouts
  const exercises = [
    { name: 'Pull-ups', sets: '3 sets of 8 reps', icon: 'pull-request' },
    { name: 'Lat Pull-down', sets: '4 sets of 10 reps', icon: 'arrow-downward' },
    { name: 'T-Bar Row', sets: '3 sets of 12 reps', icon: 'compare-arrows' },
    { name: 'Machine Row', sets: '3 sets of 15 reps', icon: 'settings' },
    { name: 'Cable Cruncher', sets: '3 sets of 20 reps', icon: 'swap-vert' },
    { name: 'Deadlift', sets: '4 sets of 6 reps', icon: 'fitness-center' },
  ];
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState('Incomplete');

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    // Load saved status from local storage
    const loadStatus = async () => {
      const savedStatus = await AsyncStorage.getItem('backWorkoutStatus');
      if (savedStatus) setStatus(savedStatus);
    };
    loadStatus();
  }, []);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await AsyncStorage.setItem('backWorkoutStatus', newStatus);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* IDENTICAL Header structure */}
      <ImageBackground
        source={require('../../assets/ExerciseImages/1.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>BACK WORKOUT</Text>
          <Text style={styles.subTitle}>6 exercises • 45 minutes</Text>
          <TouchableOpacity 
            style={styles.startButton}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>START WORKOUT</Text>
            <MaterialIcon name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>


          <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>

          {/* Status selector right below the timer */}
          <View style={styles.statusContainer}>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleStatusChange(option)}
                style={[
                  styles.statusButton,
                  status === option && styles.statusButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === option && styles.statusButtonTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>

      {/* EXACT SAME Exercise list layout */}
      <View style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.exerciseItem}
            activeOpacity={0.7}
          >
            <View style={styles.exerciseContent}>
              <View style={styles.exerciseIcon}>
                <MaterialIcon 
                  name={exercise.icon} 
                  size={24} 
                  color="#FFB800" 
                />
              </View>
              <Text style={styles.exerciseText}>{exercise.name}</Text>
            </View>
            <Text style={styles.setsText}>{exercise.sets}</Text>
          </TouchableOpacity>
        ))}
      </View>
            <TouchableOpacity onPress={() => setVideoUrl(exercise.video)}>
              <Text style={styles.videoLink}>▶</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={!!videoUrl} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setVideoUrl(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <WebView
              style={{ flex: 1, borderRadius: 10 }}
              source={{ uri: videoUrl }}
              allowsFullscreenVideo
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// COPIED STYLES from Arms/Abs for perfect consistency
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
    },
    imageBackground: {
      height: 280,
      margin: 15,
    },
    imageStyle: {
      borderRadius: 12,
      height: 370,
      margin: 20,
      borderRadius: 15,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 12,
      padding: 20,

      borderRadius: 15,
      padding: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: '#FFF',
      letterSpacing: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      marginBottom: 5,
    },
    subTitle: {
      fontSize: 16,
      color: '#FFF',
      fontWeight: '600',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      marginBottom: 20,
    },
    startButton: {
      backgroundColor: '#FFB800',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    startButtonText: {
      fontSize: 16,
      color: '#000',
      fontWeight: '700',
      marginRight: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
      gap: 10,
    },
    statusButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      backgroundColor: '#555',
      borderRadius: 20,
    },
    statusButtonActive: {
      backgroundColor: '#FFCC00',
    },
    statusButtonText: {
      color: '#fff',
      fontWeight: '500',
    },
    statusButtonTextActive: {
      color: '#000',
    },
    exerciseList: {
      marginTop: 10,
      marginHorizontal: 15,
      marginBottom: 20,
    },
    exerciseItem: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF',
      padding: 15,
      borderRadius: 10,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    exerciseContent: {
      flexDirection: 'row',
      alignItems: 'center',
    exerciseText: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 16,
    },
    setsText: {
      color: '#FFCC00',
      fontSize: 14,
    },
    videoLink: {
      color: '#FFCC00',
      fontSize: 16,
      fontWeight: 'bold',
    },
    exerciseIcon: {
      backgroundColor: isDarkMode ? '#333' : '#F5F5F5',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    exerciseText: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: 16,
      fontWeight: '500',
    },
    setsText: {
      color: '#FFB800',
      fontSize: 14,
      fontWeight: '600',
    },
  });

export default BackWorkout;