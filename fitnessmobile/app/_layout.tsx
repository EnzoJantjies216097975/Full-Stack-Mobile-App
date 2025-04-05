import React from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

// Initialize Firebase
import { initializeFirebase } from './services/firebase';
// import { configureAmplify } from '../services/aws';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';

// Initialize Firebase and Amplify
initializeFirebase();
// configureAmplify();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PaperProvider>
        <AuthProvider>
          <WorkoutProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#4F46E5',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </WorkoutProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}