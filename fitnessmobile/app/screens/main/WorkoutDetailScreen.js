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
import { ArrowLeft, Calendar, Clock, Play, CheckCircle, MoreVertical, Share, Bookmark, Star } from 'lucide-react-native';

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
      {
        id: 'e2',
        name: 'Push-ups',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1598971639058-afc1dfb1e4dc',
        instructions: 'Start in a plank position with hands slightly wider than shoulders. Lower your body until your chest nearly touches the floor. Pause, then push back up. Repeat.'
      },
      {
        id: 'e3',
        name: 'Mountain Climbers',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e',
        instructions: 'Start in a push-up position. Bring one knee toward your chest, then return it to starting position. Alternate legs, picking up the pace until it feels like running in place in a plank position.'
      },
      {
        id: 'e4',
        name: 'Bodyweight Squats',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1567598508481-65074a69c93b',
        instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair, keeping your knees over your ankles. Return to starting position and repeat.'
      },
      {
        id: 'e5',
        name: 'Burpees',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1598971639058-afc1dfb1e4dc',
        instructions: 'Begin in a standing position. Drop into a squat position and place hands on the ground. Kick feet back into a plank position. Immediately return feet to squat position, then jump up as high as possible.'
      },
      {
        id: 'e6',
        name: 'Plank',
        duration: '45 sec',
        rest: '15 sec',
        sets: 1,
        image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6',
        instructions: 'Place forearms on the ground with elbows aligned below shoulders and arms parallel to the body at about shoulder width. Ground toes into the floor and squeeze glutes to stabilize your body. Hold this position.'
      }
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
    // In a real app, you would navigate to a workout player screen
    Alert.alert('Starting Workout', 'In a complete app, this would start the guided workout experience.');
    
    // Example navigation to a workout player screen
    // navigation.navigate('WorkoutPlayer', { workoutId: workout.id });
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
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleBookmark}
            >
              <Bookmark 
                size={24} 
                color="#fff" 
                fill={isBookmarked ? "#fff" : "none"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowOptionsModal(true)}
            >
              <MoreVertical size={24} color="#fff" />
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
              <Clock size={16} color="#fff" />
              <Text style={styles.infoText}>{workout.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{workout.calories} cal</Text>
            </View>
            <View style={styles.infoItem}>
              <Star size={16} color="#fff" fill="#fff" />
              <Text style={styles.infoText}>{workout.reviews.averageRating} ({workout.reviews.count})</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Instructor */}
        <View style={styles.instructorContainer}>
          <Image 
            source={{ uri: workout.instructor.image }} 
            style={styles.instructorImage} 
          />
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorLabel}>Instructor</Text>
            <Text style={styles.instructorName}>{workout.instructor.name}</Text>
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Workout</Text>
          <Text style={styles.description}>{workout.description}</Text>
        </View>
        
        {/* Equipment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            {workout.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <CheckCircle size={16} color="#4CAF50" />
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Exercises Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseItem}
              onPress={() => showExerciseDetails(exercise)}
            >
              <Image
                source={{ uri: exercise.image }}
                style={styles.exerciseImage}
              />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetail}>{exercise.duration}</Text>
                  <Text style={styles.exerciseDetailDivider}>•</Text>
                  <Text style={styles.exerciseDetail}>Rest: {exercise.rest}</Text>
                </View>
              </View>
              <Text style={styles.exerciseNumber}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleWorkout}
        >
          <Calendar size={20} color="#4CAF50" />
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartWorkout}
        >
          <Play size={20} color="#fff" fill="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Exercise Details Modal */}
      <Modal
        visible={showExerciseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowExerciseModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>×</Text>
            </TouchableOpacity>
            
            {selectedExercise && (
              <ScrollView>
                <Image
                  source={{ uri: selectedExercise.image }}
                  style={styles.modalExerciseImage}
                />
                <View style={styles.modalExerciseContent}>
                  <Text style={styles.modalExerciseTitle}>{selectedExercise.name}</Text>
                  
                  <View style={styles.modalExerciseDetails}>
                    <View style={styles.modalExerciseDetail}>
                      <Text style={styles.modalExerciseDetailLabel}>Duration</Text>
                      <Text style={styles.modalExerciseDetailValue}>{selectedExercise.duration}</Text>
                    </View>
                    <View style={styles.modalExerciseDetail}>
                      <Text style={styles.modalExerciseDetailLabel}>Rest</Text>
                      <Text style={styles.modalExerciseDetailValue}>{selectedExercise.rest}</Text>
                    </View>
                    <View style={styles.modalExerciseDetail}>
                      <Text style={styles.modalExerciseDetailLabel}>Sets</Text>
                      <Text style={styles.modalExerciseDetailValue}>{selectedExercise.sets}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.instructionsTitle}>Instructions</Text>
                  <Text style={styles.instructions}>{selectedExercise.instructions}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsModalContent}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleShareWorkout}
            >
              <Share size={20} color="#333" />
              <Text style={styles.optionText}>Share Workout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsModal(false);
                Alert.alert('Report Content', 'Thank you for helping us maintain a quality experience.');
              }}
            >
              <Text style={styles.optionText}>Report Content</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  imageContainer: {
    height: 240,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  workoutInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  levelBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  instructorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  instructorInfo: {
    marginLeft: 16,
  },
  instructorLabel: {
    fontSize: 12,
    color: '#666',
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  equipmentList: {
    marginTop: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#666',
  },
  exerciseDetailDivider: {
    marginHorizontal: 4,
    color: '#ccc',
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ccc',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 80,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  scheduleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginRight: 8,
  },
  scheduleButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  startButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginLeft: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalExerciseImage: {
    width: '100%',
    height: 200,
  },
  modalExerciseContent: {
    padding: 16,
  },
  modalExerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalExerciseDetails: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modalExerciseDetail: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f8',
    borderRadius: 8,
    marginRight: 8,
  },
  modalExerciseDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  modalExerciseDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  optionsModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default WorkoutDetailScreen;