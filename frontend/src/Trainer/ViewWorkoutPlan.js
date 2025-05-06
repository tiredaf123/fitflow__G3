// ViewWorkoutPlan.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewWorkoutPlan = ({ route }) => {
  const { planId } = route.params;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No auth token');

        const res = await fetch(`http://localhost:5000/api/workouts/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlan(data);
      } catch (err) {
        console.error('Error fetching plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#4CAF50" />;
  }
  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Workout plan not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.label}>Duration:</Text>
      <Text style={styles.value}>{plan.duration} minutes</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{plan.description}</Text>
      <Text style={styles.label}>Created:</Text>
      <Text style={styles.value}>{new Date(plan.createdAt).toLocaleDateString()}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontSize: 16 },
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  value: { fontSize: 16, color: '#444', marginTop: 4 },
});

export default ViewWorkoutPlan;
