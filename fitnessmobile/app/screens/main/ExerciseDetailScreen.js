import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// In a real app, you would import icons from a library like lucide-react-native
// For simplicity, I've created placeholder components
const IconButton = ({ onPress, icon, style }) => (
  <TouchableOpacity style={[styles.iconButton, style]} onPress={onPress}>
    <Text style={styles.iconText}>{icon}</Text>
  </TouchableOpacity>
);

const { width, height } = Dimensions.get('window');

const ExerciseDetailScreen = ({ navigation, route }) => {
  // In a real app, you would fetch this data based on the exercise ID from route.params
  const [exercise, setExercise] = useState({
    id: '1',
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

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 300;
  const headerFadeRange = [headerHeight - 100, headerHeight - 50];
  
  // State for managing modals
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  // Calculate header animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: headerFadeRange,
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: headerFadeRange,
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  // Handle playing demonstration video
  const handlePlayVideo = () => {
    setVideoModalVisible(true);
    // In a real app, this would trigger video playback
  };

  // Open image viewer with selected image
  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Animated header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Image
          source={{ uri: exercise.images[0] }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
            </View>
            <Text style={styles.headerTitle}>{exercise.name}</Text>
            <Text style={styles.headerCategory}>{exercise.category}</Text>
          </View>
        </View>
      </Animated.View>
      
      {/* Floating navbar with animated title */}
      <View style={styles.navbar}>
        <IconButton icon="←" onPress={() => navigation.goBack()} />
        <Animated.Text 
          style={[styles.navbarTitle, { opacity: headerTitleOpacity }]}
          numberOfLines={1}
        >
          {exercise.name}
        </Animated.Text>
        <IconButton icon="♡" onPress={() => {}} />
      </View>
      
      {/* Main scrollable content */}
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Top padding to account for header */}
        <View style={{ height: headerHeight }} />
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.watchButton}
            onPress={handlePlayVideo}
          >
            <Text style={styles.buttonIcon}>▶️</Text>
            <Text style={styles.buttonText}>Watch Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {}}
          >
            <Text style={styles.addButtonText}>Add to Workout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main sections */}
        <View style={styles.mainContent}>
          {/* Overview section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.description}>{exercise.description}</Text>
            
            <View style={styles.musclesContainer}>
              <View style={styles.muscleGroup}>
                <Text style={styles.muscleGroupTitle}>Target Muscles</Text>
                <View style={styles.muscleList}>
                  {exercise.targetMuscles.map((muscle, index) => (
                    <View key={index} style={styles.muscleBadge}>
                      <Text style={styles.muscleText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.muscleGroup}>
                <Text style={styles.muscleGroupTitle}>Secondary Muscles</Text>
                <View style={styles.muscleList}>
                  {exercise.secondaryMuscles.map((muscle, index) => (
                    <View key={index} style={styles.secondaryMuscleBadge}>
                      <Text style={styles.muscleText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.equipmentContainer}>
              <Text style={styles.equipmentTitle}>Equipment Needed</Text>
              <View style={styles.equipmentList}>
                {exercise.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentBadge}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          {/* Instructions section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exercise.instructions.map((step, index) => (
              <View key={index} style={styles.instructionStep}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          
          {/* Form tips section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Form Tips</Text>
            {exercise.formTips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipIcon}>✓</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
          
          {/* Common mistakes section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Mistakes</Text>
            {exercise.commonMistakes.map((mistake, index) => (
              <View key={index} style={styles.mistakeItem}>
                <Text style={styles.mistakeIcon}>✗</Text>
                <Text style={styles.mistakeText}>{mistake}</Text>
              </View>
            ))}
          </View>
          
          {/* Benefits section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>•</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Variations section */}
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
          
          {/* Images gallery */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.galleryContainer}
            >
              {exercise.images.map((image, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => handleImagePress(index)}
                >
                  <Image 
                    source={{ uri: image }} 
                    style={styles.galleryImage} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Related exercises section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Exercises</Text>
            <View style={styles.relatedExercisesContainer}>
              {exercise.relatedExercises.map((relatedExercise, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.relatedExercise}
                  onPress={() => {
                    // In a real app, you would navigate to the selected exercise
                    console.log(`Navigate to ${relatedExercise}`);
                  }}
                >
                  <Text style={styles.relatedExerciseText}>{relatedExercise}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Video demonstration modal */}
      <Modal
        visible={videoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>
                Video Player
                {'\n'}
                (In a real app, this would be a video player component)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVideoModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Image viewer modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: exercise.images[selectedImageIndex] }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerContent: {
    marginBottom: 20,
  },
  difficultyBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerCategory: {
    color: '#fff',
    fontSize: 16,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '70%',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  mainContent: {
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 20,
  },
  musclesContainer: {
    marginBottom: 20,
  },
  muscleGroup: {
    marginBottom: 16,
  },
  muscleGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  muscleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  secondaryMuscleBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  muscleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  equipmentContainer: {
    marginBottom: 10,
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentBadge: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    color: '#4CAF50',
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mistakeIcon: {
    color: '#F44336',
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  mistakeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  variationItem: {
    backgroundColor: '#F9F9F9',
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
    color: '#333',
  },
  variationDifficultyBadge: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  variationDifficultyText: {
    fontSize: 10,
    color: '#333',
  },
  variationDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  galleryContainer: {
    flexDirection: 'row',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  relatedExercisesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relatedExercise: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  relatedExerciseText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '90%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  fullscreenImage: {
    width: width,
    height: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailScreen;