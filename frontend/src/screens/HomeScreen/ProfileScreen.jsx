import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setEmail(data?.email || '');
          setUsername(data?.username || '');
          setFullName(data?.fullName || '');
          setPhotoURL(data?.photoURL || null);
          setHeight(data?.profile?.height?.toString() || '');
          setWeight(data?.profile?.weight?.toString() || '');
          setGoal(data?.profile?.goal || '');
        } else {
          throw new Error('Unauthenticated');
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        await AsyncStorage.removeItem('token');
        navigation.reset({ index: 0, routes: [{ name: 'Login_Page' }] });
      }
    };
    fetchUser();
  }, []);

  const chooseImage = () => {
    Alert.alert('Update Profile Photo', 'Choose a method', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.7,
      });
      uploadImage(image);
    } catch {
      console.log('Camera cancelled');
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.7,
      });
      uploadImage(image);
    } catch {
      console.log('Gallery cancelled');
    }
  };

  const uploadImage = async (image) => {
    if (image.size > 5 * 1024 * 1024) {
      return Toast.show({
        type: 'error',
        text1: 'Image too large',
        text2: 'Please choose an image under 5MB.',
      });
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', {
        uri: image.path,
        name: image.filename || `profile_${Date.now()}.jpg`,
        type: image.mime,
      });

      setUploading(true);

      const res = await fetch(`${BASE_URL}/profile/upload-photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        setPhotoURL(data.photoURL);
        Toast.show({ type: 'success', text1: 'Profile photo updated' });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setUploading(false);
      Toast.show({ type: 'error', text1: 'Upload failed', text2: err.message });
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.removeItem('token');
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been logged out successfully.',
      });
      navigation.reset({ index: 0, routes: [{ name: 'Login_Page' }] });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  const themeStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F0F0F0',
    },
    text: {
      color: isDarkMode ? '#FFF' : '#000',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#DDD',
    },
    settingsSection: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF',
      borderRadius: 20,
      margin: 20,
      padding: 10,
    },
  };

  return (
    <View style={themeStyles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.profileHeader}>
          <Image
            source={photoURL ? { uri: photoURL } : require('../../assets/Images/profile.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={chooseImage}>
            <Icon name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
          {uploading && <ActivityIndicator size="small" color="#FF6B00" style={{ marginTop: 8 }} />}
          <Text style={[styles.name, themeStyles.text]}>{fullName || username || 'Loading...'}</Text>
          <Text style={[styles.email, themeStyles.text]}>{email || 'Fetching email...'}</Text>
          <Text style={[themeStyles.text, { marginTop: 5 }]}>Height: {height} cm</Text>
          <Text style={[themeStyles.text]}>Weight: {weight} kg</Text>
          <Text style={[themeStyles.text]}>Goal: {goal}</Text>
        </View>

        <View style={themeStyles.settingsSection}>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('Personal')}>
            <Icon name="person" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('General')}>
            <Icon name="tune" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('Notification')}>
            <Icon name="notifications" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('Help')}>
            <Icon name="help" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('HireCoach')}>
            <Icon name="fitness-center" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Hire a Coach</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('Supplements')}>
            <Icon name="local-pharmacy" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Supplements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleLogout}>
            <Icon name="logout" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={themeStyles.settingsSection}>
          <View style={themeStyles.settingItem}>
            <Icon name="light-mode" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Dark Mode</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Switch value={isDarkMode} onValueChange={toggleTheme} />
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  editButton: {
    position: 'absolute',
    right: 40,
    bottom: 15,
    backgroundColor: '#FF6B00',
    padding: 6,
    borderRadius: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    marginBottom: 10,
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default ProfileScreen;
