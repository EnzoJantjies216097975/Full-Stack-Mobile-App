// app/dashboard.tsx
import React from 'react';
import { View, Text } from 'react-native';
// Use correct relative path
import { useAuth } from '../contexts/AuthContext';
// Other imports
import { useWorkout } from '../contexts/WorkoutContext';

// Copy content from your DashboardScreen component
const Dashboard = () => {
  const { user } = useAuth();
  // Rest of component logic...
  
  return (
    // Your component JSX...
    <View>
      <Text>Dashboard Screen</Text>
    </View>
  );
};

export default Dashboard;