import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../navigation/ThemeProvider';
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
      <ImageBackground
        source={require('../../assets/ExerciseImages/1.png')}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Back Workout</Text>
          <Text style={styles.subTitle}>6 exercises | 45 mins</Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setIsTimerRunning((prev) => !prev)}
          >
            <Text style={styles.startButtonText}>
              {isTimerRunning ? 'Pause Timer' : 'Start Workout'}
            </Text>
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

      <View style={styles.exerciseList}>
        {exerciseData.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <View>
              <Text style={styles.exerciseText}>{exercise.name}</Text>
              <Text style={styles.setsText}>3 sets of 12 reps</Text>
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

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    },
    imageBackground: {
      height: 370,
      margin: 20,
      borderRadius: 15,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 15,
      padding: 10,
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
    videoLink: {
      color: '#FFCC00',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      flex: 1,
      backgroundColor: '#000',
      borderRadius: 10,
      overflow: 'hidden',
    },
    closeButton: {
      padding: 10,
      backgroundColor: '#FFCC00',
      alignItems: 'center',
    },
    closeText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

export default BackWorkout;
