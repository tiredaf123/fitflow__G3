// screens/TrainerDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const TrainerDashboard = () => {
  const navigation = useNavigation();

  const [trainerName] = useState('Alex Strong');
  const [clients] = useState([
    { name: 'John Doe', status: 'In Session' },
    { name: 'Jane Smith', status: 'Scheduled' },
  ]);
  const [schedule] = useState([
    { time: '10:00 AM', client: 'John Doe' },
    { time: '1:00 PM', client: 'Jane Smith' },
  ]);
  const [workouts] = useState([
    { title: 'Push Day Routine' },
    { title: 'Cardio Blast' },
  ]);

  const [clientProgress, setClientProgress] = useState([]);

  useEffect(() => {
    loadClientProgress();
  }, []);

  const loadClientProgress = async () => {
    try {
      // Assuming that status keys for Abs, Leg, etc. are being saved in AsyncStorage
      const johnProgress = {
        name: 'John Doe',
        abs: await AsyncStorage.getItem('absWorkoutStatus') || 'incomplete',
        legs: await AsyncStorage.getItem('legWorkoutStatus') || 'incomplete',
        back: await AsyncStorage.getItem('backWorkoutStatus') || 'incomplete',
        arms: await AsyncStorage.getItem('armsWorkoutStatus') || 'incomplete',
      };
      const janeProgress = {
        name: 'Jane Smith',
        abs: await AsyncStorage.getItem('absWorkoutStatus') || 'incomplete',
        legs: await AsyncStorage.getItem('legWorkoutStatus') || 'incomplete',
        back: await AsyncStorage.getItem('backWorkoutStatus') || 'incomplete',
        arms: await AsyncStorage.getItem('armsWorkoutStatus') || 'incomplete',
      };

      setClientProgress([johnProgress, janeProgress]);
    } catch (error) {
      console.log('Error loading client progress', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'incomplete':
        return '#FFCC00';
      case 'in progress':
        return '#4CAF50';
      case 'done':
        return '#2196F3';
      default:
        return '#FFCC00';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Notifications */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Welcome, {trainerName} 👋</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          style={styles.bellButton}
        >
          <Icon name="notifications" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Schedule Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🗓️ Today's Schedule</Text>
        {schedule.map((item, index) => (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.client}>with {item.client}</Text>
          </View>
        ))}
      </View>

      {/* Clients Card with Workout Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💼 Your Clients</Text>
        {clientProgress.map((client, index) => (
          <View key={index} style={styles.clientItem}>
            <Text style={styles.clientName}>{client.name}</Text>
            {['abs', 'legs', 'back', 'arms'].map((workout) => (
              <View key={workout} style={styles.progressRow}>
                <Text style={styles.progressText}>{workout.toUpperCase()}</Text>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: getStatusColor(client[workout]) },
                  ]}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Workout Plans */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏋️ Workout Plans</Text>
        {workouts.map((workout, index) => (
          <TouchableOpacity
            key={index}
            style={styles.workoutItem}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            <Text style={styles.workoutTitle}>{workout.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AddWorkout')}
        >
          <Text style={styles.actionText}>+ Add Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('MessageClient')}
        >
          <Text style={styles.actionText}>📨 Message Client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  bellButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  time: {
    fontSize: 16,
  },
  client: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  clientItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
  },
  progressBar: {
    width: 100,
    height: 10,
    borderRadius: 5,
  },
  workoutItem: {
    paddingVertical: 8,
  },
  workoutTitle: {
    fontSize: 16,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TrainerDashboard;
