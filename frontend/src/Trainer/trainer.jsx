// screens/TrainerDashboard.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

// ✅ Update base URL for Android emulator
const BASE_URL = 'http://10.0.2.2:5000';

const TrainerDashboard = () => {
  const navigation = useNavigation();

  const [trainerName] = useState('Alex Strong'); // Static for now
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const clientsRes = await axios.get(`${BASE_URL}/api/profile/clients`, { headers });
        setClients(clientsRes.data);

        if (clientsRes.data.length > 0) {
          setSelectedClientId(clientsRes.data[0]._id);
          const workoutRes = await axios.get(`${BASE_URL}/api/workouts/${clientsRes.data[0]._id}`, { headers });
          setWorkouts(workoutRes.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching trainer data:', error.message);
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  const handleClientPress = async (clientId) => {
    setSelectedClientId(clientId);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${BASE_URL}/api/workouts/${clientId}`, { headers });
      setWorkouts(res.data);
    } catch (err) {
      console.error('Failed to fetch workouts for client:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Welcome, {trainerName} 👋</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          style={styles.bellButton}
        >
          <Icon name="notifications" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💼 Your Clients</Text>
        {clients.map((client, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.clientItem,
              selectedClientId === client._id && { backgroundColor: '#e7f9e9' },
            ]}
            onPress={() => handleClientPress(client._id)}
          >
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientStatus}>{client.status || 'Active'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏋️ Workout Plans</Text>
        {workouts.length === 0 ? (
          <Text style={{ fontStyle: 'italic', color: '#777' }}>No plans yet</Text>
        ) : (
          workouts.map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={{ fontSize: 13, color: '#666' }}>{workout.description}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AddWorkout', { clientId: selectedClientId })}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  clientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
  },
  clientName: {
    fontSize: 16,
  },
  clientStatus: {
    fontSize: 14,
    color: '#888',
  },
  workoutItem: {
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
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
