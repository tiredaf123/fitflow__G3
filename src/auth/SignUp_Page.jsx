import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SignUp_Page = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../assets/ExerciseImages/9.png')} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']} style={styles.container}>
        <Text style={styles.title}>Create Your{"\n"}Fitness Account</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#444" />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#444" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#444" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#444" secureTextEntry />
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#444" secureTextEntry />
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('IntroPage1')}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or sign up with</Text>
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

        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.goBack()}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: height * 0.03,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
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
  signupButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    marginTop: height * 0.02,
  },
  signupButtonText: {
    color: '#000',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  orText: {
    marginTop: height * 0.03,
    fontSize: width * 0.04,
    color: '#FFF',
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: height * 0.02,
  },
  socialButton: {
    padding: 10,
    borderRadius: 50,
    marginHorizontal: width * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  socialIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 100,
  },
  loginText: {
    marginTop: height * 0.03,
    fontSize: width * 0.045,
    color: '#FFF',
  },
  loginButton: {
    backgroundColor: '#333',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    marginTop: height * 0.015,
  },
  loginButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default SignUp_Page;
