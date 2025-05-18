import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
        setWeight(w.toString());

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

  const themeStyles = {
    container: { flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' },
    navbar: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      borderColor: isDarkMode ? '#444' : '#DDD',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    section: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      borderColor: isDarkMode ? '#444' : '#DDD',
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
    },
    text: { color: isDarkMode ? '#FFF' : '#000' },
    iconColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    cardBackground: isDarkMode ? '#333' : '#E0E0E0',
    sectionItem: { alignItems: 'center', flex: 1 },
    sectionText: { marginTop: 5 },
  };

  return (
    <View style={themeStyles.container}>
      <ScrollView style={{ padding: 20 }}>
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, themeStyles.navbar]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialIcon name="menu" size={28} color={themeStyles.text.color} />
          </TouchableOpacity>
          <Text style={[{ fontSize: 22, marginLeft: 15 }, themeStyles.text]}>Dashboard</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Calendar')}
          style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
            marginBottom: 20
          }, themeStyles.navbar]}
        >
          <MaterialIcon name="chevron-left" size={28} color={themeStyles.text.color} />
          <Text style={[{ fontSize: 18 }, themeStyles.text]}>Today</Text>
          <MaterialIcon name="chevron-right" size={28} color={themeStyles.text.color} />
        </TouchableOpacity>

        {/* Calorie Budget */}
        <View style={themeStyles.section}>
          <Text style={[{ textAlign: 'center', marginBottom: 10 }, themeStyles.text]}>
            Calorie Budget
          </Text>
          <Text style={{
            color: themeStyles.iconColor,
            fontSize: 28,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {calories} kcal/day
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {[
              { name: 'heartbeat', label: 'Exercise', value: `${exercise} kcal` },
              { name: 'tint', label: 'Water', value: `${water} ml` },
              { name: 'male', label: 'Steps', value: `${steps}` },
              { name: 'pencil', label: 'Notes', value: '0' },
              { name: 'cutlery', label: 'Food', value: `${food} kcal` },
              { name: 'question-circle', label: 'Questions', value: '0' },
            ].map((item, index) => (
              <View key={index} style={{ alignItems: 'center', width: '30%', marginBottom: 15 }}>
                <Icon name={item.name} size={26} color={themeStyles.iconColor} />
                <Text style={[themeStyles.text, { marginTop: 5, fontSize: 14 }]}>{item.label}</Text>
                <Text style={themeStyles.text}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation Cards */}
        {[
          {
            name: 'balance-scale',
            text: 'Weight In',
            value: weight,
            subtext: 'Last recorded from WeightIn',
            screen: 'WeightIn'
          },
          { name: 'bullseye', text: 'My Weight Goal & Plan', screen: 'WeightGoal' },
          { name: 'cutlery', text: 'Manage my Foods', screen: 'FoodManager' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            style={[{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }, { backgroundColor: themeStyles.cardBackground }]}
          >
            <Icon name={item.name} size={20} color={themeStyles.text.color} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[{ fontSize: 16 }, themeStyles.text]}>{item.text}</Text>
              {item.subtext && (
                <Text style={[{ fontSize: 12, marginTop: 2 }, themeStyles.text]}>
                  {item.subtext}
                </Text>
              )}
            </View>
            {item.value && <Text style={{ color: themeStyles.iconColor, fontSize: 16 }}>{item.value}</Text>}
          </TouchableOpacity>
        ))}

        {/* Streak Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Streak')}
          style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderRadius: 12,
            marginBottom: 120,
          }, { backgroundColor: themeStyles.cardBackground }]}
        >
          <Icon name="fire" size={20} color={themeStyles.text.color} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[{ fontSize: 16 }, themeStyles.text]}>My Login Streak</Text>
            <Text style={[{ fontSize: 12, marginTop: 2 }, themeStyles.text]}>
              Track your daily fitness commitment
            </Text>
          </View>
          <MaterialIcon name="chevron-right" size={24} color={themeStyles.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AtHomeWorkout')}
          style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderRadius: 12,
            marginBottom: 10,
          }, { backgroundColor: themeStyles.cardBackground }]}
        >
          <Icon name="home" size={20} color={themeStyles.text.color} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[{ fontSize: 16 }, themeStyles.text]}>At-Home Workouts</Text>
            <Text style={[{ fontSize: 12, marginTop: 2 }, themeStyles.text]}>No equipment required</Text>
          </View>
          <MaterialIcon name="chevron-right" size={24} color={themeStyles.iconColor} />
        </TouchableOpacity>

        


      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

export default DashboardScreen;
