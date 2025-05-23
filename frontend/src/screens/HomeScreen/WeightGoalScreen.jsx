import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';
//satya
const WeightGoalScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    const fetchCurrentWeight = async () => {
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
        console.error('Fetch current weight error:', err);
      }
    };

    fetchCurrentWeight();
  }, []);

  const generatePlan = () => {
    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);

    if (isNaN(current) || isNaN(target) || current === target) {
      Alert.alert('Invalid input', 'Please enter valid and different weights');
      return;
    }

    const difference = Math.abs(current - target);
    const isLosing = current > target;

    if (isLosing) {
      if (difference > 15) {
        setPlan(
          'Goal: Lose weight rapidly and safely\n\n• Caloric Deficit: 700–900 kcal/day\n• Meals: High in protein, low in carbs\n• Cardio: 5x/week (30–45 min)\n• Strength Training: 4x/week\n• Avoid processed sugar and soda\n• Drink 2–3L water daily\n• Sleep: 7–9 hrs/night'
        );
      } else if (difference > 7) {
        setPlan(
          'Goal: Moderate fat loss\n\n• Caloric Deficit: 500 kcal/day\n• Meals: Lean protein + fibre-rich carbs\n• Cardio: 3x/week\n• Strength Training: 3x/week\n• Track calories using MyFitnessPal\n• 10,000 steps/day'
        );
      } else {
        setPlan(
          'Goal: Light fat loss / Tone\n\n• Caloric Deficit: 300 kcal/day\n• Meals: Slightly reduce portion sizes\n• Walk 20 min after meals\n• Strength Training: 2x/week\n• Cardio: 2x/week\n• Focus on sleep + stress reduction'
        );
      }
    } else {
      if (difference > 10) {
        setPlan(
          'Goal: Gain weight steadily\n\n• Caloric Surplus: 500–700 kcal/day\n• Meals: 5–6 high-protein, high-carb meals\n• Strength Training: 4–5x/week\n• Protein Shake between meals\n• Peanut butter, oats, banana, eggs\n• Sleep: 8+ hrs/night'
        );
      } else {
        setPlan(
          'Goal: Lean muscle gain\n\n• Caloric Surplus: 300–400 kcal/day\n• Meals: Balanced carbs + protein (e.g., chicken, rice, broccoli)\n• Strength Training: 3–4x/week\n• Creatine + protein powder optional\n• Sleep recovery important'
        );
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    section: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
      borderRadius: 12,
      padding: 16,
    },
    label: {
      color: isDarkMode ? '#ccc' : '#555',
      fontSize: 16,
      marginBottom: 8,
    },
    currentWeightValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#00BFFF' : '#FF6B00',
      marginBottom: 16,
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
    planText: {
      marginTop: 12,
      fontSize: 14,
      color: isDarkMode ? '#eee' : '#333',
      lineHeight: 22,
    },
    button: {
      backgroundColor: '#FF6B00',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Weight Goal & Custom Plan</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Current Weight:</Text>
        <Text style={styles.currentWeightValue}>
          {currentWeight ? `${currentWeight} kg` : '--'}
        </Text>

        <Text style={styles.label}>Your Target Weight (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 60"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={generatePlan}>
          <Text style={styles.buttonText}>Generate Plan</Text>
        </TouchableOpacity>

        {plan ? (
          <>
            <Text style={[styles.label, { marginTop: 16 }]}>Your Plan:</Text>
            <Text style={styles.planText}>{plan}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default WeightGoalScreen;
