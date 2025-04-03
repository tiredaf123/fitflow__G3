import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

const HelpScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [sender, setSender] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!sender || !senderEmail || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const subject = `Help Request from ${sender} (${senderEmail})`;
    const body = encodeURIComponent(message);
    const mailtoURL = `mailto:koiralam613@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    Linking.openURL(mailtoURL).catch(() =>
      Alert.alert('Error', 'Unable to open email client')
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Contact Support</Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#888"
          value={sender}
          onChangeText={setSender}
        />

        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#888"
          value={senderEmail}
          onChangeText={setSenderEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your Message"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send Message</Text>
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
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 20,
    },
    input: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF',
      color: isDarkMode ? '#FFF' : '#000',
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#DDD',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    sendButton: {
      backgroundColor: '#FF6B00',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    sendButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default HelpScreen;
