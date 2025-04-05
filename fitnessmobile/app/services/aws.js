// src/services/aws.js
import { Auth } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import { API } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure Amplify
export const configureAmplify = () => {
  // This should be done in App.js before using any Amplify services
  // For this example, we're assuming it's already configured
};

// AWS Cognito Authentication
export const awsAuthService = {
  // Sign up a new user
  signUp: async (email, password, attributes) => {
    try {
      const result = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          ...attributes,
        },
      });
      return result;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
  
  // Confirm sign up with verification code
  confirmSignUp: async (email, code) => {
    try {
      const result = await Auth.confirmSignUp(email, code);
      return result;
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  },
  
  // Sign in user
  signIn: async (email, password) => {
    try {
      const user = await Auth.signIn(email, password);
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },
  
  // Sign out user
  signOut: async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  // Get current authenticated user
  currentAuthenticatedUser: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  // Reset password
  forgotPassword: async (email) => {
    try {
      const result = await Auth.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
  
  // Confirm new password
  forgotPasswordSubmit: async (email, code, newPassword) => {
    try {
      const result = await Auth.forgotPasswordSubmit(email, code, newPassword);
      return result;
    } catch (error) {
      console.error('Error confirming new password:', error);
      throw error;
    }
  },
  
  // Resend confirmation code
  resendSignUp: async (email) => {
    try {
      await Auth.resendSignUp(email);
    } catch (error) {
      console.error('Error resending code:', error);
      throw error;
    }
  }
};

// AWS S3 Storage
export const awsStorageService = {
  // Upload file to S3
  uploadFile: async (file, path) => {
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      const fileExtension = file.uri.split('.').pop();
      const fileName = `${path}/${Date.now()}.${fileExtension}`;
      
      const result = await Storage.put(fileName, blob, {
        contentType: file.type || 'application/octet-stream',
        progressCallback: (progress) => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        }
      });
      
      // Get the file URL
      const fileUrl = await Storage.get(result.key);
      return { key: result.key, url: fileUrl };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  // Upload exercise video
  uploadExerciseVideo: async (file, exerciseId) => {
    return awsStorageService.uploadFile(file, `exercises/${exerciseId}`);
  },
  
  // Upload profile image
  uploadProfileImage: async (file, userId) => {
    return awsStorageService.uploadFile(file, `profiles/${userId}`);
  },
  
  // Get file from S3
  getFile: async (key) => {
    try {
      const fileUrl = await Storage.get(key);
      return fileUrl;
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  },
  
  // Remove file from S3
  removeFile: async (key) => {
    try {
      await Storage.remove(key);
    } catch (error) {
      console.error('Error removing file:', error);
      throw error;
    }
  }
};

// AWS API Gateway
export const awsApiService = {
  // Get workout programs
  getPrograms: async () => {
    try {
      const data = await API.get('fitnessApi', '/programs');
      return data;
    } catch (error) {
      console.error('Error getting programs:', error);
      throw error;
    }
  },
  
  // Get program by ID
  getProgram: async (programId) => {
    try {
      const data = await API.get('fitnessApi', `/programs/${programId}`);
      return data;
    } catch (error) {
      console.error('Error getting program:', error);
      throw error;
    }
  },
  
  // Get exercises
  getExercises: async () => {
    try {
      const data = await API.get('fitnessApi', '/exercises');
      return data;
    } catch (error) {
      console.error('Error getting exercises:', error);
      throw error;
    }
  },
  
  // Get exercise by ID
  getExercise: async (exerciseId) => {
    try {
      const data = await API.get('fitnessApi', `/exercises/${exerciseId}`);
      return data;
    } catch (error) {
      console.error('Error getting exercise:', error);
      throw error;
    }
  },
  
  // Get classes
  getClasses: async () => {
    try {
      const data = await API.get('fitnessApi', '/classes');
      return data;
    } catch (error) {
      console.error('Error getting classes:', error);
      throw error;
    }
  },
  
  // Get class by ID
  getClass: async (classId) => {
    try {
      const data = await API.get('fitnessApi', `/classes/${classId}`);
      return data;
    } catch (error) {
      console.error('Error getting class:', error);
      throw error;
    }
  },
  
  // Join class
  joinClass: async (classId, userId) => {
    try {
      const data = await API.post('fitnessApi', `/classes/${classId}/join`, {
        body: { userId }
      });
      return data;
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  },
  
  // Record workout
  recordWorkout: async (workoutData) => {
    try {
      const data = await API.post('fitnessApi', '/workouts', {
        body: workoutData
      });
      return data;
    } catch (error) {
      console.error('Error recording workout:', error);
      throw error;
    }
  },
  
  // Get workout history
  getWorkoutHistory: async (userId, startDate, endDate) => {
    try {
      const params = { userId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const data = await API.get('fitnessApi', '/workouts', { queryStringParameters: params });
      return data;
    } catch (error) {
      console.error('Error getting workout history:', error);
      throw error;
    }
  },
  
  // Record food intake
  recordFoodIntake: async (intakeData) => {
    try {
      const data = await API.post('fitnessApi', '/nutrition', {
        body: intakeData
      });
      return data;
    } catch (error) {
      console.error('Error recording food intake:', error);
      throw error;
    }
  },
  
  // Get food intake
  getFoodIntake: async (userId, date) => {
    try {
      const data = await API.get('fitnessApi', '/nutrition', {
        queryStringParameters: { userId, date }
      });
      return data;
    } catch (error) {
      console.error('Error getting food intake:', error);
      throw error;
    }
  }
};