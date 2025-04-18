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

const Login_Page = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showToast('error', 'Missing Info', 'Please enter both username and password');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem('token', data.token);
        showToast('success', 'Login Successful', 'Welcome back!');
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
      } else {
        showToast('error', 'Login Failed', data.message || 'Incorrect credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('error', 'Network Error', 'Could not connect to the server.');
    }
  };

  return (
    <ImageBackground source={require('../assets/ExerciseImages/9.png')} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']} style={styles.container}>
        <Text style={styles.title}>Access Your{"\n"}Fitness World</Text>

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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or sign in with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/Images/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/Images/apple.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/Images/twitter.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp_Page')}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
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
    backgroundColor: '#FFD700',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    marginTop: height * 0.02,
  },
  loginButtonText: {
    color: '#000',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orText: {
    marginTop: height * 0.03,
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#FFF',
  },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: height * 0.02 },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: width * 0.02,
  },
  socialIcon: { width: width * 0.12, height: width * 0.12, borderRadius: 100 },
  signupText: { marginTop: height * 0.03, fontSize: width * 0.045, color: '#FFF' },
  signupButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    marginTop: height * 0.015,
  },
  signupButtonText: { fontSize: width * 0.05, fontWeight: 'bold', color: '#000' },
});

export default Login_Page;
