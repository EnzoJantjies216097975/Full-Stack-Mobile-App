// src/navigation/RootNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ConfirmAccountScreen from '../screens/auth/ConfirmAccountScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// Main app screens
import MainTabNavigator from './MainTabNavigator';
import WorkoutDetailScreen from '../screens/main/WorkoutDetailScreen';
import ExerciseDetailScreen from '../screens/main/ExerciseDetailScreen';
import WorkoutInProgressScreen from '../screens/main/WorkoutInProgressScreen';
import WorkoutSummaryScreen from '../screens/main/WorkoutSummaryScreen';
import ClassDetailScreen from '../screens/main/ClassDetailScreen';
import AddMealScreen from '../screens/main/AddMealScreen';
import MealDetailScreen from '../screens/main/MealDetailScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Could replace with a splash screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth flows
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ConfirmAccount" component={ConfirmAccountScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // Main app flows
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="WorkoutDetail" 
            component={WorkoutDetailScreen}
            options={{ headerShown: true, title: 'Workout Program' }} 
          />
          <Stack.Screen 
            name="ExerciseDetail" 
            component={ExerciseDetailScreen}
            options={{ headerShown: true, title: 'Exercise Details' }} 
          />
          <Stack.Screen 
            name="WorkoutInProgress" 
            component={WorkoutInProgressScreen}
            options={{ headerShown: true, title: 'Workout' }} 
          />
          <Stack.Screen 
            name="WorkoutSummary" 
            component={WorkoutSummaryScreen}
            options={{ headerShown: true, title: 'Workout Complete' }} 
          />
          <Stack.Screen 
            name="ClassDetail" 
            component={ClassDetailScreen}
            options={{ headerShown: true, title: 'Class Details' }} 
          />
          <Stack.Screen 
            name="AddMeal" 
            component={AddMealScreen}
            options={{ headerShown: true, title: 'Add Meal' }} 
          />
          <Stack.Screen 
            name="MealDetail" 
            component={MealDetailScreen}
            options={{ headerShown: true, title: 'Meal Details' }} 
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{ headerShown: true, title: 'Notifications' }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ headerShown: true, title: 'Settings' }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;