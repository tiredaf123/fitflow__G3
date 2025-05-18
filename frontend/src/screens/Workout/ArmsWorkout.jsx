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
import { useTheme } from '../../navigation/ThemeProvider';
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
        source={require('../../assets/ExerciseImages/13.png')}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Arms Workout</Text>
          <Text style={styles.subTitle}>6 exercises | 40 mins</Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setIsTimerRunning((prev) => !prev)}
          >
            <Text style={styles.startButtonText}>
              {isTimerRunning ? 'Pause Timer' : 'Start Workout'}
            </Text>
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
        {exerciseData.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <View>
              <Text style={styles.exerciseText}>{exercise.name}</Text>
              <Text style={styles.setsText}>3 sets of 12 reps</Text>
            </View>
            <TouchableOpacity onPress={() => setVideoUrl(exercise.video)}>
              <Text style={styles.watchVideo}>▶</Text>
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
              source={{ uri: videoUrl }}
              style={{ flex: 1 }}
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
      padding: 20,
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
    watchVideo: {
      color: '#FFCC00',
      fontWeight: 'bold',
      fontSize: 18,
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

export default ArmsWorkout;
