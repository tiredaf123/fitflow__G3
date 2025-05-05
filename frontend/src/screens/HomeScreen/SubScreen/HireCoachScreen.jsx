import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../config/config';
import BottomTabBar from '../../../components/BottomTabBar';

const HireCoachScreen = () => {
  const navigation = useNavigation();
  const [trainers, setTrainers] = useState([]);
  const [bookedTrainers, setBookedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const [publicRes, bookedRes] = await Promise.all([
          fetch(`${BASE_URL}/trainers/public`),
          fetch(`${BASE_URL}/bookings/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const publicData = await publicRes.json();
        const bookedData = await bookedRes.json();

        setTrainers(Array.isArray(publicData) ? publicData : []);
        setBookedTrainers(Array.isArray(bookedData) ? bookedData : []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load trainers or bookings.');
        setTrainers([]);
        setBookedTrainers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBooking = (trainer) => {
    setSelectedTrainer(trainer);
    setShowPicker(true);
  };

  const handleDateConfirm = async (event, date) => {
    setShowPicker(false);
    if (event.type === 'dismissed') return;

    const appointmentDate = date || selectedDate;
    setSelectedDate(appointmentDate);

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainer._id,
          appointmentDate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Booking confirmed.');
      } else {
        Alert.alert('Error', data.error || 'Booking failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error during booking.');
    }
  };

  const handleMessage = (trainer, appointmentDate) => {
    const today = new Date().toDateString();
    const appointmentDay = new Date(appointmentDate).toDateString();
    if (today !== appointmentDay) {
      Alert.alert('Not Allowed', 'You can only message your coach on the appointment date.');
      return;
    }
    navigation.navigate('Messages', { trainer, bookingDate: appointmentDate });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            Coaches provide guidance only through chat. No physical training sessions. They will
            suggest exercises, diet, and habits tailored to your weight and goals.
          </Text>
        </View>

        {bookedTrainers.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Booked Coaches</Text>
            {bookedTrainers.map(({ trainer, appointmentDate }) => (
              <View key={trainer._id} style={styles.card}>
                <Image
                  source={{
                    uri: trainer.imageUrl?.startsWith('http')
                      ? trainer.imageUrl
                      : `${BASE_URL}/${trainer.imageUrl}`,
                  }}
                  style={styles.trainerImage}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{trainer.username || trainer.fullName}</Text>
                  <Text style={styles.bio}>Appointment: {new Date(appointmentDate).toDateString()}</Text>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleMessage(trainer, appointmentDate)}
                >
                  <Text style={styles.bookButtonText}>Message</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Hire a Coach</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#00BFFF" style={{ marginTop: 40 }} />
        ) : trainers.length === 0 ? (
          <Text style={styles.noTrainersText}>No trainers found.</Text>
        ) : (
          trainers.map((trainer) => (
            <View key={trainer._id} style={styles.card}>
              <Image
                source={{
                  uri: trainer.imageUrl?.startsWith('http')
                    ? trainer.imageUrl
                    : `${BASE_URL}/${trainer.imageUrl}`,
                }}
                style={styles.trainerImage}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{trainer.username || trainer.fullName}</Text>
                {trainer.bio ? <Text style={styles.bio}>{trainer.bio}</Text> : null}
                {trainer.specialties?.length > 0 && (
                  <Text style={styles.specialties}>
                    Specialties: {Array.isArray(trainer.specialties) ? trainer.specialties.join(', ') : trainer.specialties}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBooking(trainer)}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateConfirm}
          minimumDate={new Date()}
        />
      )}
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  noteContainer: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 5,
    borderLeftColor: '#FFB300',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
  noteTitle: { fontWeight: 'bold', fontSize: 16, color: '#FF6F00', marginBottom: 6 },
  noteText: { fontSize: 14, color: '#5D4037' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginVertical: 16 },
  noTrainersText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  trainerImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  infoContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', color: '#222' },
  bio: { fontSize: 14, color: '#555', marginTop: 4 },
  specialties: { fontSize: 13, color: '#777', marginTop: 4, fontStyle: 'italic' },
  bookButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default HireCoachScreen;
