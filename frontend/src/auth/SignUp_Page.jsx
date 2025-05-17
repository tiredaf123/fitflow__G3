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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const SignUp_Page = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !username.trim() || !password || !confirm) {
      Toast.show({
        type: 'error',
        text1: 'Missing Info',
        text2: 'Please fill all fields.',
        position: 'top'
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Too Short',
        text2: 'Password must be at least 6 characters.',
        position: 'top'
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match.',
        position: 'top'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Welcome to FitFlow!',
          position: 'top'
        });
        navigation.reset({ index: 0, routes: [{ name: 'IntroPage1' }] });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: data.message || 'Something went wrong.',
          position: 'top'
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Could not connect to the server.',
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/ExerciseImages/9.png')} 
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <LinearGradient 
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Your{"\n"}Fitness Account</Text>
              <Text style={styles.subtitle}>Join our community and start your fitness journey</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="person" size={22} color="#777" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Full Name" 
                  placeholderTextColor="#777" 
                  onChangeText={setFullName}
                  value={fullName}
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <Icon name="email" size={22} color="#777" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email" 
                  placeholderTextColor="#777" 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  onChangeText={setEmail}
                  value={email}
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <Icon name="account-circle" size={22} color="#777" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Username" 
                  placeholderTextColor="#777" 
                  autoCapitalize="none" 
                  onChangeText={setUsername}
                  value={username}
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={22} color="#777" style={styles.inputIcon} />
                <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Password" 
                  placeholderTextColor="#777" 
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Icon 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={22} 
                    color="#777" 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={22} color="#777" style={styles.inputIcon} />
                <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Confirm Password" 
                  placeholderTextColor="#777" 
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirm}
                  value={confirm}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Icon 
                    name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
                    size={22} 
                    color="#777" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.signupButton, isLoading && styles.disabledButton]} 
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.signupButtonText}>SIGN UP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>LOGIN</Text>
                <Icon name="arrow-forward" size={20} color="#FFF" />
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
    height: '100%' 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: width * 0.08 
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.04
  },
  title: { 
    fontSize: width * 0.08, 
    fontWeight: 'bold', 
    color: '#FFF', 
    textAlign: 'center', 
    lineHeight: width * 0.09,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3
  },
  subtitle: {
    fontSize: width * 0.04,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    textAlign: 'center'
  },
  inputContainer: { 
    width: '100%', 
    marginBottom: height * 0.02 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.018,
    fontSize: width * 0.045,
    color: '#333',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: height * 0.018,
    fontSize: width * 0.045,
    color: '#333',
    paddingRight: 40
  },
  eyeIcon: {
    position: 'absolute',
    right: 15
  },
  signupButton: {
    backgroundColor: '#FFD700',
    paddingVertical: height * 0.02,
    borderRadius: 25,
    marginTop: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  disabledButton: {
    opacity: 0.7
  },
  signupButtonText: {
    color: '#000',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: height * 0.03
  },
  loginText: {
    fontSize: width * 0.038,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  loginButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 5
  }
});

export default SignUp_Page;