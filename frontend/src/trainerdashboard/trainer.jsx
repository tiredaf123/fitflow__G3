// ✅ Add this to TrainerDashboard.js to fetch and display the Quote of the Day

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';

const { width } = Dimensions.get('window');

const TrainerDashboard = () => {
  const navigation = useNavigation();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  const fetchTrainer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: 'Trainer_LoginPage' }] });
        return;
      }
      const res = await fetch(`${BASE_URL}/trainers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.status === 401) {
        await AsyncStorage.removeItem('token');
        navigation.reset({ index: 0, routes: [{ name: 'Trainer_LoginPage' }] });
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Failed to fetch trainer data');
        return;
      }

      setTrainer(data);
    } catch (err) {
      setError('Error fetching trainer data');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setBookingsError('Authentication required');
        setBookings([]);
        return;
      }
      const res = await fetch(`${BASE_URL}/bookings/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        const latestBookingsMap = new Map();

        [...(data.upcoming || []), ...(data.past || [])].forEach((booking) => {
          const client = booking.client || booking.user || {};
          const key = client._id || booking.userId;
          const date = new Date(booking.appointmentDate);

          if (!latestBookingsMap.has(key) || new Date(latestBookingsMap.get(key).appointmentDate) < date) {
            latestBookingsMap.set(key, { ...booking, appointmentDate: date });
          }
        });

        const sortedBookings = Array.from(latestBookingsMap.values()).sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );

        setBookings(sortedBookings);
      } else {
        setBookingsError(data.message || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (err) {
      setBookingsError('Error fetching bookings');
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/quotes`);
      const data = await res.json();
      if (data) {
        setQuoteText(data.text || '');
        setQuoteAuthor(data.author || '');
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
    }
  }, []);

  useEffect(() => {
    fetchTrainer();
    fetchBookings();
    fetchQuote();
  }, [fetchTrainer, fetchBookings, fetchQuote]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchTrainer(), fetchBookings(), fetchQuote()]);
    setRefreshing(false);
  }, [fetchTrainer, fetchBookings, fetchQuote]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.reset({ index: 0, routes: [{ name: 'Trainer_LoginPage' }] });
        },
      },
    ]);
  };

  const renderBookingItem = (item, index) => {
    const appointmentDate = new Date(item.appointmentDate);
    const client = item.client || item.user || {};

    return (
      <View key={index} style={styles.scheduleItem}>
        <Text style={styles.time}>
          {appointmentDate.toLocaleDateString()} at{' '}
          {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.client}>
          with {client.fullName || client.username || 'Client'}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {trainer?.imageUrl ? (
            <Image
              source={{
                uri: trainer.imageUrl.startsWith('http')
                  ? trainer.imageUrl
                  : `${BASE_URL}/${trainer.imageUrl}`,
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Icon name="person" size={26} color="#fff" />
            </View>
          )}
          <Text style={styles.header}>
            Welcome, {trainer?.username || 'Trainer'} 👋
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TrainerNotification')}
            style={styles.iconButton}
            accessibilityLabel="Notifications"
          >
            <Icon name="notifications" size={26} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.iconButton}
            accessibilityLabel="Logout"
          >
            <Icon name="logout" size={26} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quote of the Day Section */}
      {quoteText !== '' && (
        <View style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 10, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#444', marginBottom: 4 }}>
            “{quoteText}”
          </Text>
          {quoteAuthor && (
            <Text style={{ fontSize: 14, textAlign: 'right', color: '#888' }}>— {quoteAuthor}</Text>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Client Appointments</Text>
        {loadingBookings ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : bookingsError ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{bookingsError}</Text>
        ) : bookings.length === 0 ? (
          <Text style={{ fontStyle: 'italic', color: 'gray' }}>No bookings found.</Text>
        ) : (
          bookings.map(renderBookingItem)
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AddWorkout')}
        >
          <Text style={styles.actionText}>+ Add Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('ClientList')}
        >
          <Text style={styles.actionText}>📋 Clients</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccc',
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fafafa',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
  scheduleItem: {
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: '#555',
  },
  client: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TrainerDashboard;
