import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../app/contexts/AuthContext';

export default function AddMeal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get the date from params or use today's date
  const [date] = useState(params.date ? new Date(params.date as string) : new Date());
  
  // State for meal details
  const [mealType, setMealType] = useState('');
  const [foods, setFoods] = useState([
    { name: '', calories: '', protein: '', carbs: '', fats: '' }
  ]);
  
  // Meal type options
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  // Add a new food item
  const addFoodItem = () => {
    setFoods([
      ...foods, 
      { name: '', calories: '', protein: '', carbs: '', fats: '' }
    ]);
  };
  
  // Update a specific food item
  const updateFoodItem = (index: number, field: string, value: string) => {
    const newFoods = [...foods];
    newFoods[index][field] = value;
    setFoods(newFoods);
  };
  
  // Remove a food item
  const removeFoodItem = (index: number) => {
    const newFoods = foods.filter((_, i) => i !== index);
    setFoods(newFoods);
  };
  
  // Save meal
  const saveMeal = async () => {
    // Validate inputs
    if (!mealType) {
      Alert.alert('Error', 'Please select a meal type');
      return;
    }
    
    // Validate at least one food item
    const validFoods = foods.filter(food => food.name.trim() !== '');
    if (validFoods.length === 0) {
      Alert.alert('Error', 'Please add at least one food item');
      return;
    }
    
    try {
      // Prepare meal data
      const mealData = {
        type: mealType,
        date: date.toISOString(),
        foods: validFoods.map(food => ({
          name: food.name,
          calories: parseFloat(food.calories) || 0,
          protein: parseFloat(food.protein) || 0,
          carbs: parseFloat(food.carbs) || 0,
          fats: parseFloat(food.fats) || 0
        }))
      };
      
      // In a real app, you would save to a database here
      console.log('Saving meal data:', mealData);
      
      // Show success and navigate back
      Alert.alert(
        'Meal Added', 
        'Your meal has been successfully recorded.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save meal. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Meal</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeContainer}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  mealType === type && styles.selectedMealTypeButton
                ]}
                onPress={() => setMealType(type)}
              >
                <Text 
                  style={[
                    styles.mealTypeText,
                    mealType === type && styles.selectedMealTypeText
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Food Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Food Items</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addFoodItem}
            >
              <Ionicons name="add" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          {foods.map((food, index) => (
            <View key={index} style={styles.foodItemContainer}>
              <TextInput
                style={styles.input}
                placeholder="Food Name"
                value={food.name}
                onChangeText={(text) => updateFoodItem(index, 'name', text)}
              />
              
              <View style={styles.nutritionInputContainer}>
                <TextInput
                  style={styles.nutritionInput}
                  placeholder="Calories"
                  keyboardType="numeric"
                  value={food.calories}
                  onChangeText={(text) => updateFoodItem(index, 'calories', text)}
                />
                <TextInput
                  style={styles.nutritionInput}
                  placeholder="Protein (g)"
                  keyboardType="numeric"
                  value={food.protein}
                  onChangeText={(text) => updateFoodItem(index, 'protein', text)}
                />
                <TextInput
                  style={styles.nutritionInput}
                  placeholder="Carbs (g)"
                  keyboardType="numeric"
                  value={food.carbs}
                  onChangeText={(text) => updateFoodItem(index, 'carbs', text)}
                />
                <TextInput
                  style={styles.nutritionInput}
                  placeholder="Fats (g)"
                  keyboardType="numeric"
                  value={food.fats}
                  onChangeText={(text) => updateFoodItem(index, 'fats', text)}
                />
              </View>
              
              {foods.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFoodItem(index)}
                >
                  <Ionicons name="trash" size={20} color="#FF5252" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveMeal}
        >
          <Text style={styles.saveButtonText}>Save Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedMealTypeButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  mealTypeText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedMealTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  foodItemContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  nutritionInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    fontSize: 12,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});