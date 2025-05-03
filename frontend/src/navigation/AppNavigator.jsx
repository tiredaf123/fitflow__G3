import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { useTheme } from './ThemeProvider';

// Onboarding & Auth Screens
import Welcome from '../screens/Welcome';
import AgeSelection from '../screens/AgeSelection';
import GenderSelection from '../screens/GenderSelection';
import HeightSelector from '../screens/HeightSelector';
import WeightSelection from '../screens/WeightSelection';
import GoalSelection from '../screens/GoalSelection';
import SignUp_Page from '../auth/SignUp_Page';
import Login_Page from '../auth/Login_Page';

// Intro Screens
import { IntroPage1, IntroPage2, IntroPage3 } from '../screens/IntroScreen';
import { IntroPage4, IntroPage5, IntroPage6 } from '../screens/IntroScreen2';

// Workout Screens
import WorkoutScreen from '../screens/Workout/WorkoutScreen';
import ChestWorkout from '../screens/Workout/ChestWorkout';
import ArmsWorkout from '../screens/Workout/ArmsWorkout';
import BackWorkout from '../screens/Workout/BackWorkout';
import LegWorkout from '../screens/Workout/LegWorkout';
import AbsWorkout from '../screens/Workout/AbsWorkout';

// Drawer Navigator
import MainDrawerNavigator from './MainDrawerNavigator';

// Home & Profile Screens
import HomePage from '../screens/HomeScreen/HomePage';
import AchievementsScreen from '../screens/HomeScreen/AchievementsScreen';
import ProfileScreen from '../screens/HomeScreen/ProfileScreen';
import PersonalScreen from '../screens/HomeScreen/SubScreen/PersonalScreen';
import GeneralScreen from '../screens/HomeScreen/SubScreen/GeneralScreen';
import NotificationScreen from '../screens/HomeScreen/SubScreen/NotificationScreen';
import HelpScreen from '../screens/HomeScreen/SubScreen/HelpScreen';
import AdminSupplementsScreen from '../Admin/AdminPanel';
import HireCoachScreen from '../screens/HomeScreen/SubScreen/HireCoachScreen';
import TrainerListScreen from '../screens/HomeScreen/SubScreen/TrainerListScreen';
import AboutScreen from '../screens/HomeScreen/SubScreen/AboutScreen';
import TermsAndConditionsScreen from '../screens/HomeScreen/SubScreen/TermsAndConditionsScreen';
import StreakScreen from '../screens/HomeScreen/SubScreen/StreakScreen';
import FoodManagerScreen from '../screens/HomeScreen/FoodManagerScreen';
import CalendarScreen from '../screens/HomeScreen/CalenderScreen';
import WeightInScreen from '../screens/HomeScreen/WeightInScreen';
import WeightGoalScreen from '../screens/HomeScreen/WeightGoalScreen';
// Admin & SideBar
import AdminPanel from '../Admin/AdminPanel';

import SupplementsScreen from '../screens/HomeScreen/SubScreen/SupplementsScreen';
// Drawer
import MainDrawerNavigator from './MainDrawerNavigator';
import CalendarScreen from '../screens/HomeScreen/CalenderScreen';
import FoodManagerScreen from '../screens/HomeScreen/FoodManagerScreen';

import Challenge from '../components/SideBar/Challenge';
import Progress from '../components/SideBar/Progress';

import Nutrition from '../components/SideBar/Nutrition';
import Trainer_LoginPage from '../auth/Trainer_LoginPage';

const Stack = createStackNavigator();

function AppNavigator() {
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

          {/* Onboarding & Auth */}
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SignUp_Page" component={SignUp_Page} />
          <Stack.Screen name="Login_Page" component={Login_Page} />
          <Stack.Screen name="GenderSelection" component={GenderSelection} />
          <Stack.Screen name="AgeSelection" component={AgeSelection} />
          <Stack.Screen name="HeightSelector" component={HeightSelector} />
          <Stack.Screen name="WeightSelection" component={WeightSelection} />
          <Stack.Screen name="GoalSelection" component={GoalSelection} />

          {/* Main Drawer */}
          <Stack.Screen name="DashboardScreen" component={MainDrawerNavigator} />

          {/* App Screens */}
          <Stack.Screen name="HomeScreen" component={HomePage} />
          <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
          <Stack.Screen name="ChestWorkout" component={ChestWorkout} />
          <Stack.Screen name="ArmsWorkout" component={ArmsWorkout} />
          <Stack.Screen name="BackWorkout" component={BackWorkout} />
          <Stack.Screen name="LegWorkout" component={LegWorkout} />
          <Stack.Screen name="AbsWorkout" component={AbsWorkout} />

          {/* Intro Slides */}
          <Stack.Screen name="IntroPage1" component={IntroPage1} />
          <Stack.Screen name="IntroPage2" component={IntroPage2} />
          <Stack.Screen name="IntroPage3" component={IntroPage3} />
          <Stack.Screen name="IntroPage4" component={IntroPage4} />
          <Stack.Screen name="IntroPage5" component={IntroPage5} />
          <Stack.Screen name="IntroPage6" component={IntroPage6} />

          {/* Profile & SubScreens */}
          <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="Personal" component={PersonalScreen} />
          <Stack.Screen name="General" component={GeneralScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="HireCoach" component={HireCoachScreen} />
          <Stack.Screen name="TrainerList" component={TrainerListScreen} />
          <Stack.Screen name="Streak" component={StreakScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Terms" component={TermsAndConditionsScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
          <Stack.Screen name="Supplements" component={SupplementsScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="FoodManager" component={FoodManagerScreen} />
          <Stack.Screen name="WeightGoal" component={WeightGoalScreen} />
          <Stack.Screen name="WeightIn" component={WeightInScreen} />
          <Stack.Screen name="Challenge" component={Challenge} />
          <Stack.Screen name="Progress" component={Progress} />
          <Stack.Screen name="Nutrition" component={Nutrition} />
          <Stack.Screen name="Trainer_LoginPage" component={Trainer_LoginPage} />



          {/* Utility & Management */}
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="FoodManager" component={FoodManagerScreen} />
          <Stack.Screen name="WeightIn" component={WeightInScreen} />
          <Stack.Screen name="WeightGoal" component={WeightGoalScreen} />

          {/* Admin & SideBar */}
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
          <Stack.Screen name="Challenge" component={Challenge} />
          <Stack.Screen name="Progress" component={Progress} />
          <Stack.Screen name="Classes" component={Classes} />
          <Stack.Screen name="Nutrition" component={Nutrition} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default AppNavigator;
