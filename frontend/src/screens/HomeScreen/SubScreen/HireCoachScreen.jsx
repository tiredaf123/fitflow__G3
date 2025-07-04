import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
<<<<<<< HEAD
  Linking,
=======
  ActivityIndicator,
  Image,
>>>>>>> Sohan
  Platform,
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
<<<<<<< HEAD
  const [hasPaid, setHasPaid] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event?.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleBooking = () => {
    Alert.alert('Booked!', `Appointment set for ${date.toLocaleString()}`);
  };

  const handlePayment = () => {
    Linking.openURL('https://your-payment-link.com')
      .then(() => {
        setHasPaid(true);
        Alert.alert('Payment Success', 'Your payment was received!');
      })
      .catch(() => Alert.alert('Error', 'Failed to open payment link'));
=======
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again.');
        setLoading(false);
        return;
      }
      const [publicRes, bookedRes] = await Promise.all([
        fetch(`${BASE_URL}/trainers/public`),
        fetch(`${BASE_URL}/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const publicData = await publicRes.json();
      const bookedData = await bookedRes.json();

      setTrainers(Array.isArray(publicData) ? publicData : []);
      setBookedTrainers(Array.isArray(bookedData.active) ? bookedData.active : []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load trainers or bookings.');
      setTrainers([]);
      setBookedTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeBookings = bookedTrainers.filter(
    booking => new Date(booking.appointmentDate) >= todayStart
  );

  const bookedTrainerIds = new Set(
    activeBookings.map(booking => booking.trainer._id)
  );

  const availableTrainers = trainers.filter(
    trainer => !bookedTrainerIds.has(trainer._id)
  );

  const handleBooking = (trainer) => {
    setSelectedTrainer(trainer);
    setSelectedDate(new Date());
    setShowPicker(true);
  };

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (event.type === 'dismissed') {
      setSelectedTrainer(null);
      return;
    }
    if (date) {
      setSelectedDate(date);
      confirmBooking(date);
    }
  };

  const confirmBooking = async (appointmentDate) => {
    if (!selectedTrainer) return;

    const appointmentDateStart = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate(),
      0, 0, 0, 0
    );

    const now = new Date();
    let finalAppointmentDate;

    if (appointmentDateStart.getTime() === todayStart.getTime()) {
      const plusOneHour = new Date(now.getTime() + 60 * 60 * 1000);
      finalAppointmentDate = new Date(
        appointmentDateStart.getFullYear(),
        appointmentDateStart.getMonth(),
        appointmentDateStart.getDate(),
        plusOneHour.getHours(),
        plusOneHour.getMinutes(),
        0,
        0
      );
    } else if (appointmentDateStart < todayStart) {
      Alert.alert('Invalid Date', 'Please select today or a future date.');
      return;
    } else {
      finalAppointmentDate = appointmentDateStart;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again.');
        return;
      }

      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainer._id,
          appointmentDate: finalAppointmentDate.toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Booking confirmed.');
        await fetchData();
        setSelectedTrainer(null);
      } else {
        Alert.alert('Error', data.error || 'Booking failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error during booking.');
    }
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No' },
        { text: 'Yes', onPress: () => cancelBooking(bookingId) },
      ]
    );
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again.');
        return;
      }

      const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Booking cancelled successfully.');
        await fetchData();
      } else {
        Alert.alert('Error', data.error || 'Failed to cancel booking.');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error during cancellation.');
    }
  };

  const canMessageTrainer = (appointmentDate) => {
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const appointment = new Date(appointmentDate);
    const appointmentDateOnly = new Date(appointment.getFullYear(), appointment.getMonth(), appointment.getDate());

    const lastAllowedDate = new Date(appointmentDateOnly);
    lastAllowedDate.setDate(lastAllowedDate.getDate() + 2);

    return todayDateOnly >= appointmentDateOnly && todayDateOnly <= lastAllowedDate;
  };

  const handleMessage = (trainer, appointmentDate) => {
    if (!canMessageTrainer(appointmentDate)) {
      Alert.alert('Not Allowed', 'You can only message your coach on the appointment day and the following 2 days.');
      return;
    }
    navigation.navigate('Messages', { trainer, bookingDate: appointmentDate });
>>>>>>> Sohan
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Hire a Coach</Text>

        {/* View Trainers Button */}
        <TouchableOpacity
          style={styles.viewTrainersButton}
          onPress={() => navigation.navigate('TrainerList')}
        >
          <Text style={styles.viewTrainersText}>View Trainers</Text>
        </TouchableOpacity>

        {/* Coach Preview Card */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.label}>Coach Name:</Text>
          <Text style={styles.info}>Alex Johnson</Text>

          <Text style={styles.label}>About:</Text>
          <Text style={styles.info}>
            Certified coach with 8 years of experience. Specialized in habit building and strength training.
=======
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            Coaches provide guidance only through chat. No physical training sessions. They will
            suggest exercises, diet, and habits tailored to your weight and goals.
>>>>>>> Sohan
          </Text>
        </View>

<<<<<<< HEAD
          <Text style={styles.label}>Rate:</Text>
          <Text style={styles.info}>£35/hour</Text>
        </TouchableOpacity>

        {/* Appointment Picker */}
        <Text style={styles.label}>Select Appointment Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
            {date.toLocaleString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
          />
=======
        {activeBookings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Active Coaches</Text>
            {activeBookings.map(({ _id, trainer, appointmentDate }) => (
              <View
                key={`${trainer._id}_${new Date(appointmentDate).getTime()}`}
                style={styles.card}
              >
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
                  <Text style={styles.bio}>Appointment: {new Date(appointmentDate).toLocaleString()}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.bookButton, styles.messageButton]}
                    onPress={() => handleMessage(trainer, appointmentDate)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bookButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.bookButton, styles.cancelButton]}
                    onPress={() => handleCancelBooking(_id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bookButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
>>>>>>> Sohan
        )}

        <Text style={styles.sectionTitle}>Hire a Coach</Text>

<<<<<<< HEAD
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            if (!hasPaid) {
              Alert.alert('Payment Required', 'Please pay to continue.');
              return;
            }
            navigation.navigate('Messages');
          }}
        >
          <Text style={styles.sendButtonText}>Go to Messages</Text>
        </TouchableOpacity>
=======
        {loading ? (
          <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 40 }} />
        ) : availableTrainers.length === 0 ? (
          <Text style={styles.noTrainersText}>No trainers available to hire.</Text>
        ) : (
          availableTrainers.map((trainer) => (
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
                activeOpacity={0.8}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
>>>>>>> Sohan
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={todayStart}
        />
      )}

      <BottomTabBar />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  noteContainer: {
    backgroundColor: '#eef6ff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 25,
    shadowColor: '#007aff',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#007aff',
  },
  noteText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  trainerImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ccc',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  specialties: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bookButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#007aff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  messageButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  noTrainersText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

<<<<<<< HEAD
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5F5F5',
    },
    scrollContent: {
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 20,
    },
    viewTrainersButton: {
      backgroundColor: '#6c5ce7',
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    viewTrainersText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    card: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 10,
      color: isDarkMode ? '#CCC' : '#333',
    },
    info: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    input: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      borderColor: isDarkMode ? '#555' : '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginTop: 10,
    },
    bookButton: {
      backgroundColor: '#00BFFF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    bookButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    payButton: {
      backgroundColor: '#FF6B00',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 15,
    },
    payButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    sendButton: {
      backgroundColor: '#28A745',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 100,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

=======
>>>>>>> Sohan
export default HireCoachScreen;
