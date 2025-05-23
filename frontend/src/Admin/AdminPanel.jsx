import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, Image, ScrollView, RefreshControl, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const AdminPanel = () => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [trainers, setTrainers] = useState([]);
  const [creatingTrainer, setCreatingTrainer] = useState(false);

  // Supplement form state
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Trainer form state
  const [trainerUsername, setTrainerUsername] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');
  const [trainerFullName, setTrainerFullName] = useState('');
  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerBio, setTrainerBio] = useState('');
  const [trainerImage, setTrainerImage] = useState(null);
  const [trainerSpecialties, setTrainerSpecialties] = useState('');
  const [revenue] = useState(Math.floor(Math.random() * 2) + 12);

  const navigation = useNavigation();

  // Generate random chart data
  const generateChartData = useCallback(() => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 50),
        color: (opacity = 1) => `rgba(106, 17, 203, ${opacity})`,
        strokeWidth: 2
      }]
    };
  }, []);

  const [chartData, setChartData] = useState(generateChartData());

  // Update active users and chart data
  const updateMetrics = useCallback(() => {
    setActiveUsers(Math.floor(Math.random() * 2) + 3); // Random between 50-100
    setChartData(generateChartData());
  }, [generateChartData]);

  useEffect(() => {
    updateMetrics();
    fetchSupplements();
    fetchTrainers();

    const interval = setInterval(updateMetrics, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateMetrics();
    fetchSupplements();
    fetchTrainers();
    setTimeout(() => setRefreshing(false), 1000);
  }, [updateMetrics]);

  const fetchSupplements = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/supplements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSupplements(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to fetch supplements' });
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
      const data = await res.json();
      setTrainers(data.trainers || data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to fetch trainers' });
    }
  };

  const deleteTrainer = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/trainers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      Toast.show({ type: 'success', text1: 'Trainer deleted' });
      fetchTrainers();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to delete trainer' });
    }
  };

  const toggleTrainerStatus = async (id, isActive) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/trainers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      fetchTrainers();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to update status' });
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
      if (selected) {
        setter(selected);
        Toast.show({ type: 'success', text1: 'Image selected' });
      }
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        Toast.show({ type: 'error', text1: 'Image selection error' });
      }
    }
  };

  const handleSaveSupplement = async () => {
    if (!name || !purpose || !price) {
      Toast.show({ type: 'error', text1: 'All fields required' });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('purpose', purpose);
    formData.append('price', price);

    if (image) {
      formData.append('image', {
        uri: image.path,
        name: image.filename || 'supplement.jpg',
        type: image.mime,
      });
    }

    try {
      const url = editingId ? `${BASE_URL}/supplements/${editingId}` : `${BASE_URL}/supplements`;
      await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      Toast.show({ type: 'success', text1: 'Supplement saved' });
      resetSupplementForm();
      fetchSupplements();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error saving supplement' });
    }
  };

  const handleSaveTrainer = async () => {
    if (!trainerUsername || !trainerPassword || !trainerFullName || !trainerSpecialties) {
      Toast.show({ 
        type: 'error', 
        text1: 'Missing required fields',
        text2: 'Please fill all fields marked with *' 
      });
      return;
    }

    setCreatingTrainer(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    
    formData.append('username', trainerUsername);
    formData.append('password', trainerPassword);
    formData.append('fullName', trainerFullName);
    formData.append('email', trainerEmail);
    formData.append('bio', trainerBio);
    formData.append('specialties', trainerSpecialties);

    if (trainerImage) {
      formData.append('image', {
        uri: trainerImage.path,
        name: trainerImage.filename || 'trainer.jpg',
        type: trainerImage.mime,
      });
    }

    try {
      const response = await fetch(`${BASE_URL}/trainers`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create trainer');
      }

      Toast.show({ type: 'success', text1: 'Trainer created successfully' });
      resetTrainerForm();
      fetchTrainers();
    } catch (error) {
      console.error('Error creating trainer:', error);
      Toast.show({ 
        type: 'error', 
        text1: 'Error creating trainer',
        text2: error.message 
      });
    } finally {
      setCreatingTrainer(false);
    }
  };

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'Login_Page' }] });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Logout failed' });
    }
  };

  const resetSupplementForm = () => {
    setName('');
    setPurpose('');
    setPrice('');
    setImage(null);
    setEditingId(null);
  };

  const resetTrainerForm = () => {
    setTrainerUsername('');
    setTrainerPassword('');
    setTrainerFullName('');
    setTrainerEmail('');
    setTrainerBio('');
    setTrainerImage(null);
    setTrainerSpecialties('');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6a11cb']}
          tintColor="#6a11cb"
        />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome Admin</Text>
            <Text style={styles.header}>Dashboard Overview</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Icon name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardElevated]}>
            <View style={styles.statIconContainer}>
              <Icon name="today" size={20} color="#6a11cb" />
            </View>
            <Text style={styles.statValue}>{activeUsers}</Text>
            <Text style={styles.statLabel}>Active Now</Text>
          </View>

          <View style={[styles.statCard, styles.statCardElevated]}>
            <View style={styles.statIconContainer}>
              <Icon name="attach-money" size={20} color="#6a11cb" />
            </View>
            <Text style={styles.statValue}>${revenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Weekly Activity Chart */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <TouchableOpacity onPress={updateMetrics}>
            <Icon name="refresh" size={20} color="#6a11cb" />
          </TouchableOpacity>
        </View>
        <View style={[styles.chartContainer, styles.elevatedCard]}>
          <LineChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(106, 17, 203, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#6a11cb'
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </View>

      {/* Supplement Management */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Supplement Management</Text>
        <View style={[styles.formContainer, styles.elevatedCard]}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Purpose"
            value={purpose}
            onChangeText={setPurpose}
          />
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>£</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => chooseImage(setImage)}
          >
            <Icon name={image ? 'photo-camera' : 'add-a-photo'} size={20} color="#6a11cb" />
            <Text style={styles.uploadBtnText}>
              {image ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image.path }} style={styles.imagePreview} />
          )}

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSaveSupplement}
          >
            <Text style={styles.primaryBtnText}>
              {editingId ? 'Update' : 'Add'} Supplement
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trainer Management */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trainer Management</Text>
        <View style={[styles.formContainer, styles.elevatedCard]}>
          <View style={styles.twoColumnRow}>
            <View style={styles.column}>
              <TextInput
                style={styles.input}
                placeholder="Username *"
                value={trainerUsername}
                onChangeText={setTrainerUsername}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                style={styles.input}
                placeholder="Password *"
                secureTextEntry
                value={trainerPassword}
                onChangeText={setTrainerPassword}
              />
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.column}>
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={trainerFullName}
                onChangeText={setTrainerFullName}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={trainerEmail}
                onChangeText={setTrainerEmail}
              />
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Trainer Bio"
            multiline
            value={trainerBio}
            onChangeText={setTrainerBio}
          />

          <TextInput
            style={styles.input}
            placeholder="Specialties (comma separated) *"
            value={trainerSpecialties}
            onChangeText={setTrainerSpecialties}
          />

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => chooseImage(setTrainerImage)}
          >
            <Icon name={trainerImage ? 'photo-camera' : 'add-a-photo'} size={20} color="#6a11cb" />
            <Text style={styles.uploadBtnText}>
              {trainerImage ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          {trainerImage && (
            <Image source={{ uri: trainerImage.path }} style={styles.imagePreview} />
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, (!trainerUsername || !trainerPassword || !trainerFullName || !trainerSpecialties) && styles.disabledBtn]}
            onPress={handleSaveTrainer}
            disabled={!trainerUsername || !trainerPassword || !trainerFullName || !trainerSpecialties || creatingTrainer}
          >
            {creatingTrainer ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Create Trainer</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Trainers List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.subSectionTitle}>Current Trainers</Text>
          <Text style={styles.trainerCount}>{trainers.length} trainers</Text>
        </View>

        {trainers.map((trainer) => (
          <View key={trainer._id} style={[styles.trainerCard, styles.elevatedCard]}>
            <Image
              source={{ uri: trainer.imageUrl ? `${BASE_URL}/${trainer.imageUrl}` : null }}// Fixed bug and image of trainer is shown

              style={styles.trainerImage}
            />
            <View style={styles.trainerInfo}>
              <View style={styles.trainerHeader}>
                <Text style={styles.trainerName}>{trainer.fullName || trainer.username}</Text>
                <TouchableOpacity
                  onPress={() => toggleTrainerStatus(trainer._id, !trainer.isActive)}
                  style={[
                    styles.statusBtn,
                    trainer.isActive ? styles.activeBtn : styles.inactiveBtn
                  ]}
                >
                  <Text style={[
                    styles.statusBtnText,
                    trainer.isActive ? styles.activeBtnText : styles.inactiveBtnText
                  ]}>
                    {trainer.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.trainerUsername}>@{trainer.username}</Text>
              <Text style={styles.trainerBio}>{trainer.bio}</Text>
              <View style={styles.specialtiesContainer}>
                <Icon name="fitness-center" size={16} color="#6a11cb" />
                <Text style={styles.trainerSpecialties}>
                  {Array.isArray(trainer.specialties)
                    ? trainer.specialties.join(', ')
                    : trainer.specialties}
                </Text>
              </View>
              <View style={styles.trainerActions}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteTrainer(trainer._id)}
                >
                  <Icon name="delete" size={18} color="#dc3545" />
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingBottom: 40,
  },
  headerContainer: {
    padding: 25,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  logoutBtn: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
  },
  statCardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconContainer: {
    backgroundColor: 'rgba(106, 17, 203, 0.1)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  viewAllText: {
    color: '#6a11cb',
    fontSize: 14,
    fontWeight: '500',
  },
  trainerCount: {
    color: '#666',
    fontSize: 14,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  elevatedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 15,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
    marginBottom: 0,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#6a11cb',
    fontWeight: '600',
    marginLeft: 10,
  },
  primaryBtn: {
    backgroundColor: '#6a11cb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  trainerCard: {
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  trainerInfo: {
    flex: 1,
  },
  trainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  trainerUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  trainerBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainerSpecialties: {
    fontSize: 13,
    color: '#6a11cb',
    marginLeft: 5,
    fontWeight: '500',
  },
  statusBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  activeBtn: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
  },
  inactiveBtn: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeBtnText: {
    color: '#28a745',
  },
  inactiveBtnText: {
    color: '#dc3545',
  },
  trainerActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(106, 17, 203, 0.1)',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
  },
  editBtnText: {
    color: '#6a11cb',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  deleteBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  deleteBtnText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    width: '48%',
  },
});

export default AdminPanel;