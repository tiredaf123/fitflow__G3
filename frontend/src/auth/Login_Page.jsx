import React, { useState } from 'react';
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
        await AsyncStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');

        showToast('success', 'Login Successful', 'Welcome back!');

        if (data.isAdmin) {
          navigation.reset({ index: 0, routes: [{ name: 'AdminPanel' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
        }
      } else {
        showToast('error', 'Login Failed', data.message || 'Incorrect credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('error', 'Network Error', 'Could not connect to the server.');
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

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
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon 
                      name={showPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#888" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('SignUp_Page')}
                >
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.trainerButton}
                onPress={() => navigation.navigate('Trainer_LoginPage')}
              >
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
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
  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    padding: 8,
  },
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
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  dividerText: {
    color: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  footerLink: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  trainerButton: {
    paddingVertical: 12,
  },
  trainerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Login_Page;