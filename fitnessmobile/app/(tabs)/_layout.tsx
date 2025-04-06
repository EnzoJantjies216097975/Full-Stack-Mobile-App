// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const routeName = route.name;

          if (routeName === 'dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (routeName === 'workouts') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (routeName === 'classes') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (routeName === 'nutrition') {
            iconName = focused ? 'nutrition' : 'nutrition-outline';
          } else if (routeName === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="workouts" options={{ title: 'Workouts' }} />
      <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
      <Tabs.Screen name="nutrition" options={{ title: 'Nutrition' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}