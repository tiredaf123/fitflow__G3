import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../config/config';

const WeightInScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [currentWeight, setCurrentWeight] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchWeightData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/profile/weight`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentWeight(data.currentWeight?.weight || '');
        setLastUpdated(data.currentWeight?.date?.split('T')[0] || '');
        setWeightHistory(data.history || []);
      } else {
        Toast.show({ type: 'error', text1: 'Failed to fetch weight data' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Server error' });
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight) return Toast.show({ type: 'error', text1: 'Please enter a weight' });

    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/profile/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weight: newWeight,
          date: selectedDate,
        }),
      });

      if (res.ok) {
        Toast.show({ type: 'success', text1: 'Weight saved' });
        setNewWeight('');
        fetchWeightData();  // Fetch and update data after saving
        navigation.goBack();  // Navigate back to profile screen after saving
      } else {
        const errorData = await res.json();
        Toast.show({ type: 'error', text1: errorData.message || 'Save failed' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Server error' });
    }
  };

  useEffect(() => {
    fetchWeightData();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Weight In</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Current Weight</Text>
        <Text style={styles.value}>{currentWeight ? `${currentWeight} kg` : '--'}</Text>
        <Text style={styles.date}>Last updated: {lastUpdated || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Add New Entry</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter weight in kg"
            keyboardType="numeric"
            value={newWeight}
            onChangeText={setNewWeight}
          />
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: '#000' }}>{selectedDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={selectedDate}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleAddWeight}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Weight History</Text>
        <FlatList
          data={weightHistory}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>{item.weight} kg</Text>
              <Text style={styles.historyDate}>{new Date(item.date).toDateString()}</Text>
            </View>
          )}
        />
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  section: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: { fontSize: 16, marginBottom: 10, color: '#555' },
  value: { fontSize: 24, fontWeight: 'bold', marginBottom: 6, color: '#FF6B00' },
  date: { fontSize: 12, color: '#888' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: '#ccc', fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#FEC400', padding: 10, borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  historyText: {
    fontSize: 16,
    color: '#333'
  },
  historyDate: {
    fontSize: 12,
    color: '#888'
  }
});

export default WeightInScreen;
