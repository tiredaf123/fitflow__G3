import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
  }
};

const FoodManagerScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    section: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#00BFFF' : '#FF6B00',
    },
    itemText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#333',
      marginLeft: 8,
      marginBottom: 4,
    },
    nutritionText: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? '#ccc' : '#444',
    },
  });

  const renderMealSection = (mealType, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
      {data.items.map((item, idx) => (
        <Text key={idx} style={styles.itemText}>• {item}</Text>
      ))}
      <Text style={styles.nutritionText}>Calories: {data.calories} kcal</Text>
      <Text style={styles.nutritionText}>Protein: {data.protein} g</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage My Foods</Text>
        <View style={{ width: 28 }} /> {/* Symmetry placeholder */}
      </View>

      {/* Food Sections */}
      {renderMealSection('breakfast', foodData.breakfast)}
      {renderMealSection('lunch', foodData.lunch)}
      {renderMealSection('dinner', foodData.dinner)}
    </ScrollView>
  );
};

export default FoodManagerScreen;
