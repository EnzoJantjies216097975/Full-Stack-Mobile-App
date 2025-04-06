import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Sample workout data
const workoutPrograms = [
  {
    id: '1',
    title: 'Full Body HIIT',
    level: 'Intermediate',
    duration: '30 min',
    exercises: 8,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'
  },
  {
    id: '2',
    title: 'Upper Body Strength',
    level: 'Advanced',
    duration: '45 min',
    exercises: 12,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'
  },
  {
    id: '3',
    title: 'Beginner Cardio',
    level: 'Beginner',
    duration: '20 min',
    exercises: 6,
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798'
  }
];

export default function Workouts() {
  const router = useRouter();
  
  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => router.push({
        pathname: '/workout-detail',
        params: { id: item.id }
      })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.workoutImage}
      />
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <View style={styles.workoutDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="barbell-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.level}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="list-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.exercises} exercises</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Programs</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={workoutPrograms}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  listContainer: {
    padding: 16,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: a16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutImage: {
    width: '100%',
    height: 150,
  },
  workoutInfo: {
    padding: 16,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
});