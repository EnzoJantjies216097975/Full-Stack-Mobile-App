import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../app/contexts/AuthContext';

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    metrics: true,
    privacyMode: false,
    soundEffects: true,
  });
  
  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);
  
  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  // Save settings to AsyncStorage
  const saveSettings = async (updatedSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  // Toggle a specific setting
  const toggleSetting = (setting) => {
    const updatedSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };
  
  // Render a settings toggle item
  const renderToggleItem = (title, description, setting) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[setting]}
        onValueChange={() => toggleSetting(setting)}
        trackColor={{ false: "#767577", true: "#4CAF50" }}
        thumbColor={settings[setting] ? "#fff" : "#f4f3f4"}
      />
    </View>
  );
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            // Navigation to login screen is handled by AuthContext
          }
        }
      ]
    );
  };
  
  // Open external links
  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };
  
  // Render a navigation item
  const renderNavItem = (title, icon, onPress) => (
    <TouchableOpacity 
      style={styles.navItem}
      onPress={onPress}
    >
      <View style={styles.navItemContent}>
        <Ionicons name={icon} size={24} color="#4F46E5" />
        <Text style={styles.navItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Ionicons name="create-outline" size={24} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          {renderToggleItem(
            'Notifications', 
            'Receive push notifications for workouts, classes, and achievements',
            'notifications'
          )}
          
          {renderToggleItem(
            'Dark Mode', 
            'Switch between light and dark app themes',
            'darkMode'
          )}
          
          {renderToggleItem(
            'Metric Units', 
            'Use metric (kg, cm) instead of imperial units',
            'metrics'
          )}
          
          {renderToggleItem(
            'Privacy Mode', 
            'Hide sensitive information on shared screens',
            'privacyMode'
          )}
          
          {renderToggleItem(
            'Sound Effects', 
            'Enable sound feedback during workouts and interactions',
            'soundEffects'
          )}
        </View>
        
        {/* Account Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderNavItem(
            'Subscription', 
            'card-outline', 
            () => router.push('/subscription')
          )}
          
          {renderNavItem(
            'Connected Accounts', 
            'link-outline', 
            () => router.push('/connected-accounts')
          )}
          
          {renderNavItem(
            'Change Password', 
            'lock-closed-outline', 
            () => router.push('/change-password')
          )}
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderNavItem(
            'Help Center', 
            'help-circle-outline', 
            () => openExternalLink('https://support.fitnessapp.com')
          )}
          
          {renderNavItem(
            'Contact Support', 
            'mail-outline', 
            () => openExternalLink('mailto:support@fitnessapp.com')
          )}
          
          {renderNavItem(
            'Rate the App', 
            'star-outline', 
            () => openExternalLink('https://app.store/fitnessapp')
          )}
        </View>
        
        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          {renderNavItem(
            'Privacy Policy', 
            'document-text-outline', 
            () => openExternalLink('https://fitnessapp.com/privacy')
          )}
          
          {renderNavItem(
            'Terms of Service', 
            'shield-checkmark-outline', 
            () => openExternalLink('https://fitnessapp.com/terms')
          )}
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF5252" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        {/* App Version */}
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
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
    paddingBottom: 32,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  logoutButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 16,
  },
});