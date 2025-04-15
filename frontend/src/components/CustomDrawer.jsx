import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../navigation/ThemeProvider';

const CustomDrawer = (props) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#1a1a1a' : '#fff';

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
    <DrawerContentScrollView contentContainerStyle={{ flex: 1, backgroundColor, paddingHorizontal: 15, paddingTop: 20 }}>
      {/* Profile Section */}
      <View style={styles.profile}>
        <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.avatar} />
        <Text style={[styles.name, { color: textColor }]}>Michael Smith</Text>
        <Text style={[styles.email, { color: textColor }]}>michaelsmith@gmail.com</Text>
      </View>

      {/* Section: Fitness and Activities */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Fitness and Activities</Text>
      <MenuItem iconName="bullseye" label="Challenge" screen="Challenge" IconComponent={MaterialCommunityIcons} />
      <MenuItem iconName="chart-line" label="Progress" screen="Progress" IconComponent={MaterialCommunityIcons} />
      <MenuItem iconName="account-group" label="Classes" screen="Classes" IconComponent={MaterialCommunityIcons} />

      {/* Section: Health and Nutrition */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Health and Nutrition</Text>
      <MenuItem iconName="food-apple" label="Nutrition" screen="Nutrition" IconComponent={MaterialCommunityIcons} />

      {/* Log Out */}
      <View style={styles.logoutSection}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login_Page')} style={styles.menuItem}>
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
