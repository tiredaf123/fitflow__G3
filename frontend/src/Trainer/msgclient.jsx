import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Install if not already

const MessageClient = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [message, setMessage] = useState('');

  const clients = ['John Doe', 'Jane Smith', 'Alice Brown']; // You can fetch from DB/API

  const handleSend = () => {
    if (!selectedClient) {
      Alert.alert('No Client Selected', 'Please choose a client to message.');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please type your message.');
      return;
    }

    // Simulate sending
    Alert.alert('Message Sent', `Sent to ${selectedClient}`);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>📨 Message a Client</Text>

      <Text style={styles.label}>Select Client</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedClient}
          onValueChange={(itemValue) => setSelectedClient(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select --" value="" />
          {clients.map((client, index) => (
            <Picker.Item key={index} label={client} value={client} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Your Message</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message here..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>Send Message</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#444',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 120,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MessageClient;
