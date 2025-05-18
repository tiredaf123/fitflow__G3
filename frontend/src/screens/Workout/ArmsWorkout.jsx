import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const exerciseData = [
  { name: 'Bicep Curls', video: 'https://www.youtube.com/embed/ykJmrZ5v0Oo' },
  { name: 'Preacher Curl', video: 'https://www.youtube.com/embed/IaZGv2ZC4Q4' },
  { name: 'Overhead Press', video: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
  { name: 'Bench Dip', video: 'https://www.youtube.com/embed/6kALZikXxLc' },
  { name: 'Skull Crusher', video: 'https://www.youtube.com/embed/d_KZxkY_0cM' },
  { name: 'Triceps Pushdown', video: 'https://www.youtube.com/embed/2-LAMcpzODU' },
];

const ArmsWorkout = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const exercises = [
    { name: 'Bicep Curls', sets: '3 sets of 12 reps', icon: 'fitness-center' },
    { name: 'Preacher Curl', sets: '3 sets of 10 reps', icon: 'settings' },
    { name: 'Overhead Press', sets: '3 sets of 12 reps', icon: 'arrow-upward' },
    { name: 'Bench Dip', sets: '3 sets of 15 reps', icon: 'arrow-downward' },
    { name: 'Skull Crusher', sets: '3 sets of 12 reps', icon: 'whatshot' },
    { name: 'Triceps Pushdown', sets: '3 sets of 15 reps', icon: 'vertical-align-bottom' },
  ];

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [workoutStatus, setWorkoutStatus] = useState('incomplete');

  useEffect(() => {
    loadStatus();
  }, []);

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

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
 

  const saveStatus = async (status) => {
    try {
      await AsyncStorage.setItem('armsWorkoutStatus', status);
      setWorkoutStatus(status);
    } catch (error) {
      console.log('Failed to save workout status', error);
    }
  };

  const loadStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('armsWorkoutStatus');
      if (status) setWorkoutStatus(status);
    } catch (error) {
      console.log('Failed to load workout status', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/ExerciseImages/2.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>ARMS WORKOUT</Text>
          <Text style={styles.subTitle}>6 exercises • 40 minutes</Text>
          <TouchableOpacity 
            style={styles.startButton}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>START WORKOUT</Text>
            <MaterialIcon name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>


          <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>

          <Text style={styles.statusLabel}>Status: {workoutStatus}</Text>

          <View style={styles.statusButtons}>
            {['incomplete', 'in progress', 'done'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  workoutStatus === status && styles.selectedStatus,
                ]}
                onPress={() => saveStatus(status)}
              >
                <Text style={styles.statusText}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>

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
    </ScrollView>
  );
};

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
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 12,
      padding: 20,
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
    statusLabel: {
      color: '#fff',
      marginTop: 15,
      fontSize: 16,
    },
    statusButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
    statusButton: {
      backgroundColor: '#fff',
      borderRadius: 15,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    selectedStatus: {
      backgroundColor: '#FFCC00',
    },
    statusText: {
      color: '#000',
      fontWeight: '600',
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
    watchVideo: {
      color: '#FFCC00',
      fontWeight: 'bold',
      fontSize: 18,
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

export default ArmsWorkout;