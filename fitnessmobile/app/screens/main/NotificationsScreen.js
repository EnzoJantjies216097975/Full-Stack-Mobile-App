import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationsScreen = ({ navigation }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
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
            navigation.navigate('WorkoutDetail', { id: item.referenceId });
            break;
          case 'class':
            navigation.navigate('ClassDetail', { id: item.referenceId });
            break;
          case 'achievement':
            navigation.navigate('Profile');
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
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (styles remain the same as in the previous implementation)
  // Copy the styles from the previous NotificationsScreen
});

export default NotificationsScreen;