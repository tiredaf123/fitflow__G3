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

const AbsWorkout = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const exercises = [
    { name: 'Crunches', sets: '3 sets of 12 reps', icon: 'format-list-numbered' },
    { name: 'Plank', sets: '3 sets of 30 sec', icon: 'timer' },
    { name: 'Mountain Climbers', sets: '3 sets of 20 reps', icon: 'directions-run' },
    { name: 'Cable Crunches', sets: '3 sets of 15 reps', icon: 'settings-ethernet' },
    { name: 'Side Plank', sets: '3 sets of 20 sec/side', icon: 'compare-arrows' },
    { name: 'Flutter Kicks', sets: '3 sets of 20 reps', icon: 'swap-vert' },
  ];

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/ExerciseImages/3.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>ABS WORKOUT</Text>
          <Text style={styles.subTitle}>6 exercises • 35 minutes</Text>
          <TouchableOpacity 
            style={styles.startButton}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>START WORKOUT</Text>
            <MaterialIcon name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
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
      backgroundColor: '#FFB800',  // Updated gold color
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
      color: '#FFB800',  // Updated gold color
      fontSize: 14,
      fontWeight: '600',
    },
  });

export default AbsWorkout;