import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const Trainer_LoginPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: 2500,
      position: 'top',
    });
  };

  const handleTrainerLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showToast('error', 'Missing Fields', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/trainers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast('error', 'Login Failed', data?.message || 'Invalid credentials');
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      showToast('success', 'Welcome Back!', `Logged in as ${data.trainer?.username || 'Trainer'}`);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'TrainerDashboard' }],
      });
    } catch (err) {
      console.error('Login error:', err);
      showToast('error', 'Network Error', 'Unable to reach the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/ExerciseImages/8.png')}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <View style={styles.logoContainer}>
            <Icon name="fitness-center" size={width * 0.15} color="#4CAF50" />
            <Text style={styles.title}>TRAINER PORTAL</Text>
            <Text style={styles.subtitle}>Professional Fitness Management</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="person" size={24} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                selectionColor="#4CAF50"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="lock" size={24} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={secureTextEntry}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                returnKeyType="go"
                onSubmitEditing={handleTrainerLogin}
                selectionColor="#4CAF50"
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <Icon 
                  name={secureTextEntry ? 'visibility-off' : 'visibility'} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleTrainerLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>SIGN IN</Text>
                  <Icon name="arrow-forward" size={24} color="#fff" style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>

            
          </View>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Login_Page')}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Back to Main</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.06,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.018,
    fontSize: width * 0.04,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02,
    borderRadius: 25,
    marginTop: height * 0.02,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#81C784',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  forgotPassword: {
    marginTop: 15,
    alignSelf: 'flex-end',
    padding: 5,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: width * 0.035,
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.04,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    marginLeft: 5,
  },
});

export default Trainer_LoginPage;