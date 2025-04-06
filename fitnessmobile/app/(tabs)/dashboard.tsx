import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import moment from 'moment';

// Mock data - replace with actual API calls in production
const mockData = {
  currentProgram: {
    id: '1',
    name: 'Summer Shred Challenge',
    progress: 45
  },
  upcomingClasses: [
    {
      id: '1',
      title: 'HIIT Cardio',
      dateTime: '2023-09-30T10:00:00',
      duration: 45,
      trainerName: 'John Smith'
    },
    {
      id: '2',
      title: 'Yoga Flow',
      dateTime: '2023-10-01T18:00:00',
      duration: 60,
      trainerName: 'Sarah Johnson'
    }
  ],
  weeklyStats: {
    workoutsCompleted: 3,
    totalMinutes: 120,
    caloriesBurned: 550
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkForInProgressWorkout } = useWorkout();
  
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(mockData);
  
  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    checkForInProgressWorkout();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      // In a real app, fetch data from API
      // For now, just use mock data
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || 'there'}</Text>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>
        
        {/* Weekly progress card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Weekly Workout Progress</Title>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={dashboardData.weeklyStats.workoutsCompleted / 5}
                color="#4F46E5"
                style={styles.progressBar}
              />
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>
                  {dashboardData.weeklyStats.workoutsCompleted}/5 workouts
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round((dashboardData.weeklyStats.workoutsCompleted / 5) * 100)}%
                </Text>
              </View>
            </View>
            
            {/* Weekly stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={24} color="#4F46E5" />
                <Paragraph style={styles.statValue}>
                  {dashboardData.weeklyStats.totalMinutes}
                </Paragraph>
                <Paragraph style={styles.statLabel}>Minutes</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={24} color="#4F46E5" />
                <Paragraph style={styles.statValue}>
                  {dashboardData.weeklyStats.caloriesBurned}
                </Paragraph>
                <Paragraph style={styles.statLabel}>Calories</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="fitness-outline" size={24} color="#4F46E5" />
                <Paragraph style={styles.statValue}>
                  {dashboardData.weeklyStats.workoutsCompleted}
                </Paragraph>
                <Paragraph style={styles.statLabel}>Workouts</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Current program card */}
        {dashboardData.currentProgram && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Current Program</Title>
              <Paragraph style={styles.programName}>
                {dashboardData.currentProgram.name}
              </Paragraph>
              <View style={styles.programProgress}>
                <ProgressBar
                  progress={dashboardData.currentProgram.progress / 100}
                  color="#4F46E5"
                  style={styles.progressBar}
                />
                <Paragraph style={styles.programProgressText}>
                  {dashboardData.currentProgram.progress}% complete
                </Paragraph>
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                onPress={() => router.push({
                  pathname: '/workout-detail',
                  params: { id: dashboardData.currentProgram.id }
                })}
                color="#4F46E5"
              >
                Continue Program
              </Button>
            </Card.Actions>
          </Card>
        )}
        
        {/* Upcoming classes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          <TouchableOpacity onPress={() => router.push('/classes')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {dashboardData.upcomingClasses?.length > 0 ? (
          dashboardData.upcomingClasses.map((classItem) => (
            <Card
              key={classItem.id}
              style={styles.classCard}
              onPress={() => router.push({
                pathname: '/class-detail',
                params: { id: classItem.id }
              })}
            >
              <Card.Content style={styles.classContent}>
                <View style={styles.classDetails}>
                  <Text style={styles.classTitle}>{classItem.title}</Text>
                  <Text style={styles.classDate}>
                    {moment(classItem.dateTime).format('ddd, MMM D • h:mm A')}
                  </Text>
                  <Text style={styles.classDuration}>
                    {classItem.duration} minutes with {classItem.trainerName}
                  </Text>
                </View>
                <Ionicons name="videocam-outline" size={28} color="#4F46E5" />
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>No upcoming classes</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationButton: {
    padding: 8,
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
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  programProgress: {
    marginTop: 8,
  },
  programProgressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  classCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  classContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classDetails: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  classDate: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  classDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginVertical: 16,
  },
});