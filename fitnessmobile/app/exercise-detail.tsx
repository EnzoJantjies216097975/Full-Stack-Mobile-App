import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // In a real app, you would fetch this data based on the exercise ID
  const [exercise] = useState({
    id: id || 'e1',
    name: 'Barbell Squat',
    category: 'Strength',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    secondaryMuscles: ['Lower Back', 'Calves'],
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Squat Rack'],
    description: 'The barbell squat is a compound exercise that primarily targets the muscles of the lower body. It is considered one of the most effective exercises for building overall strength and muscle mass.',
    benefits: [
      'Builds lower body strength',
      'Increases muscle mass',
      'Improves athletic performance',
      'Enhances core stability',
      'Boosts functional movement patterns'
    ],
    instructions: [
      'Set up a barbell on a squat rack at approximately shoulder height.',
      'Step under the bar and position it across your upper back (not on your neck).',
      'Grip the bar with hands slightly wider than shoulder-width apart.',
      'Lift the bar off the rack by extending your legs, and take a step back.',
      'Position your feet shoulder-width apart, toes pointed slightly outward.',
      'Take a deep breath, brace your core, and begin the movement by bending at your hips and knees.',
      'Lower your body until your thighs are parallel to the ground or slightly below.',
      'Drive through your heels to stand back up to the starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    formTips: [
      'Keep your chest up and back straight throughout the movement',
      'Ensure your knees track in line with your toes',
      'Maintain weight on your heels and mid-foot, not on your toes',
      'Descend to at least parallel depth for full muscle engagement',
      'Keep your core tight throughout the entire movement'
    ],
    variations: [
      {
        name: 'Front Squat',
        difficulty: 'Intermediate',
        description: 'Bar is placed across the front of the shoulders, placing more emphasis on the quadriceps.'
      },
      {
        name: 'Goblet Squat',
        difficulty: 'Beginner',
        description: 'Performed with a dumbbell or kettlebell held at chest level, great for beginners.'
      },
      {
        name: 'Bulgarian Split Squat',
        difficulty: 'Intermediate',
        description: 'A unilateral variation with the rear foot elevated, targeting each leg individually.'
      }
    ],
    commonMistakes: [
      'Allowing knees to cave inward',
      'Rising onto toes or shifting weight forward',
      'Rounding the lower back',
      'Not reaching sufficient depth',
      'Looking up too high or down too low'
    ],
    images: [
      'https://images.unsplash.com/photo-1534368786749-d40d31498585',
      'https://images.unsplash.com/photo-1596357395882-f880589e6a3e',
      'https://images.unsplash.com/photo-1577221084712-45b0445d2b00'
    ],
    relatedExercises: [
      'Leg Press',
      'Lunges',
      'Romanian Deadlift',
      'Leg Extensions',
      'Hack Squat'
    ]
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <Image
          source={{ uri: exercise.images[0] }}
          style={styles.mainImage}
        />
        
        {/* Basic Info */}
        <View style={styles.infoContainer}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.categoryText}>{exercise.category}</Text>
          
          {/* Target Muscles */}
          <View style={styles.musclesContainer}>
            <Text style={styles.sectionSubtitle}>Target Muscles</Text>
            <View style={styles.musclesList}>
              {exercise.targetMuscles.map((muscle, index) => (
                <View key={index} style={styles.muscleBadge}>
                  <Text style={styles.muscleText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{exercise.description}</Text>
        </View>
        
        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {exercise.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
        
        {/* Form Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Tips</Text>
          {exercise.formTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        {/* Common Mistakes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Mistakes</Text>
          {exercise.commonMistakes.map((mistake, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="close-circle" size={18} color="#EF4444" />
              <Text style={styles.tipText}>{mistake}</Text>
            </View>
          ))}
        </View>
        
        {/* Variations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variations</Text>
          {exercise.variations.map((variation, index) => (
            <View key={index} style={styles.variationItem}>
              <View style={styles.variationHeader}>
                <Text style={styles.variationName}>{variation.name}</Text>
                <View style={styles.variationDifficultyBadge}>
                  <Text style={styles.variationDifficultyText}>{variation.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.variationDescription}>{variation.description}</Text>
            </View>
          ))}
        </View>
        
        {/* Equipment Needed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            {exercise.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Related Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Exercises</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedExercisesScroll}>
            {exercise.relatedExercises.map((relatedExercise, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.relatedExerciseItem}
                onPress={() => {
                  // In a real app, navigate to the related exercise
                  console.log(`Navigate to ${relatedExercise}`);
                }}
              >
                <Text style={styles.relatedExerciseText}>{relatedExercise}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
      
      {/* Add To Workout Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Workout</Text>
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
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  difficultyBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009688',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  musclesContainer: {
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  muscleText: {
    fontSize: 14,
    color: '#4B5563',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#009688',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    marginLeft: 12,
  },
  variationItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  variationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  variationDifficultyBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  variationDifficultyText: {
    fontSize: 12,
    color: '#009688',
  },
  variationDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#4B5563',
  },
  relatedExercisesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  relatedExerciseItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  relatedExerciseText: {
    fontSize: 14,
    color: '#4B5563',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});