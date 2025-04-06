import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Define the shape of a notification
interface Notification {
  id: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// Define the context state and methods
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  pushToken: string | null;
  requestPermissions: () => Promise<boolean>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  pushToken: null,
  requestPermissions: async () => false,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
  sendLocalNotification: async () => {},
});

// Set up notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Provider component that wraps your app and makes notification context available
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushToken, setPushToken] = useState<string | null>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Register for push notifications when the component mounts
  useEffect(() => {
    registerForPushNotifications();
    
    // Set up a listener for incoming notifications when the app is running
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;
      
      if (title) {
        const newNotification: Notification = {
          id: notification.request.identifier,
          title: title,
          body: body || '',
          data: data,
          read: false,
          createdAt: new Date(),
        };
        
        setNotifications(prevNotifications => 
          [newNotification, ...prevNotifications]
        );
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  // Request permission and register for push notifications
  const registerForPushNotifications = async () => {
    try {
      // Check if we're running on a physical device
      if (Constants.isDevice) {
        // Request permission
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return;
        }
        
        // Get the token
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        
        setPushToken(tokenData.data);
        
        // Required for Android
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      } else {
        console.log('Must use physical device for push notifications');
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  // Request notification permissions
  const requestPermissions = async () => {
    if (!Constants.isDevice) {
      return false;
    }
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Send a local notification
  const sendLocalNotification = async (title: string, body: string, data: any = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Immediately
    });
  };

  // Provide the context value
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    pushToken,
    requestPermissions,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    sendLocalNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;