import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';

const ChestWorkout = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

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

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/ExerciseImages/7.png')}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Chest Workout</Text>
          <Text style={styles.subTitle}>6 exercises | 50 mins</Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setIsTimerRunning((prev) => !prev)}
          >
            <Text style={styles.startButtonText}>
              {isTimerRunning ? 'Pause Timer' : 'Start Workout'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
        </View>
      </ImageBackground>

      <View style={styles.exerciseList}>
        {[
          'Push-up',
          'Barbell Bench Press',
          'Incline Dumbbell Press',
          'Chest Dips',
          'Cable Crossover',
          'Incline Cable Fly',
        ].map((exercise, index) => (
          <TouchableOpacity key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>{exercise}</Text>
            <Text style={styles.setsText}>3 sets of 12 reps</Text>
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
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    },
    imageBackground: {
      height: 300,
      margin: 20,
      borderRadius: 15,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 15,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    subTitle: {
      fontSize: 16,
      color: '#ddd',
      marginVertical: 5,
    },
    startButton: {
      backgroundColor: '#FFCC00',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 10,
    },
    startButtonText: {
      fontSize: 18,
      color: '#000',
      fontWeight: 'bold',
    },
    timerText: {
      fontSize: 24,
      color: '#fff',
      marginTop: 10,
      fontWeight: '600',
    },
    exerciseList: {
      marginTop: 20,
      marginHorizontal: 20,
    },
    exerciseItem: {
      backgroundColor: isDarkMode ? '#333' : '#EEE',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    exerciseText: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 16,
    },
    setsText: {
      color: '#FFCC00',
      fontSize: 14,
    },
  });

export default ChestWorkout;
