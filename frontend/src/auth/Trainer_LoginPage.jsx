import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/config';

const { width, height } = Dimensions.get('window');

const Trainer_LoginPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  const handleTrainerLogin = async () => {
    if (!username || !password) {
      showToast('error', 'Missing Info', 'Please enter both username and password');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/trainers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem('trainerToken', data.token);
        await AsyncStorage.setItem('trainerId', data.trainer._id);
        showToast('success', 'Login Successful', 'Welcome, Trainer!');
        navigation.reset({ index: 0, routes: [{ name: 'TrainerDashboard' }] });
      } else {
        showToast('error', 'Login Failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Trainer login error:', err);
      showToast('error', 'Network Error', 'Could not connect to the server.');
    }
  };

  return (
    <ImageBackground source={require('../assets/ExerciseImages/8.png')} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']} style={styles.container}>
        <Text style={styles.title}>Trainer Login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#444"
            onChangeText={setUsername}
            value={username}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#444"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleTrainerLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Main Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: width * 0.08 },
  title: {
    fontSize: width * 0.075,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: height * 0.04,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: { width: '100%', alignItems: 'center' },
  input: {
    width: '90%',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    marginBottom: height * 0.02,
    fontSize: width * 0.045,
    color: '#000',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loginButton: {
    backgroundColor: '#0055ff',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    marginTop: height * 0.02,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    textDecorationLine: 'underline'
  }
});

export default Trainer_LoginPage;
