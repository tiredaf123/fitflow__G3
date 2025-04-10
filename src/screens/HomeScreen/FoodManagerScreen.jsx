import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const foodData = {
  breakfast: {
    items: ['Oats with milk', 'Boiled egg', 'Apple'],
    calories: 320,
    protein: 18,
  },
  lunch: {
    items: ['Brown rice', 'Grilled chicken', 'Salad'],
    calories: 550,
    protein: 40,
  },
  dinner: {
    items: ['Vegetable soup', 'Tofu stir fry', 'Chapati'],
    calories: 400,
    protein: 25,
  },
};

const FoodManagerScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const totalCalories = Object.values(foodData).reduce(
    (acc, curr) => acc + curr.calories,
    0
  );
  const totalProtein = Object.values(foodData).reduce(
    (acc, curr) => acc + curr.protein,
    0
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#fefefe',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    section: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
      padding: 18,
      borderRadius: 16,
      marginBottom: 20,
      ...Platform.select({
        android: { elevation: 4 },
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: isDarkMode ? '#00BFFF' : '#FF6B00',
    },
    itemText: {
      fontSize: 16,
      color: isDarkMode ? '#ddd' : '#333',
      marginLeft: 8,
      marginBottom: 5,
    },
    nutritionText: {
      marginTop: 10,
      fontSize: 15,
      fontWeight: '500',
      color: isDarkMode ? '#bbb' : '#555',
    },
    summarySection: {
      marginBottom: 30,
      padding: 16,
      backgroundColor: isDarkMode ? '#292929' : '#EFEFEF',
      borderRadius: 12,
    },
    summaryText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#ddd' : '#444',
      marginBottom: 4,
    },
  });

  const MealSection = ({ mealType, data }) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </Text>
        {data.items.map((item, idx) => (
          <Text key={idx} style={styles.itemText}>{`\u2022 ${item}`}</Text>
        ))}
        <Text style={styles.nutritionText}>{`Calories: ${data.calories} kcal`}</Text>
        <Text style={styles.nutritionText}>{`Protein: ${data.protein} g`}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon
            name="arrow-back"
            size={28}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage My Foods</Text>
        <View style={{ width: 28 }} />
      </View>

      <MealSection mealType="breakfast" data={foodData.breakfast} />
      <MealSection mealType="lunch" data={foodData.lunch} />
      <MealSection mealType="dinner" data={foodData.dinner} />

      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>{`Total Calories: ${totalCalories} kcal`}</Text>
        <Text style={styles.summaryText}>{`Total Protein: ${totalProtein} g`}</Text>
      </View>
    </ScrollView>
  );
};

export default FoodManagerScreen;
