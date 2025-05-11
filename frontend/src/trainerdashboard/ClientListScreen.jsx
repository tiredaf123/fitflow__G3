import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../config/config';

const ClientListScreen = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Authentication Error', 'Please login again.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/bookings/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Combine upcoming and past bookings if present
        const bookings = [
          ...(Array.isArray(data.upcoming) ? data.upcoming : []),
          ...(Array.isArray(data.past) ? data.past : []),
          ...(Array.isArray(data) ? data : []),
        ];

        if (bookings.length === 0) {
          setClients([]);
          setLoading(false);
          return;
        }

        // Extract unique clients with latest appointment date
        const uniqueClientsMap = new Map();

        bookings.forEach((booking) => {
          const client = booking.client || booking.userId || booking.user;
          if (client && client._id) {
            const clientId = client._id;
            const bookingDate = new Date(booking.appointmentDate || booking.createdAt || 0);

            if (
              !uniqueClientsMap.has(clientId) ||
              bookingDate > new Date(uniqueClientsMap.get(clientId).appointmentDate)
            ) {
              uniqueClientsMap.set(clientId, {
                client,
                appointmentDate: booking.appointmentDate || booking.createdAt || null,
              });
            }
          }
        });

        setClients(Array.from(uniqueClientsMap.values()));
      } catch (err) {
        console.error('Fetch clients error:', err);
        Alert.alert('Error', 'Failed to fetch clients.');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const openChat = (clientObj) => {
    if (!clientObj.client || !clientObj.client._id) {
      Alert.alert('Error', 'Client information is incomplete.');
      return;
    }
    navigation.navigate('TrainerChat', { client: clientObj.client });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (clients.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No clients found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clients</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Client List */}
      <FlatList
        data={clients}
        keyExtractor={(item) => item.client._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChat(item)} style={styles.clientItem}>
            <Image
              source={
                item.client.imageUrl
                  ? { uri: item.client.imageUrl.startsWith('http') ? item.client.imageUrl : `${BASE_URL}/${item.client.imageUrl}` }
                  : require('../assets/Images/avatar.png') // fallback local avatar
              }
              style={styles.clientImage}
            />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{item.client.fullName || item.client.username || 'Unnamed Client'}</Text>
              <Text style={styles.bookingDate}>
                Next Booking: {formatDate(item.appointmentDate)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  clientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  clientInfo: {
    marginLeft: 15,
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ClientListScreen;
