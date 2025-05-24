import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const Login_Page = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  // Check for existing lock status on component mount
  useEffect(() => {
    const checkLockStatus = async () => {
      const storedLock = await AsyncStorage.getItem('login_lock');
      if (storedLock) {
        const { timestamp, attempts } = JSON.parse(storedLock);
        const currentTime = Date.now();
        const elapsedTime = (currentTime - timestamp) / 1000; // in seconds
        
        if (elapsedTime < 60) { // 1 minute lock
          setIsLocked(true);
          setFailedAttempts(attempts);
          setLockTime(timestamp);
          setRemainingTime(Math.ceil(60 - elapsedTime));
        } else {
          await AsyncStorage.removeItem('login_lock');
        }
      }
    };
    checkLockStatus();
  }, []);

  // Timer for lock countdown
  useEffect(() => {
    let interval;
    if (isLocked && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, remainingTime]);

  const updateLoginStreak = async () => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = await AsyncStorage.getItem('last_login_date');
    const storedStreak = parseInt(await AsyncStorage.getItem('login_streak')) || 0;

    if (storedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterDateStr = yesterday.toISOString().split('T')[0];

      const newStreak = storedDate === yesterDateStr ? storedStreak + 1 : 1;

      await AsyncStorage.setItem('login_streak', newStreak.toString());
      await AsyncStorage.setItem('last_login_date', today);
    }
  };

  const handleLogin = async () => {
    if (isLocked) {
      showToast('error', 'Account Locked', `Please wait ${remainingTime} seconds before trying again`);
      return;
    }

    if (!username || !password) {
      showToast('error', 'Missing Info', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        await AsyncStorage.removeItem('login_lock');
        
        await AsyncStorage.setItem('token', data.token);

        if (data.clientId) {
          await AsyncStorage.setItem('clientId', data.clientId);
        } else if (data.user && data.user._id) {
          await AsyncStorage.setItem('clientId', data.user._id);
        }

        await AsyncStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
        await updateLoginStreak();

        showToast('success', 'Login Successful', 'Welcome back!');

        if (data.isAdmin) {
          navigation.reset({ index: 0, routes: [{ name: 'AdminPanel' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
        }
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 5) {
          // Lock the account for 1 minute
          const lockTimestamp = Date.now();
          setIsLocked(true);
          setLockTime(lockTimestamp);
          setRemainingTime(60);
          await AsyncStorage.setItem('login_lock', JSON.stringify({
            timestamp: lockTimestamp,
            attempts: newAttempts
          }));
          
          showToast('error', 'Account Locked', 'Too many failed attempts. Please wait 1 minute.');
        } else {
          showToast('error', 'Login Failed', data.message || 'Incorrect credentials');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('error', 'Network Error', 'Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/ExerciseImages/9.png')} 
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient 
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']} 
        style={styles.overlay}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              {isLocked && (
                <View style={styles.lockMessage}>
                  <Text style={styles.lockText}>
                    Account locked. Please try again in {remainingTime} seconds.
                  </Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Icon name="person" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#888"
                    onChangeText={setUsername}
                    value={username}
                    autoCapitalize="none"
                    editable={!isLocked}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                    editable={!isLocked}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                  >
                    <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, isLocked && styles.disabledButton]} 
                onPress={handleLogin}
                disabled={isLocked || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginButtonText}>
                    {isLocked ? 'Account Locked' : 'Login'}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp_Page')}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Trainer_LoginPage')}>
                <Text style={styles.trainerText}>Trainer Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, paddingHorizontal: 24 },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  content: { alignItems: 'center', paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
    paddingLeft: 8,
  },
  inputIcon: { marginRight: 8 },
  eyeIcon: { padding: 8 },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFA500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lockMessage: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  lockText: {
    color: '#FFF',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  footer: { flexDirection: 'row', marginBottom: 16 },
  footerText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  footerLink: { color: '#FFA500', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  trainerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Login_Page;