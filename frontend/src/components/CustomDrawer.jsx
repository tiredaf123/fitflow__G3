import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../navigation/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';

const CustomDrawer = (props) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#1a1a1a' : '#fff';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${BASE_URL}/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setFullName(data?.fullName || data?.username || '');
          setEmail(data?.email || '');
          setPhotoURL(data?.photoURL || '');
        }
      } catch (err) {
        console.error('Failed to load drawer user data:', err);
      }
    };

    fetchUser();
  }, []);

  const MenuItem = ({ iconName, label, screen, IconComponent = Ionicons }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => props.navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <IconComponent name={iconName} size={20} color={textColor} />
      <Text style={[styles.menuText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor,
        paddingHorizontal: 15,
        paddingTop: 20,
      }}
    >
      {/* Profile Section */}
      <View style={styles.profile}>
        <Image
          source={
            photoURL
              ? { uri: photoURL }
              : require('../assets/Images/profile.png')
          }
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: textColor }]}>
          {fullName || 'User'}
        </Text>
        <Text style={[styles.email, { color: textColor }]}>
          {email || 'Loading...'}
        </Text>
      </View>

      {/* Section: Fitness and Activities */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Fitness and Activities
      </Text>
      <MenuItem
        iconName="bullseye"
        label="Challenge"
        screen="Challenge"
        IconComponent={MaterialCommunityIcons}
      />
      
      {/* Section: Health and Nutrition */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Health and Nutrition
      </Text>
      <MenuItem
        iconName="food-apple"
        label="Nutrition"
        screen="Nutrition"
        IconComponent={MaterialCommunityIcons}
      />
      <MenuItem
        iconName="food"
        label="Food Recipe"
        screen="HealthyFoodSuggestionScreen"
        IconComponent={MaterialCommunityIcons}
      />


      {/* Log Out */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Login_Page')}
          style={styles.menuItem}
        >
          <Ionicons name="log-out-outline" size={20} color={textColor} />
          <Text style={[styles.menuText, { color: textColor }]}>Log out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 14,
    fontSize: 14,
  },
  logoutSection: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
});

export default CustomDrawer;
