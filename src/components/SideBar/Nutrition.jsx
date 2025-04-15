import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../BottomTabBar';

const API_KEY = 'TAAhwPUwDc+8lJBgm8FYdg==dB5FaijgpOK45xY3';
const API_URL = 'https://api.api-ninjas.com/v1/nutrition?query=';

const Nutrition = () => {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const cardColor = isDarkMode ? '#1f1f1f' : '#f9f9f9';
  const textColor = isDarkMode ? '#fff' : '#000';

  const fetchNutrition = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
        headers: { 'X-Api-Key': API_KEY },
      });
      const data = await res.json();
      setNutritionData(data);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <Text style={[styles.foodName, { color: textColor }]}>{item.name.toUpperCase()}</Text>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Calories:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.calories} kcal</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Protein:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.protein_g}g</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Fat:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.fat_total_g}g (Saturated {item.fat_saturated_g}g)</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Carbs:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.carbohydrates_total_g}g</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Sugar / Fiber:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.sugar_g}g / {item.fiber_g}g</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Sodium:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.sodium_mg}mg</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.nutrient, { color: textColor }]}>Cholesterol:</Text>
        <Text style={[styles.value, { color: textColor }]}>{item.cholesterol_mg}mg</Text>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Nutrition Lookup</Text>

        <TextInput
          style={[styles.input, { color: textColor, backgroundColor: isDarkMode ? '#1f1f1f' : '#f1f1f1' }]}
          placeholder="e.g. 1lb brisket and fries"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchNutrition}
        />

        <TouchableOpacity style={styles.button} onPress={fetchNutrition}>
          <Text style={styles.buttonText}>Check Nutrition</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={textColor} style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={nutritionData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              !loading && query ? (
                <Text style={[styles.noResult, { color: textColor }]}>No nutrition info found.</Text>
              ) : null
            }
          />
        )}

        <BottomTabBar />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Nutrition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5.5,
    paddingTop: 32,
    paddingBottom: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  list: {
    paddingBottom: 60,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nutrient: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
  },
  noResult: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
