import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Define the shape of a notification
interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'workout' | 'class' | 'achievement' | 'generic';
  timestamp: Date;
  read: boolean;
  referenceId?: string;
}

// Define the context type
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
});

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications when component mounts
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('appNotifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications).map((notification: any) => ({
            ...notification,
            timestamp: new Date(notification.timestamp)
          }));
          setNotifications(parsedNotifications);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  // Calculate unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Save notifications to storage
  const saveNotificationsToStorage = async (updatedNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(
        'appNotifications', 
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = (newNotification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      timestamp: new Date(),
      read: false
    };

    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    saveNotificationsToStorage(updatedNotifications);
  };

  // Mark a specific notification as read
  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );

    setNotifications(updatedNotifications);
    saveNotificationsToStorage(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification, 
      read: true
    }));

    setNotifications(updatedNotifications);
    saveNotificationsToStorage(updatedNotifications);
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    AsyncStorage.removeItem('appNotifications');
  };

  // Context value
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;