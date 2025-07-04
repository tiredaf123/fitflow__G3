import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config/config';
import BottomTabBar from '../../../components/BottomTabBar';
import { useTheme } from '../../../navigation/ThemeProvider';

const TrainerListScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const fetchTrainers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/trainers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        Toast.show({
          type: 'error',
          text1: 'Trainer Fetch Error',
          text2: `Error ${response.status}: ${errorText}`,
        });
        setError('Failed to load trainer data. Please try again.');
        return;
      }

      const data = await response.json();
      setTrainers(data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching trainers',
        text2: err.message,
      });
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Trainers</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00BFFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView>
          {trainers.map((trainer) => (
            <View key={trainer._id} style={styles.card}>
              <Image
                source={{
                  uri: trainer.imageUrl
                    ? `${BASE_URL}${trainer.imageUrl}`
                    : 'https://via.placeholder.com/100',
                }}
                style={styles.image}
              />
              <View style={styles.details}>
                <Text style={styles.name}>{trainer.username}</Text>
                <Text style={styles.bio}>{trainer.bio}</Text>
                <Text style={styles.specialties}>
                  Specialties:{' '}
                  {Array.isArray(trainer.specialties)
                    ? trainer.specialties.join(', ')
                    : trainer.specialties}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Toast />
      <BottomTabBar />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#1c1c1c' : '#fff',
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      color: isDarkMode ? '#fff' : '#000',
    },
    card: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f9f9f9',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      alignItems: 'center',
      elevation: 2,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 15,
    },
    details: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: isDarkMode ? '#fff' : '#000',
    },
    bio: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#555',
    },
    specialties: {
      fontSize: 14,
      color: isDarkMode ? '#ddd' : '#333',
      marginTop: 5,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
    },
  });

export default TrainerListScreen;
