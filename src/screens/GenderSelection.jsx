import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const GenderSelection = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const scaleAnim = new Animated.Value(1);

  const handlePress = (gender) => {
    setSelectedGender(gender);

    // Animate selection with a slight bounce
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient colors={['#1e1e1e', '#1e1e1e']} style={styles.container}>
      
      <Text style={styles.heading}>Select Your Gender</Text>

      {/* Gender Selection Buttons */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderBox,
            selectedGender === 'Male' && styles.selectedGender
          ]}
          onPress={() => handlePress('Male')}
        >
          <Image 
            source={require('../assets/Images/Male_icon.png')} 
            style={[styles.genderImage, selectedGender === 'Male' && styles.selectedImage]}
          />
          <Text style={[styles.genderText, selectedGender === 'Male' && styles.selectedText]}>Male</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={[
            styles.genderBox,
            selectedGender === 'Female' && styles.selectedGender
          ]}
          onPress={() => handlePress('Female')}
        >
          <Image 
            source={require('../assets/Images/female_icon.png')} 
            style={[styles.genderImage, selectedGender === 'Female' && styles.selectedImage]}
          />
          <Text style={[styles.genderText, selectedGender === 'Female' && styles.selectedText]}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Info Text */}
      <Text style={styles.infoText}>Your gender is important for calorie calculation.</Text>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, selectedGender ? styles.activeButton : styles.disabledButton]}
        disabled={!selectedGender}
        onPress={() => navigation.navigate('AgeSelection')}
      >
        <LinearGradient colors={['#FFD700', '#FF9800']} style={styles.buttonGradient}>
          <Text style={styles.nextButtonText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  heading: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.04,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  genderBox: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: width * 0.03,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  selectedGender: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    shadowOpacity: 1,
  },
  genderImage: {
    width: width * 0.15, // Proper scaling
    height: width * 0.15,
    resizeMode: 'contain',
  },
  selectedImage: {
    transform: [{ scale: 1.1 }], // Slight zoom effect
  },
  genderText: {
    fontSize: width * 0.045,
    color: '#fff',
    marginTop: 5,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#FFD700',
    marginHorizontal: width * 0.03,
  },
  infoText: {
    fontSize: width * 0.042,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  nextButton: {
    width: width * 0.5,
    height: height * 0.065,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
  },
  activeButton: {
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.4,
  },
});

export default GenderSelection;
