import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../navigation/ThemeProvider';


  // Notice: No need to import ThemeProvider here

// Import your screens
import Welcome from '../screens/Welcome';
import AgeSelection from '../screens/AgeSelection';
import GenderSelection from '../screens/GenderSelection';
import HeightSelector from '../screens/HeightSelector';
import WeightSelection from '../screens/WeightSelection'
import SignUp_Page from '../auth/SignUp_Page';
import Login_Page from '../auth/Login_Page';
import GoalSelection from '../screens/GoalSelection';
import HomePage from '../screens/HomeScreen/HomePage';
import DashboardScreen from '../screens/HomeScreen/DashboardScreen';
import { IntroPage1, IntroPage2, IntroPage3 } from '../screens/IntroScreen';
import WorkoutsScreen from '../screens/Workout/WorkoutScreen';
import { IntroPage4, IntroPage5, IntroPage6 } from '../screens/IntroScreen2';
import ChestWorkout from '../screens/Workout/ChestWorkout';
import ArmsWorkout from '../screens/Workout/ArmsWorkout';
import BackWorkout from '../screens/Workout/BackWorkout';
import LegWorkout from '../screens/Workout/LegWorkout';
import AbsWorkout from '../screens/Workout/AbsWorkout';
import AchievementsScreen from '../screens/HomeScreen/AchievementsScreen';
import ProfileScreen from '../screens/HomeScreen/ProfileScreen';
import PersonalScreen from '../screens/HomeScreen/SubScreen/PersonalScreen';
import GeneralScreen from '../screens/HomeScreen/SubScreen/GeneralScreen';
import NotificationScreen from '../screens/HomeScreen/SubScreen/NotificationScreen';
import HelpScreen from '../screens/HomeScreen/SubScreen/HelpScreen';
import HireCoachScreen from '../screens/HomeScreen/SubScreen/HireCoachScreen';
import AboutScreen from '../screens/HomeScreen/SubScreen/AboutScreen';
import TermsAndConditionsScreen from '../screens/HomeScreen/SubScreen/TermsAndConditionsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen'; 
import PaymentScreen from '../screens/PaymentScreen';
import CalendarScreen from '../screens/HomeScreen/CalendarScreen'; // adjust path if needed
import FoodManagerScreen from '../screens/HomeScreen/FoodManagerScreen';
import WeightGoalScreen from '../screens/HomeScreen/WeightGoalScreen';
import WeightInScreen from '../screens/HomeScreen/WeightInScreen';



const Stack = createStackNavigator();


const AppNavigator = () => {
  const { isDarkMode } = useTheme();

  const themeStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F0F0F0',
    },
  };

  return (
      <View style={themeStyles.container}>
        
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignUp_Page" component={SignUp_Page} />
            <Stack.Screen name="Login_Page" component={Login_Page} />
            <Stack.Screen name="GenderSelection" component={GenderSelection} />
            <Stack.Screen name="AgeSelection" component={AgeSelection} />
            <Stack.Screen name="HeightSelector" component={HeightSelector} />
            <Stack.Screen name="WeightSelection" component={WeightSelection} />
            <Stack.Screen name="GoalSelection" component={GoalSelection} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="HomeScreen" component={HomePage} />
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
            <Stack.Screen name="WorkoutsScreen" component={WorkoutsScreen} />
            <Stack.Screen name="ChestWorkout" component={ChestWorkout} />
            <Stack.Screen name="ArmsWorkout" component={ArmsWorkout} />
            <Stack.Screen name="BackWorkout" component={BackWorkout} />
            <Stack.Screen name="LegWorkout" component={LegWorkout} />
            <Stack.Screen name="AbsWorkout" component={AbsWorkout} />
            <Stack.Screen name="IntroPage1" component={IntroPage1} />
            <Stack.Screen name="IntroPage2" component={IntroPage2} />
            <Stack.Screen name="IntroPage3" component={IntroPage3} />
            <Stack.Screen name="IntroPage4" component={IntroPage4} />
            <Stack.Screen name="IntroPage5" component={IntroPage5} />
            <Stack.Screen name="IntroPage6" component={IntroPage6} />
            <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="FoodManager" component={FoodManagerScreen} />
            <Stack.Screen name="WeightGoal" component={WeightGoalScreen} />
            <Stack.Screen name="WeightIn" component={WeightInScreen} />




          </Stack.Navigator>
        </NavigationContainer>
      </View>
  );
};

export default AppNavigator;
