import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';
//Adharsh Sapkota added bootpm tab bar
const NotificationScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Notification Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            thumbColor={isDarkMode ? '#FF6B00' : '#00BFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email Notifications</Text>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            thumbColor={isDarkMode ? '#FF6B00' : '#00BFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Workout Reminders</Text>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            thumbColor={isDarkMode ? '#FF6B00' : '#00BFFF'}
          />
        </View>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5F5F5',
    },
    scrollContent: {
      padding: 20,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 20,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? '#444' : '#DDD',
    },
    settingLabel: {
      fontSize: 16,
      color: isDarkMode ? '#FFF' : '#000',
    },
  });

export default NotificationScreen;
