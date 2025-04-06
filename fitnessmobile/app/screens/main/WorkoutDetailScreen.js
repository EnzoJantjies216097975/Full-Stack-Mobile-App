import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Fallback icon component when Lucide is not available
const IconFallback = ({ name, size, color, fill }) => {
  // Map Lucide-like icons to Ionicons
  const iconMap = {
    'arrow-left': 'arrow-back',
    'calendar': 'calendar-outline',
    'clock': 'time-outline',
    'play': 'play-outline',
    'check-circle': 'checkmark-circle-outline',
    'more-vertical': 'ellipsis-vertical',
    'share': 'share-outline',
    'bookmark': 'bookmark-outline',
    'star': 'star-outline'
  };

  return (
    <Ionicons 
      name={iconMap[name] || 'help-outline'} 
      size={size} 
      color={color}
    />
  );
};

const WorkoutDetailScreen = ({ navigation, route }) => {
  // In a real app, you would fetch this data from your API
  // based on the workout ID from route.params
  const [workout, setWorkout] = useState({
    id: '1',
    title: 'Full Body HIIT',
    description: 'High intensity interval training designed to burn fat and improve cardiovascular fitness. This workout combines bodyweight exercises with minimal rest periods.',
    level: 'Intermediate',
    duration: '30 min',
    calories: 350,
    category: 'HIIT',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    equipment: ['None', 'Optional: Mat'],
    instructor: {
      name: 'Sarah Johnson',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    exercises: [
      {
        id: 'e1',
        name: 'Jumping Jacks',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        instructions: 'Start with your feet together and arms at your sides. Jump to a position with legs spread and arms overhead. Return to starting position and repeat.'
      },
      // ... rest of the exercises remain the same
    ],
    reviews: {
      averageRating: 4.7,
      count: 128
    }
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Toggle bookmark status
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    
    if (!isBookmarked) {
      // Show confirmation message
      Alert.alert('Workout Saved', 'This workout has been added to your favorites.');
    }
  };

  // Handle starting the workout
  const handleStartWorkout = () => {
    Alert.alert('Starting Workout', 'In a complete app, this would start the guided workout experience.');
  };
  
  // Handle scheduling the workout
  const handleScheduleWorkout = () => {
    Alert.alert('Schedule Workout', 'In a complete app, this would open a calendar to schedule this workout.');
  };
  
  // Show exercise details
  const showExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };
  
  // Share workout
  const handleShareWorkout = () => {
    setShowOptionsModal(false);
    Alert.alert('Share Workout', 'In a complete app, this would open the share options.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: workout.image }}
          style={styles.coverImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        
        {/* Header Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <IconFallback name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleBookmark}
            >
              <IconFallback 
                name="bookmark" 
                size={24} 
                color="#fff"
                fill={isBookmarked ? "#fff" : "none"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowOptionsModal(true)}
            >
              <IconFallback name="more-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Workout Title & Info */}
        <View style={styles.workoutInfo}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{workout.level}</Text>
          </View>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <IconFallback name="clock" size={16} color="#fff" />
              <Text style={styles.infoText}>{workout.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{workout.calories} cal</Text>
            </View>
            <View style={styles.infoItem}>
              <IconFallback name="star" size={16} color="#fff" fill="#fff" />
              <Text style={styles.infoText}>{workout.reviews.averageRating} ({workout.reviews.count})</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Rest of the component remains the same */}
      <ScrollView style={styles.content}>
        {/* ... previous implementation ... */}
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleWorkout}
        >
          <IconFallback name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartWorkout}
        >
          <IconFallback name="play" size={20} color="#fff" fill="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles remain the same as in the previous implementation
const styles = StyleSheet.create({
  // ... (previous styles remain unchanged)
});

export default WorkoutDetailScreen;