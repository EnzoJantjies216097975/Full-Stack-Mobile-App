import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function ClassDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // In a real app, you would fetch class data based on the ID from route.params
  const [classData, setClassData] = useState({
    id: id || '1234',
    title: 'Morning Yoga Flow',
    description: 'Start your day with an energizing yoga flow that combines breathwork, gentle stretching, and dynamic movements to awaken your body and mind. This class is perfect for all levels and will help improve flexibility, strength, and mental clarity.',
    instructor: {
      id: 'ins123',
      name: 'Sarah Johnson',
      bio: 'Sarah is a certified yoga instructor with 8 years of experience. She specializes in vinyasa flow and mindfulness practices, helping her students build both physical strength and mental calm.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.8,
      reviewCount: 127
    },
    datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    duration: 45, // minutes
    level: 'All Levels',
    category: 'Yoga',
    maxParticipants: 20,
    currentParticipants: 12,
    location: 'Virtual (Zoom)',
    zoomLink: 'https://zoom.us/j/123456789',
    requirements: [
      'Yoga mat',
      'Comfortable clothing',
      'Water bottle',
      'Optional: yoga blocks or a pillow'
    ],
    benefits: [
      'Improved flexibility and balance',
      'Reduced stress and anxiety',
      'Enhanced focus and clarity',
      'Better posture and alignment',
      'Increased energy levels'
    ],
    isFavorite: false
  });

  const [isRegistrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [isJoinModalVisible, setJoinModalVisible] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(false);
  
  // Format the date and time
  const formatClassDate = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  const formatClassTime = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, 'h:mm a');
  };
  
  // Calculate percentage of spots filled
  const calculateSpotsPercentage = () => {
    return (classData.currentParticipants / classData.maxParticipants) * 100;
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    setClassData({
      ...classData,
      isFavorite: !classData.isFavorite
    });
  };
  
  // Handle booking the class
  const handleBookClass = () => {
    // For future classes
    setRegistrationModalVisible(true);
  };
  
  // Handle joining a live class
  const handleJoinClass = () => {
    // For classes happening now
    setJoinModalVisible(true);
  };
  
  // Confirm booking
  const confirmBooking = () => {
    setRegistrationModalVisible(false);
    Alert.alert(
      'Class Booked!',
      `You have successfully booked a spot in ${classData.title}. A confirmation has been sent to your email.`,
      [{ text: 'OK' }]
    );
    // In a real app, you would make an API call to book the class
    setClassData({
      ...classData,
      currentParticipants: classData.currentParticipants + 1
    });
  };
  
  // Join the class via Zoom
  const joinViaZoom = async () => {
    setJoinModalVisible(false);
    try {
      // In a real app, verify the link is valid before attempting to open
      const supported = await Linking.canOpenURL(classData.zoomLink);
      
      if (supported) {
        await Linking.openURL(classData.zoomLink);
      } else {
        Alert.alert('Error', 'Cannot open the Zoom link. Please make sure you have Zoom installed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while opening Zoom.');
    }
  };
  
  // Toggle reminder
  const toggleReminder = () => {
    // In a real app, you would set up a push notification here
    setIsReminderSet(!isReminderSet);
    
    if (!isReminderSet) {
      Alert.alert('Reminder Set', `We'll remind you 30 minutes before ${classData.title} begins.`);
    } else {
      Alert.alert('Reminder Removed', `Reminder for ${classData.title} has been removed.`);
    }
  };
  
  // Determine if the class is happening soon (within the next hour)
  const isClassSoon = () => {
    const classTime = new Date(classData.datetime);
    const now = new Date();
    const diffMs = classTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours > 0 && diffHours < 1;
  };
  
  // Format the spots text
  const getSpotsText = () => {
    const spotsLeft = classData.maxParticipants - classData.currentParticipants;
    if (spotsLeft <= 0) {
      return 'Class is full';
    } else if (spotsLeft <= 3) {
      return `Only ${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left!`;
    } else {
      return `${spotsLeft} spots available`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../app/assets/class-yoga.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {classData.isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {/* Class Info Section */}
        <View style={styles.classInfoContainer}>
          <View style={styles.classCategoryContainer}>
            <Text style={styles.classCategoryText}>{classData.category}</Text>
          </View>
          
          <Text style={styles.classTitle}>{classData.title}</Text>
          
          <View style={styles.classMetaContainer}>
            <View style={styles.classMetaItem}>
              <Text style={styles.classMetaIcon}>🕒</Text>
              <Text style={styles.classMetaText}>{classData.duration} min</Text>
            </View>
            
            <View style={styles.classMetaItem}>
              <Text style={styles.classMetaIcon}>📊</Text>
              <Text style={styles.classMetaText}>{classData.level}</Text>
            </View>
            
            <View style={styles.classMetaItem}>
              <Text style={styles.classMetaIcon}>📍</Text>
              <Text style={styles.classMetaText}>{classData.location}</Text>
            </View>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateLabel}>Date & Time</Text>
            <Text style={styles.dateValue}>{formatClassDate(classData.datetime)}</Text>
            <Text style={styles.timeValue}>{formatClassTime(classData.datetime)}</Text>
          </View>
          
          <View style={styles.spotsContainer}>
            <View style={styles.spotsInfo}>
              <Text style={styles.spotsLabel}>Available Spots</Text>
              <Text style={styles.spotsValue}>{getSpotsText()}</Text>
            </View>
            <View style={styles.spotsProgressOuter}>
              <View 
                style={[
                  styles.spotsProgressInner, 
                  { width: `${calculateSpotsPercentage()}%` }
                ]}
              />
            </View>
          </View>
        </View>
        
        {/* Instructor Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructor</Text>
          <View style={styles.instructorContainer}>
            <Image 
              source={{ uri: classData.instructor.image }} 
              style={styles.instructorImage} 
            />
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{classData.instructor.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>★ {classData.instructor.rating}</Text>
                <Text style={styles.reviewCount}>({classData.instructor.reviewCount} reviews)</Text>
              </View>
            </View>
          </View>
          <Text style={styles.instructorBio}>{classData.instructor.bio}</Text>
        </View>
        
        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Class</Text>
          <Text style={styles.descriptionText}>{classData.description}</Text>
        </View>
        
        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Need</Text>
          {classData.requirements.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemIcon}>•</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
        
        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {classData.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemIcon}>✓</Text>
              <Text style={styles.listItemText}>{benefit}</Text>
            </View>
          ))}
        </View>
        
        {/* Bottom padding for button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.reminderButton}
          onPress={toggleReminder}
        >
          <Text style={styles.reminderButtonText}>
            {isReminderSet ? 'Cancel Reminder' : 'Set Reminder'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.mainActionButton,
            classData.currentParticipants >= classData.maxParticipants && styles.disabledButton
          ]}
          onPress={isClassSoon() ? handleJoinClass : handleBookClass}
          disabled={classData.currentParticipants >= classData.maxParticipants}
        >
          <Text style={styles.mainActionButtonText}>
            {isClassSoon() ? 'Join Now' : 'Book Class'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Registration Modal */}
      <Modal
        visible={isRegistrationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRegistrationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalInfoLabel}>Class:</Text>
              <Text style={styles.modalInfoValue}>{classData.title}</Text>
            </View>
            
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalInfoLabel}>Date:</Text>
              <Text style={styles.modalInfoValue}>{formatClassDate(classData.datetime)}</Text>
            </View>
            
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalInfoLabel}>Time:</Text>
              <Text style={styles.modalInfoValue}>{formatClassTime(classData.datetime)}</Text>
            </View>
            
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalInfoLabel}>Duration:</Text>
              <Text style={styles.modalInfoValue}>{classData.duration} minutes</Text>
            </View>
            
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalInfoLabel}>Instructor:</Text>
              <Text style={styles.modalInfoValue}>{classData.instructor.name}</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Would you like to book this class? We'll send you a reminder 30 minutes before the class starts.
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setRegistrationModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmBooking}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Join Class Modal */}
      <Modal
        visible={isJoinModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Class</Text>
            
            <Text style={styles.modalMessage}>
              Are you ready to join the {classData.title} class with {classData.instructor.name}? 
              Make sure you have all the required equipment ready before joining.
            </Text>
            
            <View style={styles.zoomInfoContainer}>
              <Text style={styles.zoomInfoLabel}>Zoom Meeting ID:</Text>
              <Text style={styles.zoomInfoValue}>123 456 7890</Text>
              <Text style={styles.zoomInfoLabel}>Password:</Text>
              <Text style={styles.zoomInfoValue}>fitness</Text>
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setJoinModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={joinViaZoom}
              >
                <Text style={styles.modalConfirmButtonText}>Open Zoom</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  headerContainer: {
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5f5f8',
  },
  classInfoContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  classCategoryContainer: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  classCategoryText: {
    color: '#0097A7',
    fontSize: 12,
    fontWeight: '600',
  },
  classTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  classMetaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  classMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  classMetaIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  classMetaText: {
    color: '#666',
    fontSize: 14,
  },
  dateTimeContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    color: '#666',
  },
  spotsContainer: {
    marginBottom: 8,
  },
  spotsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotsLabel: {
    fontSize: 14,
    color: '#666',
  },
  spotsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  spotsProgressOuter: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  spotsProgressInner: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFC107',
    fontWeight: '600',
    marginRight: 4,
  },
  reviewCount: {
    color: '#999',
    fontSize: 12,
  },
  instructorBio: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  listItemIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    width: 16,
    textAlign: 'center',
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reminderButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginRight: 8,
  },
  reminderButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  mainActionButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  mainActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInfoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  modalInfoLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modalInfoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginVertical: 16,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  zoomInfoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
  },
  zoomInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  zoomInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});