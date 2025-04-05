import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// import { 
//   getStorage, 
//   ref, 
//   uploadBytesResumable, 
//   getDownloadURL 
// } from 'firebase/storage';
// import { 
//   getMessaging, 
//   getToken, 
//   onMessage 
// } from 'firebase/messaging';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// // const storage = getStorage(app);
// // const messaging = getMessaging(app);

// // Auth Service
// export const firebaseAuth = {
//   login: async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       return userCredential.user;
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   },
  
//   register: async (email, password, userData) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       // Add additional user data to Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         ...userData,
//         email,
//         createdAt: serverTimestamp()
//       });
      
//       return user;
//     } catch (error) {
//       console.error("Register error:", error);
//       throw error;
//     }
//   },
  
//   resetPassword: async (email) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   logout: async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Logout error:", error);
//       throw error;
//     }
//   },
  
//   getCurrentUser: () => {
//     return auth.currentUser;
//   }
// };

// // Firestore Service
// export const firestoreService = {
//   // Users
//   getUser: async (userId) => {
//     try {
//       const userDoc = await getDoc(doc(db, 'users', userId));
//       if (userDoc.exists()) {
//         return { id: userDoc.id, ...userDoc.data() };
//       }
//       return null;
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   updateUser: async (userId, userData) => {
//     try {
//       await updateDoc(doc(db, 'users', userId), {
//         ...userData,
//         updatedAt: serverTimestamp()
//       });
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   // Exercises
//   createExercise: async (exerciseData, trainerId) => {
//     try {
//       const docRef = await addDoc(collection(db, 'exercises'), {
//         ...exerciseData,
//         trainerId,
//         createdAt: serverTimestamp()
//       });
//       return { id: docRef.id, ...exerciseData };
//     } catch (error) {
//       console.error("Error creating exercise:", error);
//       throw error;
//     }
//   },
  
//   getExercises: async (trainerId = null) => {
//     try {
//       let exercisesQuery;
      
//       if (trainerId) {
//         exercisesQuery = query(
//           collection(db, 'exercises'),
//           where('trainerId', '==', trainerId)
//         );
//       } else {
//         exercisesQuery = collection(db, 'exercises');
//       }
      
//       const snapshot = await getDocs(exercisesQuery);
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error getting exercises:", error);
//       throw error;
//     }
//   },
  
//   // Workout Programs
//   createProgram: async (programData, trainerId) => {
//     try {
//       const docRef = await addDoc(collection(db, 'programs'), {
//         ...programData,
//         trainerId,
//         createdAt: serverTimestamp()
//       });
//       return { id: docRef.id, ...programData };
//     } catch (error) {
//       console.error("Error creating program:", error);
//       throw error;
//     }
//   },
  
//   getPrograms: async (trainerId = null) => {
//     try {
//       let programsQuery;
      
//       if (trainerId) {
//         programsQuery = query(
//           collection(db, 'programs'),
//           where('trainerId', '==', trainerId)
//         );
//       } else {
//         programsQuery = collection(db, 'programs');
//       }
      
//       const snapshot = await getDocs(programsQuery);
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error getting programs:", error);
//       throw error;
//     }
//   },
  
//   // Classes
//   createClass: async (classData, trainerId) => {
//     try {
//       const docRef = await addDoc(collection(db, 'classes'),{
//         ...classData,
//         trainerId,
//         participants: [],
//         createdAt: serverTimestamp()
//       });
//       return { id: docRef.id, ...classData };
//     } catch (error) {
//       console.error("Error creating class:", error);
//       throw error;
//     }
//   },
  
//   getClasses: async (trainerId = null) => {
//     try {
//       let classesQuery;
      
//       if (trainerId) {
//         classesQuery = query(
//           collection(db, 'classes'),
//           where('trainerId', '==', trainerId),
//           orderBy('dateTime')
//         );
//       } else {
//         classesQuery = query(
//           collection(db, 'classes'),
//           orderBy('dateTime')
//         );
//       }
      
//       const snapshot = await getDocs(classesQuery);
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error getting classes:", error);
//       throw error;
//     }
//   },
  
//   joinClass: async (classId, traineeId) => {
//     try {
//       const classRef = doc(db, 'classes', classId);
//       const classDoc = await getDoc(classRef);
      
//       if (classDoc.exists()) {
//         const participants = classDoc.data().participants || [];
//         if (!participants.includes(traineeId)) {
//           await updateDoc(classRef, {
//             participants: [...participants, traineeId]
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error joining class:", error);
//       throw error;
//     }
//   },
  
//   // Food Intake & Nutrition Tracking
//   addFoodIntake: async (traineeId, foodData) => {
//     try {
//       return await addDoc(collection(db, 'foodIntake'), {
//         traineeId,
//         ...foodData,
//         timestamp: serverTimestamp()
//       });
//     } catch (error) {
//       console.error('Error adding food intake:', error);
//       throw error;
//     }
//   },
  
//   getTraineeFoodIntake: async (traineeId, startDate, endDate) => {
//     try {
//       const q = query(
//         collection(db, 'foodIntake'),
//         where('traineeId', '==', traineeId),
//         where('date', '>=', startDate),
//         where('date', '<=', endDate),
//         orderBy('date')
//       );
      
//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error('Error getting trainee food intake:', error);
//       throw error;
//     }
//   },
  
//   // Workout Logs
//   addWorkoutLog: async (traineeId, workoutData) => {
//     try {
//       return await addDoc(collection(db, 'workoutLogs'), {
//         traineeId,
//         ...workoutData,
//         timestamp: serverTimestamp()
//       });
//     } catch (error) {
//       console.error('Error adding workout log:', error);
//       throw error;
//     }
//   },
  
//   getTraineeWorkoutLogs: async (traineeId, startDate, endDate) => {
//     try {
//       const q = query(
//         collection(db, 'workoutLogs'),
//         where('traineeId', '==', traineeId),
//         where('date', '>=', startDate),
//         where('date', '<=', endDate),
//         orderBy('date')
//       );
      
//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error('Error getting trainee workout logs:', error);
//       throw error;
//     }
//   },
  
//   // Messages (Real-time)
//   sendMessage: async (senderId, receiverId, message) => {
//     try {
//       // Sort IDs to ensure consistent chat ID
//       const participants = [senderId, receiverId].sort();
//       const chatId = `${participants[0]}_${participants[1]}`;
      
//       return await addDoc(collection(db, 'messages'), {
//         chatId,
//         senderId,
//         receiverId,
//         content: message,
//         read: false,
//         timestamp: serverTimestamp()
//       });
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   },
  
