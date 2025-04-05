// src/screens/main/WorkoutInProgressScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { ProgressBar, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkout } from '../../contexts/WorkoutContext';

const WorkoutInProgressScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recordWorkout, calculateCaloriesBurned } = useWorkout();
  
  // Get workout data from route params
  const { workout, program } = route.params;
  
  // State variables
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [startTime] = useState(new Date());
  
  // References
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  
  // Computed properties
  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const totalSets = currentExercise ? currentExercise.sets : 0;
  const restDuration = 60; // 60 seconds rest between sets
  
  // Initialize
  useEffect(() => {
    // Set up rest timer
    setRestTimer(restDuration);
    
    return () => {
      // Clean up timers when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle timer logic
  useEffect(() => {
    if (isTimerRunning && !isRest) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
        
        // Calculate calories burned (simplified formula)
        const metsValue = currentExercise?.metsValue || 5; // Default to 5 METs
        const weight = 70; // Default to 70kg, should get from user profile
        const caloriesPerMinute = (metsValue * 3.5 * weight) / 200;
        setCaloriesBurned((prev) => prev + caloriesPerMinute / 60);
      }, 1000);
    } else if (isRest) {
      timerRef.current = setInterval(() => {
        setRestTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer <= 0) {
            // Rest period completed
            setIsRest(false);
            setRestTimer(restDuration);
            clearInterval(timerRef.current);
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    } else {
      // Timer not running
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isRest, currentExercise]);
  
  // Start/pause timer
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  
  // Mark current set as completed
  const completeSet = () => {
    const exerciseId = currentExercise.id;
    const newCompletedSets = { ...completedSets };
    
    if (!newCompletedSets[exerciseId]) {
      newCompletedSets[exerciseId] = [];
    }
    
    newCompletedSets[exerciseId][currentSetIndex] = {
      reps: currentExercise.reps,
      weight: currentExercise.weight || 0,
      duration: timer,
    };
    
    setCompletedSets(newCompletedSets);
    
    // Move to next set or exercise
    if (currentSetIndex < totalSets - 1) {
      // Move to next set
      setCurrentSetIndex(currentSetIndex + 1);
      setTimer(0);
      setIsTimerRunning(false);
      
      // Start rest period
      setIsRest(true);
      setRestTimer(restDuration);
    } else {
      // Completed all sets for this exercise
      if (currentExerciseIndex < totalExercises - 1) {
        // Move to next exercise
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        setTimer(0);
        setIsTimerRunning(false);
        
        // Optional rest between exercises
        setIsRest(true);
        setRestTimer(restDuration);
      } else {
        // Completed the entire workout
        finishWorkout();
      }
    }
  };
  
  // Skip current exercise
  const skipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setTimer(0);
      setIsRest(false);
    } else {
      // This is the last exercise
      Alert.alert(
        'Skip Last Exercise',
        'This is the last exercise. Are you sure you want to finish the workout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Finish', onPress: finishWorkout },
        ]
      );
    }
  };
  
  // Complete the workout
  const finishWorkout = async () => {
    try {
      // Calculate total duration in minutes
      const endTime = new Date();
      const totalDurationMs = endTime - startTime;
      const totalDurationMinutes = Math.round(totalDurationMs / (1000 * 60));
      
      // Prepare workout data
      const workoutData = {
        programId: program.id,
        programName: program.name,
        exercises: Object.keys(completedSets).map((exerciseId) => {
          const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
          return {
            exerciseId,
            name: exercise ? exercise.name : 'Unknown',
            sets: completedSets[exerciseId],
          };
        }),
        duration: totalDurationMinutes,
        caloriesBurned: Math.round(caloriesBurned),
        completedAt: new Date().toISOString(),
      };
      
      // Record workout to backend
      await recordWorkout(workoutData);
      
      // Navigate to summary screen
      navigation.navigate('WorkoutSummary', {
        duration: totalDurationMinutes,
        caloriesBurned: Math.round(caloriesBurned),
        exercises: Object.keys(completedSets).length,
        workoutData,
      });
    } catch (error) {
      console.error('Failed to save workout:', error);
      Alert.alert('Error', 'Failed to save your workout. Please try again.');
    }
  };
  
  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </Text>
          <ProgressBar
            progress={(currentExerciseIndex + (currentSetIndex / totalSets)) / totalExercises}
            color="#4F46E5"
            style={styles.progressBar}
          />
        </View>
        
        {/* Exercise info */}
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{currentExercise?.name}</Text>
          <Text style={styles.exerciseInstructions}>
            {isRest ? 'Rest Time' : `Set ${currentSetIndex + 1} of ${totalSets}`}
          </Text>
          
          {/* Video demonstration */}
          {!isRest && currentExercise?.videoUrl && (
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                source={{ uri: currentExercise.videoUrl }}
                style={styles.video}
                resizeMode="contain"
                shouldPlay={!isRest}
                isLooping
                isMuted={false}
                useNativeControls
              />
            </View>
          )}
          
          {/* Exercise details */}
          {!isRest && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="barbell-outline" size={24} color="#4F46E5" />
                <Text style={styles.detailValue}>
                  {currentExercise?.weight || 'Bodyweight'} {currentExercise?.weight ? 'kg' : ''}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="repeat-outline" size={24} color="#4F46E5" />
                <Text style={styles.detailValue}>{currentExercise?.reps || '-'} reps</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="flame-outline" size={24} color="#4F46E5" />
                <Text style={styles.detailValue}>{Math.round(caloriesBurned)} kcal</Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Timer display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>{isRest ? 'Rest Timer' : 'Exercise Timer'}</Text>
          <Text style={styles.timerValue}>
            {isRest ? formatTime(restTimer) : formatTime(timer)}
          </Text>
          <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
            <Ionicons
              name={isTimerRunning ? 'pause-circle' : 'play-circle'}
              size={60}
              color="#4F46E5"
            />
          </TouchableOpacity>
        </View>
        
        {/* Action buttons */}
        <View style={styles.buttonsContainer}>
          {!isRest && (
            <Button
              mode="contained"
              style={styles.completeButton}
              onPress={completeSet}
              disabled={!isTimerRunning && timer === 0}
              color="#4F46E5"
            >
              Complete Set
            </Button>
          )}
          
          <Button
            mode="outlined"
            style={styles.skipButton}
            onPress={skipExercise}
            color="#4F46E5"
          >
            Skip Exercise
          </Button>
          
          <Button
            mode="text"
            style={styles.endButton}
            onPress={() => {
              Alert.alert(
                'End Workout',
                'Are you sure you want to end this workout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'End', onPress: finishWorkout },
                ]
              );
            }}
            color="#EF4444"
          >
            End Workout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  exerciseInstructions: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  videoContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  timerButton: {
    marginBottom: 8,
  },
  buttonsContainer: {
    gap: 12,
  },
  completeButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
  },
  skipButton: {
    borderColor: '#4F46E5',
  },
  endButton: {
    color: '#EF4444',
  },
});

export default WorkoutInProgressScreen;