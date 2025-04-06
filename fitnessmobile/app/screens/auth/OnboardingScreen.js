import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  // Refs for the scroll functionality
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // State for onboarding data
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userData, setUserData] = useState({
    fitnessLevel: '',
    fitnessGoals: [],
    weight: '',
    height: '',
    age: '',
  });
  
  // Onboarding screens data
  const slides = [
    {
      id: '1',
      title: 'Welcome to FitLife',
      description: 'Your personal fitness journey starts here. Let\'s set up your profile to customize your experience.',
      image: require('../../assets/onboarding-welcome.png'),
      type: 'welcome',
    },
    {
      id: '2',
      title: 'What\'s Your Fitness Level?',
      description: 'Help us understand where you are in your fitness journey.',
      type: 'fitnessLevel',
      options: [
        { id: 'beginner', label: 'Beginner', description: 'New to fitness or returning after a long break' },
        { id: 'intermediate', label: 'Intermediate', description: 'Consistent with workouts for several months' },
        { id: 'advanced', label: 'Advanced', description: 'Very active with structured training' },
      ],
    },
    {
      id: '3',
      title: 'What Are Your Goals?',
      description: 'Select all that apply to you. We\'ll customize your experience based on your goals.',
      type: 'fitnessGoals',
      options: [
        { id: 'loseWeight', label: 'Lose Weight', icon: '⚖️' },
        { id: 'buildMuscle', label: 'Build Muscle', icon: '💪' },
        { id: 'increaseEndurance', label: 'Increase Endurance', icon: '🏃‍♂️' },
        { id: 'improveFlexibility', label: 'Improve Flexibility', icon: '🧘‍♀️' },
        { id: 'reduceStress', label: 'Reduce Stress', icon: '🧠' },
        { id: 'improveHealth', label: 'Improve Overall Health', icon: '❤️' },
      ],
    },
    {
      id: '4',
      title: 'Basic Information',
      description: 'We\'ll use this to personalize your workouts and track your progress.',
      type: 'basicInfo',
    },
    {
      id: '5',
      title: 'You\'re All Set!',
      description: 'Your personalized fitness journey awaits. Let\'s start achieving your goals together.',
      image: require('../../assets/onboarding-complete.png'),
      type: 'complete',
    },
  ];
  
  // Handle fitness level selection
  const handleFitnessLevelSelect = (level) => {
    setUserData({ ...userData, fitnessLevel: level });
  };
  
  // Handle fitness goals selection (multiple choice)
  const handleGoalSelect = (goalId) => {
    const goals = [...userData.fitnessGoals];
    
    if (goals.includes(goalId)) {
      // Remove goal if already selected
      const index = goals.indexOf(goalId);
      goals.splice(index, 1);
    } else {
      // Add goal if not already selected
      goals.push(goalId);
    }
    
    setUserData({ ...userData, fitnessGoals: goals });
  };
  
  // Handle input change for basic info
  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };
  
  // Navigate to next screen
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Complete onboarding and navigate to main app
      completeOnboarding();
    }
  };
  
  // Navigate to previous screen
  const handlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };
  
  // Handle onboarding completion
  const completeOnboarding = () => {
    // In a real app, you would save the user data here
    console.log('Onboarding completed with user data:', userData);
    
    // Navigate to the main app
    navigation.navigate('MainStack');
  };
  
  // Check if the next button should be disabled
  const isNextDisabled = () => {
    const currentSlide = slides[currentIndex];
    
    switch (currentSlide.type) {
      case 'fitnessLevel':
        return !userData.fitnessLevel;
      case 'fitnessGoals':
        return userData.fitnessGoals.length === 0;
      case 'basicInfo':
        return !userData.weight || !userData.height || !userData.age;
      default:
        return false;
    }
  };
  
  // Render each onboarding slide
  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        {item.image && (
          <Image 
            source={item.image} 
            style={styles.slideImage}
            resizeMode="contain"
          />
        )}
        
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
        
        {/* Fitness Level Selection */}
        {item.type === 'fitnessLevel' && (
          <View style={styles.optionsContainer}>
            {item.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.levelOption,
                  userData.fitnessLevel === option.id && styles.selectedLevelOption,
                ]}
                onPress={() => handleFitnessLevelSelect(option.id)}
              >
                <Text style={[
                  styles.levelOptionLabel,
                  userData.fitnessLevel === option.id && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.levelOptionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Fitness Goals Selection */}
        {item.type === 'fitnessGoals' && (
          <View style={styles.goalsContainer}>
            {item.options.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  userData.fitnessGoals.includes(goal.id) && styles.selectedGoalOption,
                ]}
                onPress={() => handleGoalSelect(goal.id)}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={[
                  styles.goalLabel,
                  userData.fitnessGoals.includes(goal.id) && styles.selectedOptionText,
                ]}>
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Basic Information Form */}
        {item.type === 'basicInfo' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Years"
                value={userData.age}
                onChangeText={(text) => handleInputChange('age', text)}
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.input}
                placeholder="kg"
                value={userData.weight}
                onChangeText={(text) => handleInputChange('weight', text)}
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                style={styles.input}
                placeholder="cm"
                value={userData.height}
                onChangeText={(text) => handleInputChange('height', text)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        )}
      </View>
    );
  };
  
  // Render pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={i}
              style={[
                styles.paginationDot,
                { width: dotWidth, opacity },
                i === currentIndex && styles.activePaginationDot,
              ]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        scrollEnabled={false}
      />
      
      {renderPagination()}
      
      <View style={styles.buttonsContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handlePrevious}
          >
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            isNextDisabled() && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={completeOnboarding}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: '#4CAF50',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  previousButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  previousButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: currentIndex > 0 ? 8 : 0,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
  },
  optionsContainer: {
    width: '100%',
    marginTop: 16,
  },
  levelOption: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedLevelOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  levelOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  levelOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#2E7D32',
  },
  goalsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  goalOption: {
    width: '48%',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedGoalOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});

export default OnboardingScreen;