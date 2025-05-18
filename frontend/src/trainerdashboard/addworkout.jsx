import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';

const AddWorkout = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Image Error', result.errorMessage || 'Could not pick image.');
      return;
    }

    const asset = result.assets?.[0];
    if (asset) setImage(asset);
  };

  const handleSave = async () => {
    if (!title || !description || !duration) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', parseInt(duration));

      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: image.fileName || 'workout.jpg',
          type: image.type || 'image/jpeg',
        });
      }

      const res = await fetch(`${BASE_URL}/workouts/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to add workout');
        return;
      }

      Alert.alert('Success', 'Workout added successfully!');
      setTitle('');
      setDescription('');
      setDuration('');
      setImage(null);
      navigation.goBack();
    } catch (error) {
      console.error('Add workout error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#F0F4F8' }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 18, color: '#4CAF50', fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' }}>
          🏋️ Create a New Workout Plan
        </Text>

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#555' }}>Workout Title</Text>
        <TextInput
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#ccc', fontSize: 16 }}
          placeholder="e.g., Upper Body Strength"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#555' }}>Description</Text>
        <TextInput
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#ccc', fontSize: 16, height: 100 }}
          placeholder="Describe the workout plan..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#555' }}>Duration (minutes)</Text>
        <TextInput
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#ccc', fontSize: 16 }}
          placeholder="e.g., 45"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, color: '#4CAF50', fontWeight: '600' }}>
            {image ? 'Change Workout Image' : 'Upload Workout Image'}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 10 }}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          onPress={handleSave}
          style={{ backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 30 }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Save Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  inner: { padding: 20 },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 18, color: '#4CAF50', fontWeight: '600' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
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
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default AddWorkout;
