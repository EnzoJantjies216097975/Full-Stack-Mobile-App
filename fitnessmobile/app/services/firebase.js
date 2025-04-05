// src/services/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
//import { Platform } from 'react-native';

// Firebase configuration - replace with your own
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
export const initializeFirebase = () => {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    return app;
  }
};

// Export Firebase services
export const firestore = getFirestore();

// Firestore database reference
export const db = firebase.firestore();

// Auth service
export const auth = firebase.auth();

// Storage reference
export const storage = firebase.storage();

// Firestore collections
export const usersCollection = db.collection('users');
export const exercisesCollection = db.collection('exercises');
export const programsCollection = db.collection('programs');
export const classesCollection = db.collection('classes');
export const workoutLogsCollection = db.collection('workoutLogs');
export const foodIntakeCollection = db.collection('foodIntake');
export const notificationsCollection = db.collection('notifications');

// Firestore Services
export const firestoreService = {
  // User management
  getUser: async (userId) => {
    try {
      const doc = await usersCollection.doc(userId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      await usersCollection.doc(userId).update({
        ...userData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Workout programs
  getPrograms: async () => {
    try {
      const snapshot = await programsCollection.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting programs:', error);
      throw error;
    }
  },
  
  getProgramById: async (programId) => {
    try {
      const doc = await programsCollection.doc(programId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting program:', error);
      throw error;
    }
  },
  
  // Exercises
  getExercises: async () => {
    try {
      const snapshot = await exercisesCollection.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting exercises:', error);
      throw error;
    }
  },
  
  getExerciseById: async (exerciseId) => {
    try {
      const doc = await exercisesCollection.doc(exerciseId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting exercise:', error);
      throw error;
    }
  },
  
  // Classes
  getClasses: async () => {
    try {
      const now = new Date();
      const snapshot = await classesCollection
        .where('dateTime', '>=', now)
        .orderBy('dateTime')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting classes:', error);
      throw error;
    }
  },
  
  getClassById: async (classId) => {
    try {
      const doc = await classesCollection.doc(classId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting class:', error);
      throw error;
    }
  },
  
  joinClass: async (classId, userId) => {
    try {
      await classesCollection.doc(classId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(userId)
      });
      return true;
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  },
  
  leaveClass: async (classId, userId) => {
    try {
      await classesCollection.doc(classId).update({
        participants: firebase.firestore.FieldValue.arrayRemove(userId)
      });
      return true;
    } catch (error) {
      console.error('Error leaving class:', error);
      throw error;
    }
  },
  
  // Workout logs
  addWorkoutLog: async (workoutData) => {
    try {
      const docRef = await workoutLogsCollection.add({
        ...workoutData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding workout log:', error);
      throw error;
    }
  },
  
  getWorkoutLogs: async (userId, startDate, endDate) => {
    try {
      let query = workoutLogsCollection.where('userId', '==', userId);
      
      if (startDate) {
        query = query.where('completedAt', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('completedAt', '<=', endDate);
      }
      
      const snapshot = await query.orderBy('completedAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting workout logs:', error);
      throw error;
    }
  },
  
  // Food intake
  addFoodIntake: async (userId, mealData) => {
    try {
      const docRef = await foodIntakeCollection.add({
        userId,
        ...mealData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding food intake:', error);
      throw error;
    }
  },
  
  getFoodIntake: async (userId, startDate, endDate) => {
    try {
      let query = foodIntakeCollection.where('userId', '==', userId);
      
      if (startDate) {
        query = query.where('date', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('date', '<=', endDate);
      }
      
      const snapshot = await query.orderBy('date').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting food intake:', error);
      throw error;
    }
  }
};

// Storage Services
export const storageService = {
  uploadExerciseVideo: async (file, exerciseId) => {
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      const ref = storage.ref().child(`exercises/${exerciseId}/${file.name}`);
      await ref.put(blob);
      
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading exercise video:', error);
      throw error;
    }
  },
  
  uploadProfileImage: async (file, userId) => {
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      const ref = storage.ref().child(`profiles/${userId}/${file.name}`);
      await ref.put(blob);
      
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
};