//   listenToMessages: (senderId, receiverId, callback) => {
//     // Sort IDs to ensure consistent chat ID
//     const participants = [senderId, receiverId].sort();
//     const chatId = `${participants[0]}_${participants[1]}`;
    
//     const q = query(
//       collection(db, 'messages'),
//       where('chatId', '==', chatId),
//       orderBy('timestamp')
//     );
    
//     return onSnapshot(q, (snapshot) => {
//       const messages = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       callback(messages);
//     });
//   },
  
//   // Notifications
//   listenToNotifications: (userId, callback) => {
//     const q = query(
//       collection(db, 'notifications'),
//       where('userId', '==', userId),
//       orderBy('timestamp', 'desc')
//     );
    
//     return onSnapshot(q, (snapshot) => {
//       const notifications = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       callback(notifications);
//     });
//   },
  
//   markNotificationAsRead: async (notificationId) => {
//     try {
//       await updateDoc(doc(db, 'notifications', notificationId), {
//         read: true,
//         readAt: serverTimestamp()
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // Storage Service
// export const storageService = {
//   uploadFile: async (file, path) => {
//     try {
//       const storageRef = ref(storage, `${path}/${file.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);
      
//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log(`Upload progress: ${progress}%`);
//           },
//           (error) => {
//             console.error("Upload error:", error);
//             reject(error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             resolve(downloadURL);
//           }
//         );
//       });
//     } catch (error) {
//       console.error("File upload error:", error);
//       throw error;
//     }
//   }
// };

// export const uploadProfileImage = {
//   uploadProfileImage: async (file, userId) => {
//     try {
//       const fileRef = ref(storage, `profiles/${userId}/${file.name}`);
//       const uploadTask = uploadBytesResumable(fileRef, file);
      
//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           'state_changed',
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log('Upload progress:', progress);
//           },
//           (error) => {
//             reject(error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             resolve(downloadURL);
//           }
//         );
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // Push Notifications Service
// export const pushNotificationService = {
//   requestPermission: async () => {
//     try {
//       const permission = await Notification.requestPermission();
      
//       if (permission === 'granted') {
//         const token = await getToken(messaging, {
//           vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
//         });
        
//         return token;
//       }
      
//       throw new Error('Notification permission denied');
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   onMessageListener: () => {
//     return new Promise((resolve) => {
//       onMessage(messaging, (payload) => {
//         resolve(payload);
//       });
//     });
//   },
  
//   saveToken: async (userId, token) => {
//     try {
//       await setDoc(doc(db, 'fcmTokens', userId), {
//         token,
//         createdAt: serverTimestamp()
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// export { auth, db, storage, messaging };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Service
export const firebaseAuth = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
  
  getCurrentUser: () => {
    return auth.currentUser;
  }
};

export { auth, db };