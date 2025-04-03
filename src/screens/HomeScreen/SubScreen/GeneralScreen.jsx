import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

const GeneralScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [autoUpdates, setAutoUpdates] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>General Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Auto Updates</Text>
          <Switch
            value={autoUpdates}
            onValueChange={setAutoUpdates}
            thumbColor={isDarkMode ? '#FF6B00' : '#00BFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Data Saver Mode</Text>
          <Switch
            value={dataSaver}
            onValueChange={setDataSaver}
            thumbColor={isDarkMode ? '#FF6B00' : '#00BFFF'}
          />
        </View>

        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset to Default</Text>
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
    resetButton: {
      backgroundColor: '#FF6B00',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 30,
    },
    resetButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default GeneralScreen;
