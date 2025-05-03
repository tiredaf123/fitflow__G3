/**
 * HireCoachScreen.jsx
 * Allows users to hire a coach, select appointment time, make payments, and message the trainer.
 * Structured with extended LOC for maintainability and clarity.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

/**
 * Main functional component for coach hiring interface.
 */
const HireCoachScreen = () => {
  const { isDarkMode } = useTheme(); // dark mode theme toggle
  const navigation = useNavigation(); // navigation hook
  const styles = getStyles(isDarkMode); // dynamic styles

  // ---- State Definitions ---- //
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: 'Hi! Ready to level up your fitness?' }
  ]);
  const [hasPaid, setHasPaid] = useState(false);

  // ---- Appointment Handlers ---- //
  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
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
        Alert.alert('Success', 'Payment completed!');
      })
      .catch(() => Alert.alert('Error', 'Unable to open payment link'));
  };

  const handleSendMessage = () => {
    if (!hasPaid) {
      Alert.alert('Payment Required', 'Please pay before sending messages.');
      return;
    }
    if (!message) {
      Alert.alert('Empty Message', 'Please write a message before sending.');
      return;
    }
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    setMessage('');
  };

  const handleCoachPress = () => {
    Alert.alert(
      'Membership Required',
      'Buy a membership to access full features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Membership', onPress: handlePayment }
      ]
    );
  };

  // ---- UI Rendering ---- //
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Hire a Coach</Text>

        {/* Coach Card */}
        <TouchableOpacity onPress={handleCoachPress} style={styles.card}>
          <Text style={styles.label}>Coach Name:</Text>
          <Text style={styles.info}>Alex Johnson</Text>

          <Text style={styles.label}>About:</Text>
          <Text style={styles.info}>
            Certified personal trainer with 8 years of experience. Specializes in strength,
            mobility, and habit building. Trained 200+ clients.
          </Text>

          <Text style={styles.label}>Rate:</Text>
          <Text style={styles.info}>£35/hour</Text>
        </TouchableOpacity>

        {/* Appointment Date Picker */}
        <Text style={styles.label}>Select Appointment Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
            {date.toLocaleString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Booking Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>

        {/* Payment Button */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        {/* Messaging Button */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            if (!hasPaid) {
              Alert.alert('Payment Required', 'Please complete the payment first.');
              return;
            }
            navigation.navigate('Messages');
          }}
        >
          <Text style={styles.sendButtonText}>Go to Messages</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomTabBar />
    </View>
  );
};

/**
 * Returns dynamic styles based on dark mode flag.
 */
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
