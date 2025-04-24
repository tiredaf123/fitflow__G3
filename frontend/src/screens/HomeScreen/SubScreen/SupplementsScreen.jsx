import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config/config';
import BottomTabBar from '../../../components/BottomTabBar';
import { useTheme } from '../../../navigation/ThemeProvider';

const SupplementsScreen = () => {
  const { isDarkMode } = useTheme();
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSupplements = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await fetch(`${BASE_URL}/supplements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSupplements(data);
      } else {
        console.warn('Failed to fetch supplements');
      }
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplements();
  }, []);

  const renderSupplement = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
          shadowColor: isDarkMode ? '#000' : '#ccc',
        },
      ]}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#111' }]}>
          {item.name}
        </Text>
        <Text style={[styles.purpose, { color: isDarkMode ? '#bbb' : '#444' }]}>
          {item.purpose}
        </Text>
        <Text style={[styles.price, { color: isDarkMode ? '#aaa' : '#666' }]}>
          £ {item.price}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: isDarkMode ? '#fff' : '#000' },
        ]}
      >
        Supplements
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      ) : (
        <FlatList
          data={supplements}
          keyExtractor={(item) => item._id}
          renderItem={renderSupplement}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  purpose: {
    fontSize: 14,
    marginBottom: 3,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SupplementsScreen;
