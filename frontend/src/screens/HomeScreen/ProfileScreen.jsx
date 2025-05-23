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
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';

const { width } = Dimensions.get('window');

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
  const [loadingProfile, setLoadingProfile] = useState(true);

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
          setPhotoURL(data?.photoURL ? `${data.photoURL}?${new Date().getTime()}` : null);
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
      } finally {
        setLoadingProfile(false);
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
    } catch (err) {
      console.error('Camera error:', err);
      Toast.show({
        type: 'error',
        text1: 'Camera Error',
        text2: 'Could not open camera. Please check permissions.',
      });
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
    } catch (err) {
      console.error('Gallery error:', err);
      Toast.show({
        type: 'error',
        text1: 'Gallery Error',
        text2: 'Could not access photos. Please check permissions.',
      });
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
      if (!token) {
        console.error('No token found in AsyncStorage');
        return;
      }

      const uri = Platform.OS === 'android' ? image.path : image.path.replace('file://', '');

      const formData = new FormData();
      formData.append('photo', {
        uri,
        name: image.filename || `profile_${Date.now()}.jpg`,
        type: image.mime || 'image/jpeg',
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

      if (!res.ok || !data.photoURL) {
        throw new Error(data.message || 'Upload failed');
      }

      setPhotoURL(`${data.photoURL}?${Date.now()}`);
      Toast.show({
        type: 'success',
        text1: 'Profile photo updated',
        text2: 'Your profile picture has been successfully updated.',
      });
    } catch (err) {
      console.error('Upload error:', err);
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: err.message || 'Please try again',
      });
    } finally {
      setUploading(false);
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
      backgroundColor: isDarkMode ? '#121212' : '#F9F9F9',
    },
    text: {
      color: isDarkMode ? '#E0E0E0' : '#222',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
    },
    settingsSection: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 16,
      marginHorizontal: 20,
      marginVertical: 10,
      shadowColor: isDarkMode ? '#000' : '#AAA',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
  };

  return (
    <View style={themeStyles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileHeader, { backgroundColor: isDarkMode ? '#222' : '#FFF' }]}>
          <View style={styles.imageWrapper}>
            <Image
              source={photoURL ? { uri: photoURL } : require('../../assets/Images/profile.png')}
              style={styles.profileImage}
              onError={(e) => console.log('Failed to load image:', e.nativeEvent.error)}
            />
            <TouchableOpacity style={styles.editButton} onPress={chooseImage} activeOpacity={0.7}>
              <Icon name="edit" size={20} color="#FFF" />
            </TouchableOpacity>
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#FF6B00" />
              </View>
            )}
          </View>
          {loadingProfile ? (
            <ActivityIndicator size="large" color={isDarkMode ? '#FF6B00' : '#FF6B00'} style={{ marginTop: 20 }} />
          ) : (
            <>
              <Text style={[styles.name, themeStyles.text]}>{fullName || username || 'No Name'}</Text>
              <Text style={[styles.email, themeStyles.text]}>{email || 'No Email'}</Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, themeStyles.text]}>Height:</Text>
                <Text style={[styles.infoValue, themeStyles.text]}>{height ? `${height} cm` : '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, themeStyles.text]}>Weight:</Text>
                <Text style={[styles.infoValue, themeStyles.text]}>{weight ? `${weight} kg` : '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, themeStyles.text]}>Goal:</Text>
                <Text style={[styles.infoValue, themeStyles.text]}>{goal || '-'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Settings Sections */}
        <View style={themeStyles.settingsSection}>
          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('Personal')}
            activeOpacity={0.7}
          >
            <Icon name="person" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Personal</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('General')}
            activeOpacity={0.7}
          >
            <Icon name="tune" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>General</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('Notification')}
            activeOpacity={0.7}
          >
            <Icon name="notifications" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Notification</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('StreakScreen')}
            activeOpacity={0.7}
          >
            <Icon name="local-fire-department" size={24} color="#FF6B00" />
            <Text style={[styles.settingText, themeStyles.text]}>StreakScreen</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('Help')}
            activeOpacity={0.7}
          >
            <Icon name="help" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Help</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('HireCoach')}
            activeOpacity={0.7}
          >
            <Icon name="fitness-center" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Hire a Coach</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('Supplements')}
            activeOpacity={0.7}
          >
            <Icon name="local-pharmacy" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Supplements</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={themeStyles.settingItem}
            onPress={() => navigation.navigate('Member')}
            activeOpacity={0.7}
          >
            <Icon name="fitness-center" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Workout by Trainers</Text>
            <Icon name="chevron-right" size={24} color={themeStyles.text.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[themeStyles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={themeStyles.settingsSection}>
          <View style={[themeStyles.settingItem, { borderBottomWidth: 0 }]}>
            <Icon name="light-mode" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Dark Mode</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                thumbColor={Platform.OS === 'android' ? (isDarkMode ? '#FF6B00' : '#f4f3f4') : undefined}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
              />
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
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#ddd',
  },
  editButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
  settingText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;