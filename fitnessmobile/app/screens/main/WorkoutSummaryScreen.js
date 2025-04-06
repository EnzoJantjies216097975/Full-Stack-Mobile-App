import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const WorkoutSummaryScreen = ({ navigation, route }) => {
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(20))[0];
  
  // In a real app, this data would come from route.params and your backend
  const [summary, setSummary] = useState({
    workoutId: '1234',
    workoutName: 'Full Body HIIT',
    date: new Date().toISOString(),
    duration: {
      minutes: 32,
      seconds: 15,
      planned: 30
    },
    calories: {
      burned: 345,
      planned: 320
    },
    exercises: [
      { 
        name: 'Jumping Jacks', 
        duration: '45 sec',
        completed: true,
        performance: 'great'
      },
      { 
        name: 'Push-ups', 
        duration: '45 sec',
        completed: true,
        performance: 'good'
      },
      { 
        name: 'Mountain Climbers', 
        duration: '45 sec',
        completed: true,
        performance: 'average'
      },
      { 
        name: 'Bodyweight Squats', 
        duration: '45 sec',
        completed: true,
        performance: 'great'
      },
      { 
        name: 'Burpees', 
        duration: '45 sec',
        completed: true,
        performance: 'good'
      },
      { 
        name: 'Plank', 
        duration: '45 sec',
        completed: true,
        performance: 'great'
      }
    ],
    achievements: [
      {
        type: 'streak',
        title: '3-Day Streak',
        description: 'You\'ve worked out for 3 days in a row!',
        icon: '🔥'
      },
      {
        type: 'personal_best',
        title: 'Personal Best',
        description: 'This is your best time for this workout!',
        icon: '🏆'
      }
    ],
    stats: {
      heartRate: {
        avg: 142,
        max: 168
      },
      pace: 'intense',
      totalSets: 6,
      restTime: '15 sec between exercises'
    },
    feedback: 'Great job! You pushed through the challenging parts and maintained good form throughout.',
    progress: {
      workoutsCompleted: 24,
      minutesThisWeek: 120,
      caloriesBurnedThisWeek: 1450
    }
  });

  // Start animations when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Format the workout date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Calculate overall performance score based on individual exercise performance
  const calculatePerformanceScore = () => {
    const performanceValues = { 
      'great': 3, 
      'good': 2, 
      'average': 1, 
      'poor': 0 
    };
    
    const totalScore = summary.exercises.reduce((acc, exercise) => {
      return acc + performanceValues[exercise.performance];
    }, 0);
    
    const maxPossibleScore = summary.exercises.length * 3;
    const percentageScore = (totalScore / maxPossibleScore) * 100;
    
    if (percentageScore >= 90) return { text: 'Excellent', color: '#4CAF50', emoji: '💪' };
    if (percentageScore >= 75) return { text: 'Great', color: '#8BC34A', emoji: '👍' };
    if (percentageScore >= 60) return { text: 'Good', color: '#FFC107', emoji: '😊' };
    return { text: 'Keep Improving', color: '#FF9800', emoji: '🙂' };
  };
  
  // Share workout summary
  const handleShare = async () => {
    try {
      const shareMessage = `I just completed the ${summary.workoutName} workout in ${summary.duration.minutes}m ${summary.duration.seconds}s and burned ${summary.calories.burned} calories! #FitnessApp #WorkoutComplete`;
      
      await Share.share({
        message: shareMessage,
        title: 'Workout Summary'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Navigate to workout details
  const viewWorkoutDetails = () => {
    // In a real app, you would navigate to the workout detail screen
    navigation.navigate('WorkoutDetailScreen', { workoutId: summary.workoutId });
  };
  
  // Navigate to home
  const goHome = () => {
    navigation.navigate('MainTab');
  };
  
  // Get the performance evaluation
  const performance = calculatePerformanceScore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with animated elements */}
        <Animated.View 
          style={[
            styles.header, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          <View style={styles.completionBadge}>
            <Text style={styles.completionEmoji}>✅</Text>
          </View>
          
          <Text style={styles.completionTitle}>Workout Complete!</Text>
          <Text style={styles.workoutName}>{summary.workoutName}</Text>
          <Text style={styles.workoutDate}>{formatDate(summary.date)}</Text>
        </Animated.View>
        
        {/* Performance Assessment */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Overall Performance</Text>
          <View 
            style={[
              styles.performanceBadge, 
              { backgroundColor: `${performance.color}20` } // 20% opacity version of the color
            ]}
          >
            <Text style={styles.performanceEmoji}>{performance.emoji}</Text>
            <Text style={[styles.performanceText, { color: performance.color }]}>
              {performance.text}
            </Text>
          </View>
        </View>
        
        {/* Summary Cards */}
        <View style={styles.summaryCardsContainer}>
          {/* Duration Card */}
          <View style={[styles.summaryCard, styles.cardTime]}>
            <Text style={styles.cardIcon}>⏱️</Text>
            <Text style={styles.cardValue}>{summary.duration.minutes}:{summary.duration.seconds.toString().padStart(2, '0')}</Text>
            <Text style={styles.cardLabel}>Duration</Text>
            <View style={styles.comparisonContainer}>
              <Text style={styles.comparisonValue}>
                {summary.duration.minutes > summary.duration.planned ? '+' : ''}
                {summary.duration.minutes - summary.duration.planned} min
              </Text>
              <Text style={styles.comparisonLabel}>vs planned</Text>
            </View>
          </View>
          
          {/* Calories Card */}
          <View style={[styles.summaryCard, styles.cardCalories]}>
            <Text style={styles.cardIcon}>🔥</Text>
            <Text style={styles.cardValue}>{summary.calories.burned}</Text>
            <Text style={styles.cardLabel}>Calories</Text>
            <View style={styles.comparisonContainer}>
              <Text style={styles.comparisonValue}>
                {summary.calories.burned > summary.calories.planned ? '+' : ''}
                {summary.calories.burned - summary.calories.planned} kcal
              </Text>
              <Text style={styles.comparisonLabel}>vs planned</Text>
            </View>
          </View>
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Workout Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.stats.heartRate.avg}</Text>
              <Text style={styles.statLabel}>Avg HR (bpm)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.stats.heartRate.max}</Text>
              <Text style={styles.statLabel}>Max HR (bpm)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.stats.pace}</Text>
              <Text style={styles.statLabel}>Pace</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.stats.totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
          </View>
          
          <Text style={styles.restTimeText}>Rest time: {summary.stats.restTime}</Text>
        </View>
        
        {/* Exercises Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises Completed</Text>
          
          {summary.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseCount}>{index + 1}</Text>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                </View>
              </View>
              
              <View 
                style={[
                  styles.performanceIndicator, 
                  {
                    backgroundColor: 
                      exercise.performance === 'great' ? '#4CAF5020' :
                      exercise.performance === 'good' ? '#8BC34A20' :
                      exercise.performance === 'average' ? '#FFC10720' : '#FF980020'
                  }
                ]}
              >
                <Text style={[
                  styles.performanceIndicatorText,
                  {
                    color: 
                      exercise.performance === 'great' ? '#4CAF50' :
                      exercise.performance === 'good' ? '#8BC34A' :
                      exercise.performance === 'average' ? '#FFC107' : '#FF9800'
                  }
                ]}>
                  {exercise.performance.charAt(0).toUpperCase() + exercise.performance.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Achievements Section */}
        {summary.achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements Unlocked</Text>
            
            {summary.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coach Feedback</Text>
          <Text style={styles.feedbackText}>{summary.feedback}</Text>
        </View>
        
        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{summary.progress.workoutsCompleted}</Text>
              <Text style={styles.progressLabel}>Total Workouts</Text>
            </View>
            
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{summary.progress.minutesThisWeek}</Text>
              <Text style={styles.progressLabel}>Minutes This Week</Text>
            </View>
            
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{summary.progress.caloriesBurnedThisWeek}</Text>
              <Text style={styles.progressLabel}>Calories This Week</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={viewWorkoutDetails}
        >
          <Text style={styles.viewDetailsButtonText}>View Workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Share Results</Text>
        </TouchableOpacity>
      </View>
      
      {/* Home Button */}
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={goHome}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Extra padding for bottom buttons
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  completionBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionEmoji: {
    fontSize: 30,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#777',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  performanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  performanceEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  performanceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: width / 2 - 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTime: {
    backgroundColor: '#E3F2FD',
  },
  cardCalories: {
    backgroundColor: '#FFF3E0',
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  comparisonContainer: {
    alignItems: 'center',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#777',
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statItem: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  restTimeText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    width: 25,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#777',
  },
  performanceIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  performanceIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  progressItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  viewDetailsButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  homeButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WorkoutSummaryScreen;