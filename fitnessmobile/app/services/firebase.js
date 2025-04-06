// src/services/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
let app, auth, firestore, storage;

// Ensure app is only initialized once
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth with persistent storage
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    
    // Initialize Firestore and Storage
    firestore = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase initialization error", error);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
}

// Firestore Service with modern Firebase methods
export const firestoreService = {
  // User management
  getUser: async (userId) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      return userDoc.exists() 
        ? { id: userDoc.id, ...userDoc.data() } 
        : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date()
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
      const programsRef = collection(firestore, 'programs');
      const snapshot = await getDocs(programsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting programs:', error);
      throw error;
    }
  },
  
  getProgramById: async (programId) => {
    try {
      const programRef = doc(firestore, 'programs', programId);
      const programDoc = await getDoc(programRef);
      return programDoc.exists() 
        ? { id: programDoc.id, ...programDoc.data() } 
        : null;
    } catch (error) {
      console.error('Error getting program:', error);
      throw error;
    }
  },
  
  // File upload service
  uploadFile: async (file, path) => {
    try {
      // Convert file to blob if needed
      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      // Create a reference 
      const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      
      // Upload the file
      const uploadResult = await uploadBytes(fileRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      return {
        ref: uploadResult.ref,
        downloadURL
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
};

// Export Firebase services
export const firebaseServices = {
  auth,
  firestore,
  storage
};

// Configuration function (kept for compatibility)
export const initializeFirebase = () => {
  return app;
};