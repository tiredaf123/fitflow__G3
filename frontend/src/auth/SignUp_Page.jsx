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

const SignUp_Page = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  const handleSignup = async () => {
    if (!username || !password || !email || !confirm || !fullName) {
      return showToast('error', 'Missing Info', 'Please fill all fields.');
    }
    if (password !== confirm) {
      return showToast('error', 'Password Mismatch', 'Passwords do not match.');
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, fullName }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userName', fullName);
        await AsyncStorage.setItem('userEmail', email);
        showToast('success', 'Account Created', 'You have successfully signed up!');
        navigation.reset({ index: 0, routes: [{ name: 'IntroPage1' }] });
      } else {
        showToast('error', 'Signup Failed', data.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showToast('error', 'Server Error', 'Could not connect to server.');
    }
  };
console.log('Trainer token stored:', data.token);

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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>

              <View style={styles.inputContainer}>
                {/* Full Name */}
                <View style={styles.inputWrapper}>
                  <Icon name="person" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#888"
                    onChangeText={setFullName}
                    value={fullName}
                  />
                </View>
                {/* Email */}
                <View style={styles.inputWrapper}>
                  <Icon name="email" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                  />
                </View>
                {/* Username */}
                <View style={styles.inputWrapper}>
                  <Icon name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#888"
                    onChangeText={setUsername}
                    value={username}
                    autoCapitalize="none"
                  />
                </View>
                {/* Password */}
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
                {/* Confirm Password */}
                <View style={styles.inputWrapper}>
                  <Icon name="lock-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showConfirm}
                    onChangeText={setConfirm}
                    value={confirm}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirm(!showConfirm)}
                  >
                    <Icon
                      name={showConfirm ? "visibility-off" : "visibility"}
                      size={20}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleSignup} activeOpacity={0.8}>
                <Text style={styles.loginButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.footerLink}>Login</Text>
                </TouchableOpacity>
              </View>
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
});

export default SignUp_Page;
