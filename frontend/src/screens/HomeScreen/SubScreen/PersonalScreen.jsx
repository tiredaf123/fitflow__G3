import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config/config';

const PersonalScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [originalData, setOriginalData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const changesExist =
      userData.fullName.trim() !== originalData.fullName.trim() ||
      (userData.phone.trim() || '') !== (originalData.phone.trim() || '');
    setHasChanges(changesExist);
  }, [userData, originalData]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Authentication required. Please login again.');

      const response = await fetch(`${BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const data = await response.json();

      const userInfo = {
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
      };

      setUserData(userInfo);
      setOriginalData(userInfo);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to fetch user data. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!userData.fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty');
      return false;
    }

    if (userData.phone && !/^[\d\s+\-()]*$/.test(userData.phone.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
  if (!validateForm()) return;
  if (!hasChanges) {
    Alert.alert('No Changes', "You haven't made any changes to save.");
    return;
  }

  Keyboard.dismiss();

  try {
    setUpdating(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Authentication required. Please login again.');

    const body = {
      fullName: userData.fullName.trim(),
      phone: userData.phone.trim() || '',
    };

    const response = await fetch(`${BASE_URL}/auth/update-profile`, {
      method: 'PATCH', // ✅ Changed from PUT to PATCH
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      } else {
        const errorText = await response.text(); // likely HTML
        console.error('Non-JSON error:', errorText);
        throw new Error('Unexpected server response. Please try again later.');
      }
    }

    const updatedData = await response.json();

    const newUserData = {
      fullName: updatedData.fullName || userData.fullName,
      email: userData.email,
      phone: updatedData.phone !== undefined ? updatedData.phone : userData.phone,
    };

    setUserData(newUserData);
    setOriginalData(newUserData);

    Alert.alert('Success', 'Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
  } finally {
    setUpdating(false);
  }
};


  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={userData.fullName}
            onChangeText={text => handleChange('fullName', text)}
            placeholder="Enter your full name"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userData.email}
            editable={false}
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          <Text style={styles.noteText}>Email cannot be changed</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={text => handleChange('phone', text)}
            placeholder="Enter your phone number"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <Text style={styles.noteText}>Optional</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!hasChanges || updating) && styles.saveButtonDisabled,
          ]}
          onPress={handleUpdate}
          disabled={!hasChanges || updating}
          activeOpacity={0.8}
        >
          {updating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    heading: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#111',
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
      color: isDarkMode ? '#ddd' : '#333',
    },
    input: {
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      paddingHorizontal: 15,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? '#222' : '#fff',
    },
    disabledInput: {
      backgroundColor: isDarkMode ? '#333' : '#eee',
      color: isDarkMode ? '#888' : '#999',
    },
    noteText: {
      marginTop: 4,
      fontSize: 13,
      color: isDarkMode ? '#aaa' : '#666',
      fontStyle: 'italic',
    },
    saveButton: {
      backgroundColor: '#FF6B00',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF6B00',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 5,
    },
    saveButtonDisabled: {
      backgroundColor: '#FF6B0055',
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default PersonalScreen;
