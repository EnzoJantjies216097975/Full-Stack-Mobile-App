import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useNotifications } from '../app/contexts/NotificationContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Mock notification data
  const mockNotifications = [
    {
      id: '1',
      title: 'New Workout Available',
      message: 'Check out our new HIIT workout program designed to help you burn calories and build strength.',
      type: 'workout',
      referenceId: '101',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      title: 'Upcoming Class Reminder',
      message: 'Your Yoga Flow class with Sarah starts in 1 hour. Don\'t forget to bring your mat!',
      type: 'class',
      referenceId: '202',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true
    },
    {
      id: '3',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You\'ve completed 10 workouts this month and earned the "Consistent" badge.',
      type: 'achievement',
      referenceId: '303',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: false
    }
  ];
  
  // Filter notifications based on selected filter
  const filteredNotifications = mockNotifications.filter(notification => {
    if (selectedFilter === 'unread') return !notification.read;
    return true;
  });
  
  // Render individual notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => {
        // Mark notification as read
        markAsRead(item.id);
        
        // Handle navigation based on notification type
        switch(item.type) {
          case 'workout':
            router.push({
              pathname: '/workout-detail',
              params: { id: item.referenceId }
            });
            break;
          case 'class':
            router.push({
              pathname: '/class-detail',
              params: { id: item.referenceId }
            });
            break;
          case 'achievement':
            router.push('/profile');
            break;
          default:
            // For generic notifications, do nothing special
            break;
        }
      }}
    >
      {/* Notification icon based on type */}
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={
            item.type === 'workout' ? 'fitness' :
            item.type === 'class' ? 'calendar' :
            item.type === 'achievement' ? 'trophy' :
            'notifications'
          }
          size={24} 
          color="#4F46E5" 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text 
          style={[
            styles.notificationTitle,
            !item.read && styles.unreadTitle
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text 
          style={styles.notificationMessage}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {moment(item.timestamp).fromNow()}
        </Text>
      </View>
      
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
  
  // Render header with filter options
  const renderHeader = () => (
    <View style={styles.filterContainer}>
      {['all', 'unread'].map(filter => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            selectedFilter === filter && styles.activeFilterButton
          ]}
          onPress={() => setSelectedFilter(filter)}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedFilter === filter && styles.activeFilterButtonText
            ]}
          >
            {filter === 'all' ? 'All Notifications' : 'Unread'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  // Handle clearing all notifications
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to remove all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearNotifications();
            Alert.alert('Notifications Cleared', 'All notifications have been removed.');
          }
        }
      ]
    );
  };
  
  // Render empty state when no notifications
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="notifications-off" 
        size={64} 
        color="#E0E0E0" 
      />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => markAllAsRead()}
          >
            <Text style={styles.headerActionText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={handleClearAll}
          >
            <Text style={styles.headerActionText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Unread Count Badge */}
      {mockNotifications.filter(n => !n.read).length > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>
            {mockNotifications.filter(n => !n.read).length}
          </Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    marginLeft: 16,
  },
  headerActionText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterButton: {
    borderBottomColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    fontWeight: '600',
    color: '#4F46E5',
  },
  listContainer: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#F3F4F6',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 24,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    position: 'absolute',
    top: 18,
    right: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  unreadBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4F46E5',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});