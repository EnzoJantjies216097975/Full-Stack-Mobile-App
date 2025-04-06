import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../services/firebase';
import moment from 'moment';

const MealDetailScreen = ({ navigation, route }) => {
  const { mealId } = route.params;
  const { user } = useAuth();
  
  const [mealDetails, setMealDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMealDetails();
  }, [mealId]);
  
  const fetchMealDetails = async () => {
    try {
      // In a real app, you would fetch the specific meal by ID
      // For this example, we'll simulate fetching meal details
      const mockMealDetails = {
        id: mealId,
        type: 'Lunch',
        date: new Date().toISOString(),
        foods: [
          {
            name: 'Grilled Chicken Salad',
            calories: 350,
            protein: 35,
            carbs: 15,
            fats: 12
          },
          {
            name: 'Brown Rice',
            calories: 220,
            protein: 5,
            carbs: 45,
            fats: 2
          },
          {
            name: 'Mixed Vegetables',
            calories: 80,
            protein: 3,
            carbs: 15,
            fats: 0
          }
        ]
      };
      
      setMealDetails(mockMealDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meal details:', error);
      Alert.alert('Error', 'Failed to load meal details');
      setLoading(false);
    }
  };
  
  // Calculate total nutritional values
  const calculateTotals = () => {
    if (!mealDetails) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    return mealDetails.foods.reduce((totals, food) => ({
      calories: totals.calories + (parseFloat(food.calories) || 0),
      protein: totals.protein + (parseFloat(food.protein) || 0),
      carbs: totals.carbs + (parseFloat(food.carbs) || 0),
      fats: totals.fats + (parseFloat(food.fats) || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };
  
  // Delete meal
  const deleteMeal = () => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, you would delete the meal from Firestore
              // await firestoreService.deleteMeal(mealId);
              
              // Show success message and navigate back
              Alert.alert('Meal Deleted', 'The meal has been successfully removed.', [
                { 
                  text: 'OK', 
                  onPress: () => navigation.goBack() 
                }
              ]);
            } catch (error) {
              console.error('Error deleting meal:', error);
              Alert.alert('Error', 'Failed to delete meal. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading meal details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Compute totals
  const totals = calculateTotals();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Details</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={deleteMeal}
        >
          <Ionicons name="trash" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Type and Date */}
        <View style={styles.mealTypeContainer}>
          <Text style={styles.mealTypeText}>{mealDetails.type}</Text>
          <Text style={styles.mealDateText}>
            {moment(mealDetails.date).format('MMMM D, YYYY')}
          </Text>
        </View>
        
        {/* Nutritional Summary */}
        <View style={styles.nutritionalSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totals.calories}</Text>
            <Text style={styles.summaryLabel}>Calories</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totals.protein}g</Text>
            <Text style={styles.summaryLabel}>Protein</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totals.carbs}g</Text>
            <Text style={styles.summaryLabel}>Carbs</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totals.fats}g</Text>
            <Text style={styles.summaryLabel}>Fats</Text>
          </View>
        </View>
        
        {/* Food Items */}
        <View style={styles.foodItemsSection}>
          <Text style={styles.sectionTitle}>Food Items</Text>
          {mealDetails.foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <View style={styles.foodItemLeft}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodNutrients}>
                  {food.calories} cal • {food.protein}g P • {food.carbs}g C • {food.fats}g F
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Edit Meal Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('AddMeal', { 
            mealId: mealDetails.id, 
            mealData: mealDetails 
          })}
        >
          <Text style={styles.editButtonText}>Edit Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mealTypeContainer: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealTypeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  mealDateText: {
    fontSize: 14,
    color: '#666',
  },
  nutritionalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  foodItemsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodItemLeft: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  foodNutrients: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MealDetailScreen;