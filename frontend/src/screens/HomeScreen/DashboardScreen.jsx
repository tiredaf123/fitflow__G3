import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';

const DashboardScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);
  const [food, setFood] = useState(0);

  const fetchWeight = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/profile/weight`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data?.currentWeight?.weight) {
        const w = parseFloat(data.currentWeight.weight);
        setWeight(w.toFixed(1)); // Show 1 decimal place

        const baseCalories = 22 * w;
        const dailyCalories = Math.round(baseCalories);
        const exerciseBurn = Math.round(dailyCalories * 0.2);
        const waterIntake = Math.round(w * 35); // ml
        const stepEstimate = Math.round(exerciseBurn * 20);
        const foodCalories = dailyCalories + exerciseBurn;

        setCalories(dailyCalories);
        setExercise(exerciseBurn);
        setWater(waterIntake);
        setSteps(stepEstimate);
        setFood(foodCalories);
      }
    } catch (err) {
      console.error('Dashboard fetch weight error:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWeight();
    }, [])
  );

  const themeStyles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' 
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 80 // Space for bottom tab bar
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 16,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF',
      borderRadius: 12,
      elevation: 2,
      shadowColor: isDarkMode ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dateNav: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF',
      borderRadius: 12,
      marginBottom: 16,
      elevation: 2,
      shadowColor: isDarkMode ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    section: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: isDarkMode ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    text: { 
      color: isDarkMode ? '#FFF' : '#000',
      fontFamily: 'System',
    },
    titleText: {
      fontSize: 20,
      fontWeight: '600',
      color: isDarkMode ? '#FFF' : '#000',
      marginLeft: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 12,
    },
    highlightText: {
      color: isDarkMode ? '#00BFFF' : '#FF6B00',
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 16,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
    },
    metricsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    metricItem: {
      width: '30%',
      alignItems: 'center',
      marginBottom: 16,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFF' : '#000',
      marginTop: 4,
    },
    metricLabel: {
      fontSize: 12,
      color: isDarkMode ? '#AAA' : '#666',
      marginTop: 4,
    },
    cardContent: {
      flex: 1,
      marginLeft: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? '#FFF' : '#000',
    },
    cardSubtitle: {
      fontSize: 12,
      color: isDarkMode ? '#AAA' : '#666',
      marginTop: 4,
    },
    cardValue: {
      color: isDarkMode ? '#00BFFF' : '#FF6B00',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={themeStyles.container}>
      <ScrollView contentContainerStyle={themeStyles.contentContainer}>
        {/* Header */}
        <View style={themeStyles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialIcon name="menu" size={28} color={themeStyles.text.color} />
          </TouchableOpacity>
          <Text style={themeStyles.titleText}>Dashboard</Text>
        </View>

        {/* Date Navigation */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Calendar')}
          style={themeStyles.dateNav}
        >
          <MaterialIcon name="chevron-left" size={28} color={themeStyles.text.color} />
          <Text style={[themeStyles.text, { fontSize: 16, fontWeight: '500' }]}>Today</Text>
          <MaterialIcon name="chevron-right" size={28} color={themeStyles.text.color} />
        </TouchableOpacity>

        {/* Calorie Budget Section */}
        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>Calorie Budget</Text>
          <Text style={themeStyles.highlightText}>
            {calories.toLocaleString()} kcal/day
          </Text>

          <View style={themeStyles.metricsContainer}>
            {[
              { name: 'heartbeat', label: 'Exercise', value: `${exercise.toLocaleString()} kcal` },
              { name: 'tint', label: 'Water', value: `${water.toLocaleString()} ml` },
              { name: 'male', label: 'Steps', value: steps.toLocaleString() },
              { name: 'pencil', label: 'Notes', value: '0' },
              { name: 'cutlery', label: 'Food', value: `${food.toLocaleString()} kcal` },
              { name: 'question-circle', label: 'Questions', value: '0' },
            ].map((item, index) => (
              <View key={index} style={themeStyles.metricItem}>
                <Icon 
                  name={item.name} 
                  size={24} 
                  color={isDarkMode ? '#00BFFF' : '#FF6B00'} 
                />
                <Text style={themeStyles.metricValue}>{item.value}</Text>
                <Text style={themeStyles.metricLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation Cards */}
        {[
          {
            name: 'balance-scale',
            text: 'Weight In',
            value: weight ? `${weight} kg` : '--',
            subtext: 'Last recorded weight',
            screen: 'WeightIn'
          },
          { 
            name: 'bullseye', 
            text: 'My Weight Goal & Plan', 
            subtext: 'Set and track your goals',
            screen: 'WeightGoal' 
          },
          { 
            name: 'cutlery', 
            text: 'Manage my Foods', 
            subtext: 'Track your nutrition',
            screen: 'FoodManager' 
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            style={themeStyles.card}
            activeOpacity={0.8}
          >
            <Icon 
              name={item.name} 
              size={20} 
              color={isDarkMode ? '#00BFFF' : '#FF6B00'} 
            />
            <View style={themeStyles.cardContent}>
              <Text style={themeStyles.cardTitle}>{item.text}</Text>
              {item.subtext && (
                <Text style={themeStyles.cardSubtitle}>{item.subtext}</Text>
              )}
            </View>
            {item.value && (
              <Text style={themeStyles.cardValue}>{item.value}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

export default DashboardScreen;