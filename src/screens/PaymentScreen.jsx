import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    // For now, just simulate success
    Alert.alert('Payment Successful', 'Your subscription has been activated.', [
      { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Card Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Cardholder Name"
        placeholderTextColor="#aaa"
        value={cardName}
        onChangeText={setCardName}
      />
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="MM/YY"
          placeholderTextColor="#aaa"
          value={expiry}
          onChangeText={setExpiry}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="CVV"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fec400',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  payButton: {
    backgroundColor: '#fec400',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  payText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
