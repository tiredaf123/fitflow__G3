// AddWorkout.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';

const AddWorkout = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { clientId } = route.params || {}; // Ensure clientId is passed in route

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!clientId) {
      return Alert.alert('Error', 'No client selected.');
    }
    if (!title || !description || !duration) {
      return Alert.alert('Missing Fields', 'Please fill in all fields.');
    }

    setSaving(true);
    try {
      // Get token
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      // Prepare request config with Authorization header
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { clientId, title, description, duration: Number(duration) };

      // Send POST request to save workout plan
      const { data } = await axios.post(`${BASE_URL}/api/workouts`, body, config);

      Alert.alert('Success', 'Workout Plan Saved!');
      // Reset form
      setTitle('');
      setDescription('');
      setDuration('');
      // Optionally navigate back
      navigation.goBack();
    } catch (err) {
      console.error('❌ Failed to save workout plan:', err);
      if (err.response) {
        Alert.alert('Server Error', err.response.data.message || 'Something went wrong.');
      } else {
        Alert.alert('Network Error', err.message);
      }
    } finally {
      setSaving(false);
    }

  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

const AddWorkout = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleSave = () => {
    if (!title || !description || !duration) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    Alert.alert('Success', 'Workout Plan Saved!');
    setTitle('');
    setDescription('');
    setDuration('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F0F4F8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>🏋️ Create a New Workout Plan</Text>

        <Text style={styles.label}>Workout Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Upper Body Strength"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Describe the workout plan..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 45"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Workout'}</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  inner: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,

    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddWorkout;
