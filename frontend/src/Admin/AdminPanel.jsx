import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, Image, ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;

const AdminPanel = () => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [trainerUsername, setTrainerUsername] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');
  const [trainerBio, setTrainerBio] = useState('');
  const [trainerImage, setTrainerImage] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [trainerSpecialties, setTrainerSpecialties] = useState('');

  const navigation = useNavigation();

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }],
  };

  const fetchSupplements = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/supplements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Server error (supplements):', res.status, text);
        try {
          const errorJson = JSON.parse(text);
          throw new Error(`${res.status} ${errorJson.message || 'Request failed'}`);
        } catch (jsonError) {
          throw new Error(`${res.status} ${text}`);
        }
      }
      const data = await res.json();
      setSupplements(data);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/trainers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Server error (trainers):', res.status, text);
        try {
          const errorJson = JSON.parse(text);
          throw new Error(`${res.status} ${errorJson.message || 'Request failed'}`);
        } catch (jsonError) {
          throw new Error(`${res.status} ${text}`);
        }
      }
      const data = await res.json();
      setTrainers(data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const deleteTrainer = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/trainers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Server error (deleteTrainer):', res.status, text);
        try {
          const errorJson = JSON.parse(text);
          throw new Error(`${res.status} ${errorJson.message || 'Request failed'}`);
        } catch (jsonError) {
          throw new Error(`${res.status} ${text}`);
        }
      }
      Toast.show({ type: 'success', text1: 'Trainer deleted' });
      fetchTrainers();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to delete trainer' });
    }
  };

  const chooseImage = async (setter) => {
    try {
      const selected = await ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        compressImageQuality: 0.7,
      });
      setter(selected);
    } catch (error) {
      console.log('Image selection cancelled', error);
    }
  };

  const handleSaveSupplement = async () => {
    if (!name || !purpose || !price) {
      Toast.show({ type: 'error', text1: 'All supplement fields required' });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('purpose', purpose);
    formData.append('price', price);
    if (image && !editingId) {
      formData.append('image', {
        uri: image.path || image.uri,
        name: image.filename || 'supplement.jpg',
        type: image.mime,
      });
    }

    const url = editingId
      ? `${BASE_URL}/supplements/${editingId}`
      : `${BASE_URL}/supplements`;

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          ...(editingId ? { 'Content-Type': 'application/json' } : {}),
        },
        body: editingId
          ? JSON.stringify({ name, purpose, price, imageUrl: image?.path || '' })
          : formData,
      });

      if (res.ok) {
        Toast.show({ type: 'success', text1: 'Supplement saved' });
        setName('');
        setPurpose('');
        setPrice('');
        setImage(null);
        setEditingId(null);
        fetchSupplements();
      }
    } catch (error) {
      console.error('Error saving supplement:', error);
      Toast.show({ type: 'error', text1: 'Error saving supplement' });
    }
  };

  const handleSaveTrainer = async () => {
    if (!trainerUsername || !trainerPassword || !trainerBio) {
      Toast.show({ type: 'error', text1: 'All trainer fields required' });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('username', trainerUsername);
    formData.append('password', trainerPassword);
    formData.append('bio', trainerBio);
    formData.append('specialties', trainerSpecialties);
    if (trainerImage) {
      formData.append('image', {
        uri: trainerImage.path || trainerImage.uri,
        name: trainerImage.filename || 'trainer.jpg',
        type: trainerImage.mime,
      });
    }

    try {
      const res = await fetch(`${BASE_URL}/trainers`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Server error (handleSaveTrainer):', res.status, text);
        try {
          const errorJson = JSON.parse(text);
          throw new Error(`${res.status} ${errorJson.message || 'Request failed'}`);
        } catch (jsonError) {
          throw new Error(`${res.status} ${text}`);
        }
      }
      Toast.show({ type: 'success', text1: 'Trainer added' });
      setTrainerUsername('');
      setTrainerPassword('');
      setTrainerBio('');
      setTrainerImage(null);
      setTrainerSpecialties('');
      fetchTrainers();
    } catch (error) {
      console.error('Error saving trainer:', error);
      Toast.show({ type: 'error', text1: 'Failed to save trainer' });
    }
  };

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Server error (handleLogout):', res.status, text);
        try {
          const errorJson = JSON.parse(text);
          throw new Error(`${res.status} ${errorJson.message || 'Request failed'}`);
        } catch (jsonError) {
          throw new Error(`${res.status} ${text}`);
        }
      }
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'Login_Page' }] });
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({ type: 'error', text1: 'Logout failed' });
    }
  };

  useEffect(() => {
    fetchSupplements();
    fetchTrainers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Logout */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Admin Panel</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={28} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCardsContainer}>
        <View style={styles.cardSummary}>
          <Icon name="group" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Users</Text>
          <Text style={styles.cardValue}>124</Text>
        </View>
        <View style={[styles.cardSummary, { backgroundColor: '#f39c12' }]}>
          <Icon name="fitness-center" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Supplement</Text>
          <Text style={styles.cardValue}>{supplements.length}</Text>
        </View>
        <View style={[styles.cardSummary, { backgroundColor: '#2ecc71' }]}>
          <Icon name="attach-money" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Revenue</Text>
          <Text style={styles.cardValue}>£1.5K</Text>
        </View>
      </View>

      {/* Weekly Active Users Chart */}
      <Text style={styles.subHeader}>Weekly Active Users</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#f1f1f1',
          backgroundGradientTo: '#e1e1e1',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: () => '#333',
          propsForDots: { r: '5', strokeWidth: '2', stroke: '#007bff' },
        }}
        bezier
        style={{ borderRadius: 10, marginBottom: 20 }}
      />

      {/* Add / Update Supplement */}
      <Text style={styles.subHeader}>Add / Update Supplement</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Purpose" value={purpose} onChangeText={setPurpose} />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.uploadBtn} onPress={() => chooseImage(setImage)}>
        <Text style={styles.uploadBtnText}>{image ? 'Change Image' : 'Upload Image'}</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image.path || image.uri }} style={{ width: '100%', height: 150, marginBottom: 10 }} />
      )}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSupplement}>
        <Text style={styles.saveBtnText}>{editingId ? 'Update' : 'Add'} Supplement</Text>
      </TouchableOpacity>

      {/* Add Trainer */}
      <Text style={styles.subHeader}>Add Trainer</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={trainerUsername}
        onChangeText={setTrainerUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={trainerPassword}
        onChangeText={setTrainerPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Trainer Bio"
        value={trainerBio}
        onChangeText={setTrainerBio}
      />

      <TextInput
        style={styles.input}
        placeholder="Specialties (comma separated)"
        value={trainerSpecialties}
        onChangeText={setTrainerSpecialties}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={() => chooseImage(setTrainerImage)}>
        <Text style={styles.uploadBtnText}>{trainerImage ? 'Change Image' : 'Upload Image'}</Text>
      </TouchableOpacity>

      {trainerImage && (
        <Image
          source={{ uri: trainerImage.path || trainerImage.uri }}
          style={{ width: '100%', height: 150, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTrainer}>
        <Text style={styles.saveBtnText}>Save Trainer</Text>
      </TouchableOpacity>

      {/* Trainers List */}
      <Text style={styles.subHeader}>Trainers</Text>
      {trainers.map((trainer) => (
        <View key={trainer._id} style={styles.trainerCard}>
          <Image
            source={{ uri: trainer.imageUrl ? `${BASE_URL}${trainer.imageUrl}` : null }}
            style={styles.trainerImage}
          />
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>{trainer.username}</Text>
            <Text style={styles.trainerBio}>{trainer.bio}</Text>
            <Text style={styles.trainerSpecialties}>
              Specialties: {Array.isArray(trainer.specialties) ? trainer.specialties.join(', ') : trainer.specialties}
            </Text>
            <TouchableOpacity onPress={() => deleteTrainer(trainer._id)}>
              <Text style={{ color: 'red', marginTop: 8 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardSummary: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  cardValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadBtn: {
    backgroundColor: '#6c5ce7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  trainerCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  trainerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trainerBio: {
    fontSize: 14,
    color: '#666',
  },
  trainerSpecialties: {
    fontSize: 14,
    color: '#666',
  },
});

export default AdminPanel;