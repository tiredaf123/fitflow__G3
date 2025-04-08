import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

const TermsAndConditionsScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Terms & Conditions</Text>

        <Text style={styles.text}>
          By using FitFlow, you agree to our terms of service outlined below. Please read carefully.
        </Text>

        <Text style={styles.sectionTitle}>1. Usage</Text>
        <Text style={styles.text}>
          This app is intended for personal fitness and wellness use only. Do not use it as a substitute for professional medical advice.
        </Text>

        <Text style={styles.sectionTitle}>2. Privacy</Text>
        <Text style={styles.text}>
          We respect your privacy. All personal information is stored securely and never shared with third parties without consent.
        </Text>

        <Text style={styles.sectionTitle}>3. Payments</Text>
        <Text style={styles.text}>
          Payments for coaching or premium features are handled through third-party gateways. FitFlow is not responsible for issues arising from payment providers.
        </Text>

        <Text style={styles.sectionTitle}>4. Liability</Text>
        <Text style={styles.text}>
          FitFlow is not liable for any injuries, losses, or damages resulting from the use of this app. Use it responsibly and consult a professional when needed.
        </Text>

        <Text style={styles.sectionTitle}>5. Updates</Text>
        <Text style={styles.text}>
          Terms may be updated occasionally. Continued use of the app implies acceptance of any changes.
        </Text>

        <Text style={styles.text}>&copy; 2025 FitFlow. All rights reserved.</Text>
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFCC00' : '#FF6B00',
      marginTop: 20,
      marginBottom: 5,
    },
    text: {
      fontSize: 16,
      color: isDarkMode ? '#DDD' : '#333',
      lineHeight: 22,
      marginBottom: 25,
    },
  });

export default TermsAndConditionsScreen;
