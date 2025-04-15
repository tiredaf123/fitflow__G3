import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const plans = [
  { duration: '12 Months', price: '$49.99', badge: 'BEST VALUE', discount: '-48%' },
  { duration: '3 Months', price: '$49.99', badge: 'MOST POPULAR', discount: '-48%' },
  { duration: '1 Month', price: '$49.99' },
];

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { goal } = route.params || {};
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleContinueFree = () => {
    navigation.navigate('HomeScreen');
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      alert('Please select a plan before proceeding.');
      return;
    }
    navigation.navigate('Payment', { selectedPlan });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Choose the Perfect Plan for Your Fitness Journey</Text>

      {plans.map((plan, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.planCard,
            selectedPlan === plan.duration && styles.selectedCard,
          ]}
          onPress={() => setSelectedPlan(plan.duration)}
        >
          <View style={styles.cardTop}>
            {plan.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{plan.badge}</Text>
              </View>
            )}
            {plan.discount && (
              <View style={styles.discount}>
                <Text style={styles.discountText}>{plan.discount}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.planText}>{plan.duration}</Text>
            <Text style={styles.planText}>{plan.price}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleContinueFree}>
        <Text style={styles.continueFree}>Continue Free Plan</Text>
      </TouchableOpacity>

      <View style={styles.policySection}>
        <Text style={styles.policyTitle}>Cancellation & Refund Policy</Text>
        <Text style={styles.policyText}>• You can cancel your subscription anytime through your account settings.</Text>
        <Text style={styles.policyText}>• Cancellations take effect at the end of the current billing cycle.</Text>
        <Text style={styles.policyText}>• No refunds are issued for partially used subscription periods.</Text>
        <Text style={styles.policyText}>• Once a payment is processed, it is non-refundable.</Text>
        <Text style={styles.policyText}>
          • For assistance, contact our support team at <Text style={styles.link}>support@email.com</Text>.
        </Text>
      </View>
    </ScrollView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  planCard: {
    backgroundColor: '#1C1C1C',
    borderColor: '#fec400',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#fec40033',
    borderColor: '#fec400',
    borderWidth: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#FEC400',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  discount: {
    backgroundColor: '#FF6C1A',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  subscribeBtn: {
    backgroundColor: '#fec400',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  subscribeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  continueFree: {
    color: '#fec400',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  policySection: {
    marginTop: 30,
    padding: 10,
  },
  policyTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  policyText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 5,
  },
  link: {
    color: '#fec400',
    textDecorationLine: 'underline',
  },
});
