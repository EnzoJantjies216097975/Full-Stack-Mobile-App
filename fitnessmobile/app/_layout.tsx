import React from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

// Initialize Firebase and AWS
import { initializeFirebase } from './services/firebase';
import { configureAmplify } from './services/aws';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Initialize services
initializeFirebase();
configureAmplify();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PaperProvider>
        <AuthProvider>
          <WorkoutProvider>
            <NotificationProvider>
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
            </NotificationProvider>
          </WorkoutProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}