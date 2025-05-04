import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

const HireCoachScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(isDarkMode);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
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
  };

  return (
    <View style={styles.container}>
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
          </Text>

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
        )}

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>

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
      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

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

export default HireCoachScreen;
