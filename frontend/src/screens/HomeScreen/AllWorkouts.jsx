import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, Image, ActivityIndicator,
  RefreshControl, TouchableOpacity, StyleSheet, Alert, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../../config/config';
import BottomTabBar from '../../components/BottomTabBar';

const { width } = Dimensions.get('window');

const AllWorkouts = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const colors = theme?.colors ?? {
    text: '#000',
    secondaryText: '#666',
    cardBackground: '#fff',
    cardBorder: '#ddd',
    primary: '#4CAF50',
    error: '#E53935',
    background: '#f5f5f5',
  };

  const [state, setState] = useState({
    workouts: [],
    loading: true,
    error: null,
    refreshing: false,
    hasMembership: false,
  });

  const updateState = (newState) => setState((prev) => ({ ...prev, ...newState }));

  const fetchUserMembership = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/membership/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      updateState({ hasMembership: data.hasMembership });

      if (!data.hasMembership) {
        // 🚨 Replace with the correct screen name
        navigation.replace('Member');
      }
    } catch (error) {
      console.error('Membership check failed:', error);
      updateState({ hasMembership: false });
      navigation.replace('Member'); // fallback
    }
  }, [navigation]);

  const fetchWorkouts = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      updateState({ workouts: data, loading: false, refreshing: false });
    } catch (error) {
      updateState({ error: error.message, loading: false });
    }
  }, []);

  const handleCancelMembership = async () => {
    Alert.alert(
      'Cancel Membership',
      'Are you sure you want to cancel your membership? You will lose immediate access and forfeit the 50% reactivation discount.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel Now',
          style: 'destructive',
          onPress: async () => {
            try {
              updateState({ loading: true });
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`${BASE_URL}/membership/cancel`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              const result = await res.json();
              if (!res.ok) throw new Error(result.message || 'Failed to cancel membership');

              Alert.alert(
                'Membership Cancelled',
                'Access has been revoked. You are no longer eligible for a 50% discount.',
                [{ text: 'OK', onPress: () => navigation.replace('Member') }]
              );

              updateState({ hasMembership: false, loading: false, workouts: [] });

            } catch (err) {
              Alert.alert('Error', err.message || 'Something went wrong.');
              updateState({ loading: false });
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserMembership();
      if (state.hasMembership) fetchWorkouts();
    }, [fetchUserMembership, fetchWorkouts, state.hasMembership])
  );

  const onRefresh = () => {
    updateState({ refreshing: true });
    fetchUserMembership().then(() => {
      if (state.hasMembership) fetchWorkouts();
    });
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.workoutMedia} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="fitness-center" size={40} color={colors.secondaryText} />
        </View>
      )}
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.cardDescription, { color: colors.secondaryText }]} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="schedule" size={16} color={colors.secondaryText} />
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            {item.duration} mins
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="bar-chart" size={16} color={colors.secondaryText} />
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            {item.difficulty}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
        <Text style={styles.headerText}>Workout Programs</Text>
      </LinearGradient>

      {state.hasMembership && (
        <TouchableOpacity
          onPress={handleCancelMembership}
          style={[styles.cancelButton, { backgroundColor: colors.error }]}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel Membership</Text>
        </TouchableOpacity>
      )}

      {state.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={state.workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ padding: 16 }}
        />
      )}
      <BottomTabBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  workoutMedia: {
    width: '100%',
    height: width * 0.5,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholder: {
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 5,
    fontSize: 14,
  },
  cancelButton: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllWorkouts;
