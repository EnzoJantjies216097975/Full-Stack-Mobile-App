// src/screens/main/NutritionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, Title, FAB, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../services/firebase';
import { awsApiService } from '../../services/aws';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// Mock data for testing - replace with API calls in production
const mockNutritionData = {
  totalCalories: 1450,
  totalProtein: 95,
  totalCarbs: 120,
  totalFats: 50,
  meals: [
    {
      id: '1',
      name: 'Breakfast',
      time: '2023-09-30T08:00:00',
      calories: 450,
      protein: 25,
      carbs: 45,
      fats: 15,
      foods: [
        { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fats: 3, portion: 100 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0, portion: 100 },
        { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fats: 0, portion: 100 },
        { name: 'Almonds', calories: 95, protein: 4, carbs: 3, fats: 8, portion: 20 }
      ]
    },
    {
      id: '2',
      name: 'Lunch',
      time: '2023-09-30T12:30:00',
      calories: 550,
      protein: 35,
      carbs: 50,
      fats: 20,
      foods: [
        { name: 'Grilled Chicken', calories: 165, protein: 31, carbs: 0, fats: 3.6, portion: 100 },
        { name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 24, fats: 0.9, portion: 100 },
        { name: 'Mixed Vegetables', calories: 67, protein: 2, carbs: 13, fats: 0.5, portion: 100 }
      ]
    },
    {
      id: '3',
      name: 'Dinner',
      time: '2023-09-30T19:00:00',
      calories: 450,
      protein: 35,
      carbs: 25,
      fats: 15,
      foods: [
        { name: 'Salmon', calories: 206, protein: 22, carbs: 0, fats: 13, portion: 100 },
        { name: 'Quinoa', calories: 120, protein: 4, carbs: 21, fats: 2, portion: 100 },
        { name: 'Steamed Broccoli', calories: 55, protein: 3, carbs: 11, fats: 0.6, portion: 100 }
      ]
    }
  ]
};

const mockDailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fats: 65
};

const NutritionScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutritionData, setNutritionData] = useState(null);
  const [dailyGoals, setDailyGoals] = useState(mockDailyGoals);
  
  // Fetch nutrition data
  useEffect(() => {
    fetchNutritionData();
  }, [selectedDate]);
  
  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      
      // In a real app, fetch from API
      // For now, use mock data
      setNutritionData(mockNutritionData);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchNutritionData();
  };
  
  // Navigate to previous or next day
  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Date navigation */}
      <View style={styles.dateHeader}>
        <TouchableOpacity onPress={() => navigateDay(-1)}>
          <Ionicons name="chevron-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.dateTitle}>
          {moment(selectedDate).format('ddd, MMM D')}
        </Text>
        <TouchableOpacity 
          onPress={() => navigateDay(1)}
          disabled={moment(selectedDate).isSame(moment(), 'day')}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={moment(selectedDate).isSame(moment(), 'day') ? '#D1D5DB' : '#6B7280'} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calorie summary card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Calorie Summary</Title>
            <View style={styles.calorieContainer}>
              <View style={styles.calorieCircle}>
                <Text style={styles.calorieValue}>
                  {nutritionData?.totalCalories || 0}
                </Text>
                <Text style={styles.calorieLabel}>kcal</Text>
              </View>
              <View style={styles.calorieInfo}>
                <Text style={styles.calorieGoal}>
                  Goal: {dailyGoals.calories} kcal
                </Text>
                <ProgressBar
                  progress={Math.min((nutritionData?.totalCalories || 0) / dailyGoals.calories, 1)}
                  color="#4F46E5"
                  style={styles.calorieProgress}
                />
                <Text style={styles.calorieRemaining}>
                  {Math.max(dailyGoals.calories - (nutritionData?.totalCalories || 0), 0)} kcal remaining
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Macronutrients card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Macronutrients</Title>
            
            {/* Macro progress bars */}
            <View style={styles.macroContainer}>
              <Text style={styles.macroTitle}>Protein</Text>
              <View style={styles.macroRow}>
                <View style={styles.macroProgressContainer}>
                  <ProgressBar
                    progress={Math.min((nutritionData?.totalProtein || 0) / dailyGoals.protein, 1)}
                    color="#4F46E5"
                    style={styles.macroProgress}
                  />
                </View>
                <Text style={styles.macroValue}>
                  {nutritionData?.totalProtein || 0}/{dailyGoals.protein}g
                </Text>
              </View>
              
              <Text style={styles.macroTitle}>Carbs</Text>
              <View style={styles.macroRow}>
                <View style={styles.macroProgressContainer}>
                  <ProgressBar
                    progress={Math.min((nutritionData?.totalCarbs || 0) / dailyGoals.carbs, 1)}
                    color="#10B981"
                    style={styles.macroProgress}
                  />
                </View>
                <Text style={styles.macroValue}>
                  {nutritionData?.totalCarbs || 0}/{dailyGoals.carbs}g
                </Text>
              </View>
              
              <Text style={styles.macroTitle}>Fats</Text>
              <View style={styles.macroRow}>
                <View style={styles.macroProgressContainer}>
                  <ProgressBar
                    progress={Math.min((nutritionData?.totalFats || 0) / dailyGoals.fats, 1)}
                    color="#F59E0B"
                    style={styles.macroProgress}
                  />
                </View>
                <Text style={styles.macroValue}>
                  {nutritionData?.totalFats || 0}/{dailyGoals.fats}g
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Meals section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meals</Text>
        </View>
        
        {nutritionData?.meals?.length > 0 ? (
          nutritionData.meals.map((meal) => (
            <Card
              key={meal.id}
              style={styles.mealCard}
              onPress={() => navigation.navigate('MealDetail', { mealId: meal.id })}
            >
              <Card.Content>
                <View style={styles.mealHeader}>
                  <View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealTime}>
                      {moment(meal.time).format('h:mm A')}
                    </Text>
                  </View>
                  <View style={styles.mealCalories}>
                    <Text style={styles.mealCalorieValue}>{Math.round(meal.calories)}</Text>
                    <Text style={styles.mealCalorieLabel}>kcal</Text>
                  </View>
                </View>
                
                <View style={styles.macroTags}>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroTagText}>P: {Math.round(meal.protein)}g</Text>
                  </View>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroTagText}>C: {Math.round(meal.carbs)}g</Text>
                  </View>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroTagText}>F: {Math.round(meal.fats)}g</Text>
                  </View>
                </View>
                
                {meal.foods.length > 0 && (
                  <View style={styles.foodList}>
                    {meal.foods.slice(0, 3).map((food, index) => (
                      <View key={index} style={styles.foodItem}>
                        <Text style={styles.foodName} numberOfLines={1}>
                          {food.name}
                        </Text>
                        <Text style={styles.foodCalories}>
                          {Math.round(food.calories * (food.portion / 100))} kcal
                        </Text>
                      </View>
                    ))}
                    
                    {meal.foods.length > 3 && (
                      <Text style={styles.moreFoodsText}>
                        +{meal.foods.length - 3} more items
                      </Text>
                    )}
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="nutrition-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No meals recorded for this day</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add a meal
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* FAB to add new meal */}
      <FAB
        style={styles.fab}
        icon="plus"
        color="#FFFFFF"
        onPress={() => navigation.navigate('AddMeal', { date: selectedDate })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  calorieInfo: {
    flex: 1,
  },
  calorieGoal: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  calorieProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  calorieRemaining: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  macroContainer: {
    marginTop: 8,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroProgressContainer: {
    flex: 1,
    marginRight: 12,
  },
  macroProgress: {
    height: 8,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 70,
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  mealCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  mealTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  mealCalories: {
    alignItems: 'center',
  },
  mealCalorieValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  mealCalorieLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  macroTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  macroTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  macroTagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  foodList: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    marginRight: 8,
  },
  foodCalories: {
    fontSize: 14,
    color: '#6B7280',
  },
  moreFoodsText: {
    fontSize: 14,
    color: '#4F46E5',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4F46E5',
  },
});

export default NutritionScreen;