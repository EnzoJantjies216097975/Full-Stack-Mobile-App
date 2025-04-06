import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

// Initialize Firebase
import { initializeFirebase } from './services/firebase';
initializeFirebase();

// Configure AWS Amplify
import { configureAmplify } from './services/aws';
configureAmplify();

// Context Providers
import { AuthProvider } from '../app/contexts/AuthContext';
import { WorkoutProvider } from '../app/contexts/WorkoutContext';
import { NotificationProvider } from '../app/contexts/NotificationContext';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted from react-native',
]);

export default function Index() {
  // In Expo Router, the index file should redirect to another route
  // or render minimal content, not set up a complete navigation structure
  return <Redirect href="/(tabs)/dashboard" />;
}