import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await fetch(`${BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setEmail(data?.email || '');
          setUsername(data?.username || '');
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/manual-users/logout`, { method: 'POST' });
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'Login_Page' }] });
    } catch (err) {
      console.error('Logout failed', err);
      Alert.alert('Error', 'Logout failed. Please try again.');
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
          <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.name, themeStyles.text]}>{username}</Text>
          <Text style={[styles.email, themeStyles.text]}>{email}</Text>
        </View>

        {/* Basic Settings */}
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
        </View>

        {/* Additional Options */}
        <View style={themeStyles.settingsSection}>
          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('HireCoach')}>
            <Icon name="fitness-center" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Hire a Coach</Text>
          </TouchableOpacity>

          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('About')}>
            <Icon name="info" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={themeStyles.settingItem} onPress={() => navigation.navigate('Terms')}>
            <Icon name="gavel" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={themeStyles.settingItem} onPress={handleLogout}>
            <Icon name="logout" size={24} color={themeStyles.text.color} />
            <Text style={[styles.settingText, themeStyles.text]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle Section */}
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
    marginBottom: 20,
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default ProfileScreen;