import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Sample user data - in a real app, this would come from your authentication system
  const [userData, setUserData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@example.com',
    memberSince: 'March 2023',
    fitnessLevel: 'Intermediate',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  });

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [metricUnits, setMetricUnits] = useState(true);

  // Stats data
  const stats = [
    { label: 'Workouts', value: '24' },
    { label: 'Classes', value: '12' },
    { label: 'Streak', value: '8 days' },
  ];

  // Menu items
  const menuItems = [
    { title: 'Edit Profile', icon: '👤', screen: 'EditProfile' },
    { title: 'My Subscription', icon: '⭐', screen: 'Subscription' },
    { title: 'Workout History', icon: '📊', screen: 'WorkoutHistory' },
    { title: 'Achievements', icon: '🏆', screen: 'Achievements' },
    { title: 'Help Center', icon: '❓', screen: 'HelpCenter' },
    { title: 'About', icon: 'ℹ️', screen: 'About' },
  ];

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      // Router will handle navigation to login screen through AuthContext
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: userData.profileImage }} 
            style={styles.profileImage} 
          />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.memberSince}>Member since: {userData.memberSince}</Text>
          
          <View style={styles.fitnessLevelBadge}>
            <Text style={styles.fitnessLevelText}>{userData.fitnessLevel}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Use Metric Units</Text>
            <Switch
              value={metricUnits}
              onValueChange={setMetricUnits}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => router.push(`/${item.screen.toLowerCase()}`)}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  fitnessLevelBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  fitnessLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#444',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#444',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 24,
  },
});