import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';
//satya
const FoodManagerScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/profile/weight`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.currentWeight?.weight) {
          setCurrentWeight(data.currentWeight.weight.toString());
        }
      } catch (err) {
        console.error('Fetch weight error:', err);
      }
    };
    fetchWeight();
  }, []);

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
    input: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#FF6B00',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
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
      marginBottom: 10,
    },
    nutritionText: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: '500',
   
      color: isDarkMode ? '#ccc' : '#444',
    },
  });

  const handleSuggestMeals = () => {
    const curr = parseFloat(currentWeight);
    const goal = parseFloat(targetWeight);
    if (!goal || isNaN(curr) || isNaN(goal)) {
      Alert.alert('Please enter a valid target weight');
      return;
    }

    let plan;
    const diff = curr - goal;
    if (diff >= 5) {
      // Suggest weight loss meal
      plan = {
        breakfast: {
          items: ['Boiled eggs', 'Oatmeal with banana', 'Black coffee'],
          calories: 300,
          protein: 20,
        },
        lunch: {
          items: ['Grilled chicken breast', 'Quinoa', 'Steamed vegetables'],
          calories: 450,
          protein: 35,
        },
        dinner: {
          items: ['Vegetable soup', 'Tofu stir fry', 'Green salad'],
          calories: 350,
          protein: 25,
        }
      };
    } else if (goal > curr + 5) {
      // Suggest weight gain meal
      plan = {
        breakfast: {
          items: ['Peanut butter toast', 'Protein smoothie', 'Scrambled eggs'],
          calories: 500,
          protein: 25,
        },
        lunch: {
          items: ['Beef stir fry', 'Rice', 'Avocado salad'],
          calories: 700,
          protein: 40,
        },
        dinner: {
          items: ['Pasta with chicken', 'Greek yogurt', 'Mixed nuts'],
          calories: 600,
          protein: 35,
        }
      };
    } else {
      // Maintenance plan
      plan = {
        breakfast: {
          items: ['Fruit smoothie', 'Boiled egg', 'Oats'],
          calories: 350,
          protein: 18,
        },
        lunch: {
          items: ['Chicken sandwich', 'Sweet potato', 'Side salad'],
          calories: 500,
          protein: 30,
        },
        dinner: {
          items: ['Grilled salmon', 'Brown rice', 'Steamed broccoli'],
          calories: 450,
          protein: 30,
        }
      };
    }

    setMealPlan(plan);
  };

  const MealSection = ({ mealType, data }) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{mealType.toUpperCase()}</Text>
        {data.items.map((item, idx) => (
          <Text key={idx} style={styles.itemText}>{`\u2022 ${item}`}</Text>
        ))}
        <Text style={styles.nutritionText}>{`Calories: ${data.calories} kcal`}</Text>
        <Text style={styles.nutritionText}>{`Protein: ${data.protein} g`}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Suggest Foods by Goal</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Current Weight: {currentWeight} kg</Text>
        <Text style={{ color: isDarkMode ? '#ccc' : '#000', marginBottom: 10 }}>Enter your target weight:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 60"
          keyboardType="numeric"
          value={targetWeight}
          onChangeText={setTargetWeight}
        />
        <TouchableOpacity style={styles.button} onPress={handleSuggestMeals}>
          <Text style={styles.buttonText}>Suggest Meal Plan</Text>
        </TouchableOpacity>
      </View>

      {mealPlan && (
        <>
          <MealSection mealType="breakfast" data={mealPlan.breakfast} />
          <MealSection mealType="lunch" data={mealPlan.lunch} />
          <MealSection mealType="dinner" data={mealPlan.dinner} />
        </>
      )}
    </ScrollView>
  );
};

export default FoodManagerScreen;
