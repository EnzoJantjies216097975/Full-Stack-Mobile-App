import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for classes
const SAMPLE_CLASSES = [
  {
    id: '1',
    title: 'Morning Yoga',
    instructor: 'Sarah Johnson',
    time: '7:00 AM - 8:00 AM',
    day: 'Monday, Wednesday, Friday',
    level: 'Beginner',
    spotsLeft: 5
  },
  {
    id: '2',
    title: 'HIIT Workout',
    instructor: 'Mike Thompson',
    time: '5:30 PM - 6:15 PM',
    day: 'Tuesday, Thursday',
    level: 'Intermediate',
    spotsLeft: 3
  },
  {
    id: '3',
    title: 'Strength Training 101',
    instructor: 'Chris Davis',
    time: '6:30 PM - 7:30 PM',
    day: 'Monday, Wednesday',
    level: 'Beginner',
    spotsLeft: 8
  },
  {
    id: '4',
    title: 'Advanced Pilates',
    instructor: 'Emily Wilson',
    time: '9:00 AM - 10:00 AM',
    day: 'Saturday',
    level: 'Advanced',
    spotsLeft: 2
  }
];

const ClassesScreen = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setClasses(SAMPLE_CLASSES);
      setLoading(false);
    }, 1000);
  }, []);

  // Render each class item
  const renderClassItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.classCard}
      onPress={() => console.log(`Selected class: ${item.title}`)}
    >
      <View style={styles.classHeader}>
        <Text style={styles.classTitle}>{item.title}</Text>
        <View style={[
          styles.levelBadge, 
          item.level === 'Beginner' ? styles.beginnerBadge :
          item.level === 'Intermediate' ? styles.intermediateBadge :
          styles.advancedBadge
        ]}>
          <Text style={styles.levelText}>{item.level}</Text>
        </View>
      </View>
      
      <Text style={styles.instructorText}>with {item.instructor}</Text>
      <Text style={styles.scheduleText}>{item.time}</Text>
      <Text style={styles.scheduleText}>{item.day}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.spotsText}>
          {item.spotsLeft} {item.spotsLeft === 1 ? 'spot' : 'spots'} left
        </Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Fitness Classes</Text>
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading classes...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>Find and book your next workout session</Text>
          <FlatList
            data={classes}
            renderItem={renderClassItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  beginnerBadge: {
    backgroundColor: '#E0F7FA',
  },
  intermediateBadge: {
    backgroundColor: '#FFF9C4',
  },
  advancedBadge: {
    backgroundColor: '#FFCCBC',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  instructorText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  spotsText: {
    fontSize: 14,
    color: '#e65100',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default ClassesScreen;