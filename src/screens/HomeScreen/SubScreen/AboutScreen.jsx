import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

const AboutScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>About FitFlow</Text>

        <Text style={styles.text}>
          FitFlow was founded in 2025 with the goal of helping people build sustainable fitness habits and improve their health.
        </Text>

        <Text style={styles.sectionTitle}>Our Team</Text>

        <View style={styles.teamBlock}>
          <Text style={styles.member}><Text style={styles.role}>Project Manager:</Text> Samrat Bam</Text>
          <Text style={styles.member}><Text style={styles.role}>Business Analyst:</Text> Suvam</Text>
          <Text style={styles.member}><Text style={styles.role}>Developers:</Text> Satya, Shrabya, Adharsh, Sohan</Text>
        </View>

        <Text style={[styles.text, { marginTop: 20 }]}>
          We believe in empowering users with personalised plans, smooth experiences, and a touch of community support.
        </Text>
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
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 15,
    },
    text: {
      fontSize: 16,
      color: isDarkMode ? '#DDD' : '#333',
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginTop: 25,
      marginBottom: 10,
    },
    teamBlock: {
      paddingLeft: 10,
    },
    member: {
      fontSize: 16,
      marginBottom: 8,
      color: isDarkMode ? '#FFF' : '#000',
    },
    role: {
      fontWeight: 'bold',
      color: isDarkMode ? '#FFCC00' : '#FF6B00',
    },
  });

export default AboutScreen;
