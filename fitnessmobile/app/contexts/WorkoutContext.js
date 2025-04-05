// src/contexts/WorkoutContext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create workout context
const WorkoutContext = createContext();

// Hook to use workout context
export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start a workout
  const startWorkout = async (program) => {
    try {
      setLoading(true);
      
      // Setup the workout session
      const workout = {
        id: Date.now().toString(),
        programId: program.id,
        programName: program.name,
        exercises: program.exercises,
        startTime: new Date().toISOString(),
        inProgress: true,
      };
      
      setCurrentWorkout(workout);
      
      // Save to AsyncStorage in case app is closed during workout
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(workout));
      
      return workout;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Record completed workout
  const recordWorkout = async (workoutData) => {
    try {
      setLoading(true);
      
      // In a real app, save to backend API
      // For now just save to local storage
      
      // Clear current workout
      setCurrentWorkout(null);
      await AsyncStorage.removeItem('currentWorkout');
      
      // Update workout history
      const newHistory = [workoutData, ...workoutHistory];
      setWorkoutHistory(newHistory);
      
      // Save history to AsyncStorage
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(newHistory));
      
      return workoutData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check for in-progress workout on mount
  const checkForInProgressWorkout = async () => {
    try {
      const savedWorkout = await AsyncStorage.getItem('currentWorkout');
      
      if (savedWorkout) {
        const parsedWorkout = JSON.parse(savedWorkout);
        setCurrentWorkout(parsedWorkout);
        return parsedWorkout;
      }
      
      return null;
    } catch (error) {
      console.error('Error checking for in-progress workout:', error);
      return null;
    }
  };

  // Calculate calories burned
  const calculateCaloriesBurned = (duration, intensity) => {
    // Simple calculation for demo purposes
    const baseCaloriesPerMinute = intensity || 5;
    return Math.round(baseCaloriesPerMinute * duration);
  };

  // Context value
  const value = {
    currentWorkout,
    workoutHistory,
    loading,
    error,
    startWorkout,
    recordWorkout,
    checkForInProgressWorkout,
    calculateCaloriesBurned,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};