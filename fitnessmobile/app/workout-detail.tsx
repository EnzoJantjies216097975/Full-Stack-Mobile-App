import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // In a real app, you would fetch this data from your API
  // based on the workout ID from route.params
  const [workout, setWorkout] = useState({
    id: id || '1',
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
      {
        id: 'e2',
        name: 'Push-ups',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec',
        instructions: 'Start in plank position with hands under shoulders. Lower your body until chest nearly touches the floor. Push back up to the starting position.'
      }
    ],
    reviews: {
      averageRating: 4.7,
      count: 128
    }
  });

  const [isBookmarked, setIsBookmarked] = useState(false);

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
    router.push({
      pathname: '/workout-in-progress',
      params: { workoutId: workout.id }
    });
  };
  
  // Handle scheduling the workout
  const handleScheduleWorkout = () => {
    Alert.alert('Schedule Workout', 'In a complete app, this would open a calendar to schedule this workout.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: workout.image }}
          style={styles.coverImage}
        />
        
        {/* Header Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={toggleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Workout Info */}
        <View style={styles.workoutInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{workout.reviews.averageRating}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="timer-outline" size={18} color="#6B7280" />
              <Text style={styles.statText}>{workout.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={18} color="#6B7280" />
              <Text style={styles.statText}>{workout.calories} cal</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={18} color="#6B7280" />
              <Text style={styles.statText}>{workout.level}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{workout.description}</Text>
        </View>
        
        {/* Equipment Needed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            {workout.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity 
              key={exercise.id}
              style={styles.exerciseItem}
              onPress={() => router.push({
                pathname: '/exercise-detail',
                params: { id: exercise.id }
              })}
            >
               <Image 
      source={{ uri: exercise.image }} 
      style={styles.exerciseImage} 
    />
    <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetailsText}>
                    {exercise.sets} {exercise.sets === 1 ? 'set' : 'sets'} • {exercise.rest} rest
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Instructor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructor</Text>
          <View style={styles.instructorContainer}>
            <Image 
              source={{ uri: workout.instructor.image }} 
              style={styles.instructorImage} 
            />
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{workout.instructor.name}</Text>
              <Text style={styles.instructorDetails}>
                HIIT & Strength Training Expert
              </Text>
            </View>
          </View>
        </View>
        
        {/* Reviews Summary */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewsContainer}>
            <View style={styles.ratingLarge}>
              <Text style={styles.ratingLargeText}>{workout.reviews.averageRating}</Text>
              <View style={styles.starsContainer}>
                {/* Render 5 stars with the appropriate fill based on rating */}
                {[1, 2, 3, 4, 5].map(star => (
                  <Ionicons 
                    key={star}
                    name={star <= Math.floor(workout.reviews.averageRating) ? "star" : 
                         (star - 0.5 <= workout.reviews.averageRating) ? "star-half" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>
                Based on {workout.reviews.count} reviews
              </Text>
            </View>
          </View>
        </View>
        
        {/* Bottom padding for button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleWorkout}
        >
          <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartWorkout}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#4B5563',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetailsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  instructorDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  reviewsContainer: {
    alignItems: 'center',
  },
  ratingLarge: {
    alignItems: 'center',
  },
  ratingLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 8,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});