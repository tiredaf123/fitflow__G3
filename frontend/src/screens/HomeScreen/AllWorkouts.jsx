import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import { useStripe } from '@stripe/stripe-react-native';

const { width, height } = Dimensions.get('window');

const AllWorkouts = () => {
  const navigation = useNavigation();
  const stripe = useStripe();
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode ?? false;
  const colors = theme?.colors ?? {
    text: '#000',
    secondaryText: '#666',
    cardBackground: '#fff',
    cardBorder: '#ddd',
    primary: '#4CAF50',
    error: 'red',
    background: '#f5f5f5',
  };

  const [state, setState] = useState({
    workouts: [],
    loading: true,
    error: null,
    refreshing: false,
    hasMembership: false,
    checkingMembership: true,
  });

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const fetchUserMembership = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/membership/check`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to check membership');
      }

      const data = await response.json();
      updateState({
        hasMembership: data.hasMembership,
        error: null,
        checkingMembership: false,
      });
    } catch (error) {
      console.error('Membership check error:', error);
      updateState({ 
        hasMembership: false, 
        error: error.message, 
        checkingMembership: false 
      });
    }
  }, []);

  const fetchWorkouts = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BASE_URL}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load workouts');
      }

      const data = await response.json();
      updateState({ 
        workouts: data, 
        error: null, 
        loading: false, 
        refreshing: false 
      });
    } catch (error) {
      console.error('Workouts fetch error:', error);
      updateState({ 
        error: error.message, 
        loading: false, 
        refreshing: false 
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          await fetchUserMembership();
          if (isActive && state.hasMembership) {
            await fetchWorkouts();
          } else if (isActive) {
            updateState({ loading: false });
          }
        } catch (error) {
          if (isActive) updateState({ error: error.message });
        }
      };

      loadData();
      return () => {
        isActive = false;
      };
    }, [fetchUserMembership, fetchWorkouts, state.hasMembership])
  );

  const onRefresh = useCallback(() => {
    updateState({ refreshing: true });
    fetchUserMembership().then(() => {
      if (state.hasMembership) {
        fetchWorkouts();
      } else {
        updateState({ refreshing: false });
      }
    });
  }, [fetchUserMembership, fetchWorkouts, state.hasMembership]);

  const handlePurchaseMembership = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    updateState({ loading: true });

    // 1. Create payment intent
    const response = await fetch(`${BASE_URL}/membership/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planType: 'monthly' }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Payment failed');
    }

    const { clientSecret, subscriptionId } = await response.json();

    // 2. Initialize payment sheet
    const { error: initError } = await stripe.initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'FitFlow Premium',
      style: 'alwaysDark',
      googlePay: true,
      applePay: true,
    });

    if (initError) throw initError;

    // 3. Present payment sheet
    const { error: paymentError } = await stripe.presentPaymentSheet();

    if (paymentError) throw paymentError;

    // 4. Confirm payment with backend - with retry logic
    let retries = 0;
    const maxRetries = 5;
    let confirmationSuccessful = false;

    while (retries < maxRetries && !confirmationSuccessful) {
      try {
        const confirmResponse = await fetch(`${BASE_URL}/membership/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subscriptionId }),
        });

        const confirmData = await confirmResponse.json();

        if (confirmResponse.ok && confirmData.success) {
          confirmationSuccessful = true;
          updateState({ hasMembership: true, loading: false });
          await fetchWorkouts();
          Alert.alert('Success', 'Your membership has been activated!');
          return;
        } else if (confirmData.status === 'processing') {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          retries++;
        } else {
          throw new Error(confirmData.message || 'Payment confirmation failed');
        }
      } catch (error) {
        if (retries >= maxRetries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      }
    }

    if (!confirmationSuccessful) {
      throw new Error('Payment is taking longer than expected. Please check back later.');
    }
  } catch (error) {
    console.error('Payment error:', error);
    let errorMessage = 'Failed to process payment';
    try {
      const errorData = JSON.parse(error.message);
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = error.message || errorMessage;
    }
    Alert.alert('Payment Error', errorMessage);
    updateState({ loading: false });
  }
};

  const renderWorkoutItem = ({ item }) => (
    <View style={[styles.itemContainer, styles.shadow]}>
      <View style={[
        styles.card, 
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        }
      ]}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.workoutImage} 
            resizeMode="cover" 
          />
        ) : (
          <View style={[styles.workoutImage, { backgroundColor: colors.cardBorder }]}>
            <Icon name="fitness-center" size={40} color={colors.secondaryText} />
          </View>
        )}

        <View style={styles.workoutContent}>
          <View style={styles.workoutHeader}>
            <Text style={[styles.workoutTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          <Text 
            style={[styles.workoutDesc, { color: colors.secondaryText }]} 
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Icon name="schedule" size={16} color={colors.secondaryText} />
              <Text style={[styles.metaText, { color: colors.secondaryText }]}>
                {item.duration} mins
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="fitness-center" size={16} color={colors.secondaryText} />
              <Text style={[styles.metaText, { color: colors.secondaryText }]}>
                {item.difficulty}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="fitness-center" size={60} color={colors.secondaryText} />
      <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
        {state.error ? 'Failed to load workouts' : 'No workouts available'}
      </Text>
      {state.error && (
        <TouchableOpacity
          onPress={onRefresh}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMembershipPrompt = () => (
    <ScrollView contentContainerStyle={styles.membershipPromptContainer}>
      <View style={styles.membershipContent}>
        <Icon name="lock" size={80} color={colors.primary} style={styles.membershipIcon} />
        <Text style={[styles.membershipTitle, { color: colors.text }]}>
          Premium Membership Required
        </Text>
        <Text style={[styles.membershipDescription, { color: colors.secondaryText }]}>
          Unlock all premium workouts and features with a FitFlow membership
        </Text>
        
        <View style={styles.membershipBenefits}>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={24} color={colors.primary} />
            <Text style={[styles.benefitText, { color: colors.text }]}>
              Access to all premium workouts
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={24} color={colors.primary} />
            <Text style={[styles.benefitText, { color: colors.text }]}>
              New workouts added weekly
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={24} color={colors.primary} />
            <Text style={[styles.benefitText, { color: colors.text }]}>
              Expert training programs
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePurchaseMembership}
          style={[
            styles.membershipButton, 
            { 
              backgroundColor: colors.primary,
              opacity: state.loading ? 0.7 : 1
            }
          ]}
          activeOpacity={0.7}
          disabled={state.loading}
        >
          {state.loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.membershipButtonText}>Get Membership - $3.00/month</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.membershipFooter, { color: colors.secondaryText }]}>
          Cancel anytime. First month free trial available.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#121212'] : ['#f5f5f5', '#e5e5e5']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton} 
          activeOpacity={0.7}
        >
          <Icon 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? '#fff' : '#333'} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Workout Programs
        </Text>
        <View style={styles.membershipButtonPlaceholder} />
      </LinearGradient>

      {state.loading && !state.refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={colors.primary} 
          />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading...
          </Text>
        </View>
      ) : state.hasMembership ? (
        <FlatList
          data={state.workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        renderMembershipPrompt()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: { 
    padding: 8,
    zIndex: 1,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  membershipButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  membershipButtonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16,
    letterSpacing: 0.5,
  },
  membershipButtonPlaceholder: { width: 24 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutContent: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  workoutDesc: {
    fontSize: 15,
    marginBottom: 14,
    lineHeight: 22,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  membershipPromptContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  membershipContent: {
    alignItems: 'center',
  },
  membershipIcon: {
    marginBottom: 20,
  },
  membershipTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  membershipDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  membershipBenefits: {
    width: '100%',
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  membershipFooter: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AllWorkouts;