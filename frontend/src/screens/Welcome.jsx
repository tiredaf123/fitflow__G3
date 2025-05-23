import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
//Adharsh sapkota
  const handleNextPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login_Page'); // Navigate to Login screen
    }, 2000); // Simulates loading time
  };

  return (
    <View style={styles.container}>
      {/* Blended Logo with Modern Styling */}
      <View style={styles.logoWrapper}>
        <Image source={require('../assets/ExerciseImages/5.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Elevate Your Fitness Journey</Text>
      {/* Next Button & Loader at Bottom, Fixed Positioning */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, loading && styles.buttonLoading]} onPress={handleNextPress} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Start Training</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
  },
  logoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Soft blend effect
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 250,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.9,

  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLoading: {
    backgroundColor: '#999', // Darker shade when loading
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
});

export default Welcome;
