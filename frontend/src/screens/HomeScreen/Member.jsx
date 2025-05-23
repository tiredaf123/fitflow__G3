import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView, Alert, Dimensions, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../navigation/ThemeProvider';
import { useStripe } from '@stripe/stripe-react-native';
import { BASE_URL } from '../../config/config';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const Membership = ({ navigation }) => {
  const stripe = useStripe();
  const theme = useTheme();
  const colors = theme?.colors ?? {
    text: '#000',
    secondaryText: '#666',
    cardBackground: '#fff',
    cardBorder: '#ddd',
    primary: '#4CAF50',
    error: 'red',
    background: '#f5f5f5',
    accent: '#FF5722'
  };
  const [loading, setLoading] = useState(false);

  // 🔁 Auto-redirect if already a member
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/membership/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.hasMembership) {
          navigation.replace('AllWorkouts'); // 👈 skip Membership screen
        }
      } catch (error) {
        console.log('Error checking membership:', error);
      }
    };
    checkMembership();
  }, []);

  const handlePurchaseMembership = async () => {
    Alert.alert(
      "Premium Membership",
      "Start your free trial today! After 1 month, your subscription will automatically continue at $3.00/month. Cancel anytime.",
      [
        {
          text: 'Not Now',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed')
        },
        {
          text: 'Start Free Trial',
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem('token');

              const res = await fetch(`${BASE_URL}/membership/create-intent`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planType: 'monthly' }),
              });

              const { clientSecret, subscriptionId } = await res.json();

              await stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'FitFlow Premium',
                style: 'alwaysDark',
                googlePay: true,
                applePay: true,
              });

              const { error } = await stripe.presentPaymentSheet();
              if (error) throw error;

              const confirm = await fetch(`${BASE_URL}/membership/confirm`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId }),
              });

              const confirmData = await confirm.json();
              if (!confirmData.success) throw new Error(confirmData.message);

              Alert.alert(
                'Welcome to Premium!',
                'Your membership is now active. Enjoy unlimited access to all workouts!',
                [{
                  text: 'Start Training',
                  onPress: () => navigation.replace('AllWorkouts'),
                }]
              );
            } catch (error) {
              Alert.alert(
                'Payment Error',
                error.message || 'Something went wrong with your payment. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, '#2E7D32']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.iconContainer}>
          <Icon name="star" size={40} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>Premium Membership</Text>
        <Text style={styles.headerSubtitle}>Unlock all features</Text>
      </LinearGradient>

      <View style={styles.pricingCard}>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>$3.00</Text>
          <Text style={[styles.perMonth, { color: colors.secondaryText }]}>/month</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Premium Benefits</Text>

        {[
          { icon: 'fitness-center', text: 'Access to all premium workouts' },
          { icon: 'update', text: 'New workouts every week' },
          { icon: 'school', text: 'Expert training programs' },
          { icon: 'cancel', text: 'Cancel anytime' },
        ].map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Icon
              name={benefit.icon}
              size={22}
              color={colors.primary}
              style={styles.benefitIcon}
            />
            <Text style={[styles.benefitText, { color: colors.text }]}>
              {benefit.text}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: loading ? '#81C784' : colors.primary,
            shadowColor: colors.primary,
          }
        ]}
        onPress={handlePurchaseMembership}
        disabled={loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Start Free Trial</Text>
            <Text style={styles.buttonSubtext}>Then $3.00/month</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Icon name="lock" size={16} color={colors.secondaryText} />
        <Text style={[styles.footerText, { color: colors.secondaryText }]}>
          Secure payment powered by Stripe
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 30 },
  header: {
    padding: 25,
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    paddingBottom: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 25,
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  price: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  perMonth: {
    fontSize: 18,
    marginLeft: 6,
    marginBottom: 6,
  },
  card: {
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  benefitIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default Membership;
