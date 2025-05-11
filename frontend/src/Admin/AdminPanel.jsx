import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, Image, ScrollView, Alert, ActivityIndicator,
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
  // State
  const [supplements, setSupplements] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [trainerUsername, setTrainerUsername] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');
  const [trainerBio, setTrainerBio] = useState('');
  const [trainerImage, setTrainerImage] = useState(null);
  const [trainerSpecialties, setTrainerSpecialties] = useState('');

  const navigation = useNavigation();

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }],
  };

  // Fetch
  const fetchSupplements = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/supplements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSupplements(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error fetching supplements' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/trainers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrainers(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error fetching trainers' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/membership/admin/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error fetching members' });
    }
  };

  const deleteTrainer = async (id) => {
    Alert.alert('Delete Trainer', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await fetch(`${BASE_URL}/trainers/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchTrainers();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Error deleting trainer' });
          }
        },
      },
    ]);
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
    } catch {}
  };

  const handleSaveSupplement = async () => {
    if (!name || !purpose || !price) {
      Toast.show({ type: 'error', text1: 'All fields required' });
      return;
    }
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('purpose', purpose);
      formData.append('price', price);
      if (image && !editingId) {
        formData.append('image', {
          uri: image.path,
          name: 'supplement.jpg',
          type: image.mime,
        });
      }
      const res = await fetch(
        editingId
          ? `${BASE_URL}/supplements/${editingId}`
          : `${BASE_URL}/supplements`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            ...(editingId ? { 'Content-Type': 'application/json' } : {}),
          },
          body: editingId
            ? JSON.stringify({ name, purpose, price, imageUrl: image?.path })
            : formData,
        }
      );
      await fetchSupplements();
      setName('');
      setPurpose('');
      setPrice('');
      setImage(null);
      setEditingId(null);
      Toast.show({ type: 'success', text1: 'Supplement saved' });
    } catch {
      Toast.show({ type: 'error', text1: 'Error saving supplement' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTrainer = async () => {
    if (!trainerUsername || !trainerPassword || !trainerBio) {
      Toast.show({ type: 'error', text1: 'All fields required' });
      return;
    }
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', trainerUsername);
      formData.append('password', trainerPassword);
      formData.append('bio', trainerBio);
      formData.append('specialties', trainerSpecialties);
      if (trainerImage) {
        formData.append('image', {
          uri: trainerImage.path,
          name: 'trainer.jpg',
          type: trainerImage.mime,
        });
      }
      await fetch(`${BASE_URL}/trainers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      setTrainerUsername('');
      setTrainerPassword('');
      setTrainerBio('');
      setTrainerSpecialties('');
      setTrainerImage(null);
      fetchTrainers();
      Toast.show({ type: 'success', text1: 'Trainer saved' });
    } catch {
      Toast.show({ type: 'error', text1: 'Error saving trainer' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login_Page' }] });
  };

  useEffect(() => {
    fetchSupplements();
    fetchTrainers();
    fetchMembers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Admin Panel</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={28} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {/* Summary */}
          <View style={styles.summaryCardsContainer}>
            <View style={styles.cardSummary}>
              <Icon name="group" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Trainers</Text>
              <Text style={styles.cardValue}>{trainers.length}</Text>
            </View>
            <View style={[styles.cardSummary, { backgroundColor: '#f39c12' }]}>
              <Icon name="fitness-center" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Supplements</Text>
              <Text style={styles.cardValue}>{supplements.length}</Text>
            </View>
            <View style={[styles.cardSummary, { backgroundColor: '#2ecc71' }]}>
              <Icon name="attach-money" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Revenue</Text>
              <Text style={styles.cardValue}>~£1.5K</Text>
            </View>
          </View>

          {/* Add Supplement */}
          <Text style={styles.subHeader}>Add Supplement</Text>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Purpose" value={purpose} onChangeText={setPurpose} />
          <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <TouchableOpacity style={styles.uploadBtn} onPress={() => chooseImage(setImage)}>
            <Text style={styles.uploadBtnText}>{image ? 'Change Image' : 'Upload Image'}</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image.path }} style={{ height: 150, marginBottom: 10 }} />}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSupplement}>
            <Text style={styles.saveBtnText}>Save Supplement</Text>
          </TouchableOpacity>

          {/* Add Trainer */}
          <Text style={styles.subHeader}>Add Trainer</Text>
          <TextInput style={styles.input} placeholder="Username" value={trainerUsername} onChangeText={setTrainerUsername} />
          <TextInput style={styles.input} placeholder="Password" value={trainerPassword} secureTextEntry onChangeText={setTrainerPassword} />
          <TextInput style={styles.input} placeholder="Bio" value={trainerBio} onChangeText={setTrainerBio} />
          <TextInput style={styles.input} placeholder="Specialties (comma)" value={trainerSpecialties} onChangeText={setTrainerSpecialties} />
          <TouchableOpacity style={styles.uploadBtn} onPress={() => chooseImage(setTrainerImage)}>
            <Text style={styles.uploadBtnText}>{trainerImage ? 'Change Image' : 'Upload Image'}</Text>
          </TouchableOpacity>
          {trainerImage && <Image source={{ uri: trainerImage.path }} style={{ height: 150, marginBottom: 10 }} />}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTrainer}>
            <Text style={styles.saveBtnText}>Save Trainer</Text>
          </TouchableOpacity>

          {/* Member List */}
          <Text style={styles.subHeader}>Active Members</Text>
          {members.map((m) => (
            <View key={m._id} style={styles.trainerCard}>
              <Icon name="verified-user" size={30} color="#2ecc71" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.trainerName}>{m.user?.fullName || m.user?.username}</Text>
                <Text style={styles.trainerBio}>{m.user?.email}</Text>
                <Text style={styles.trainerSpecialties}>Plan: {m.planType} | Status: {m.status}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f6f8fc' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  uploadBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  uploadBtnText: { color: '#fff', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#28a745', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  summaryCardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardSummary: { backgroundColor: '#007bff', borderRadius: 12, padding: 16, alignItems: 'center', flex: 1, marginHorizontal: 5 },
  cardTitle: { color: '#fff', fontWeight: '600', fontSize: 15, marginTop: 6 },
  cardValue: { color: '#fff', fontWeight: 'bold', fontSize: 21, marginTop: 3 },
  trainerCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, alignItems: 'center' },
  trainerName: { fontWeight: 'bold', fontSize: 16 },
  trainerBio: { color: '#555', marginTop: 2 },
  trainerSpecialties: { color: '#888', marginTop: 2, fontSize: 13 },
});

export default AdminPanel;
