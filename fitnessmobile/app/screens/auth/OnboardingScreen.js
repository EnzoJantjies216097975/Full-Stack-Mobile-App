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
  
  // State for tracking current slide index
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
    // ... rest of the slides remain the same
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
      // Scroll to next slide
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      
      // Update current index
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      // Complete onboarding and navigate to main app
      completeOnboarding();
    }
  };
  
  // Navigate to previous screen
  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Scroll to previous slide
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      
      // Update current index
      setCurrentIndex(prevIndex => prevIndex - 1);
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
        {/* Slide content remains the same */}
        {item.image && (
          <Image 
            source={item.image} 
            style={styles.slideImage}
            resizeMode="contain"
          />
        )}
        
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
        
        {/* Slide-specific content remains the same */}
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
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
        scrollEnabled={false}
      />
      
      {/* Pagination and Navigation Buttons */}
      {/* Rest of the component remains the same */}
    </SafeAreaView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  // ... previous styles
});

export default OnboardingScreen;