// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from 'aws-amplify';

// Create auth context
const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const auth = getAuth();

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored auth method
        const authMethod = await AsyncStorage.getItem('authMethod');
        
        if (authMethod === 'firebase') {
          // Check Firebase auth - using modern Firebase API
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              // Get additional user data if needed
              const userData = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email,
                photoURL: firebaseUser.photoURL,
              };
              
              setUser(userData);
              setIsAuthenticated(true);
            }
            setIsLoading(false);
          });

           // Clean up subscription
           return () => unsubscribe();
          } else if (authMethod === 'cognito') {

            


       
          // Check Cognito auth
          try {
            const cognitoUser = await Auth.currentAuthenticatedUser();
            if (cognitoUser) {
              const userData = {
                id: cognitoUser.attributes.sub,
                email: cognitoUser.attributes.email,
                name: cognitoUser.attributes.name || cognitoUser.attributes.email,
              };
              
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (error) {
            // Not authenticated with Cognito
            console.log('No Cognito user found');
          }
          setIsLoading(false);
        } else {
          // No stored auth method
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login with Firebase
  const loginWithFirebase = async (email, password) => {
    try {
      setAuthError(null);
      const response = await firebase.auth().signInWithEmailAndPassword(email, password);
      
      if (response.user) {
        setUser({
          id: response.user.uid,
          email: response.user.email,
          name: response.user.displayName || response.user.email,
          photoURL: response.user.photoURL,
        });
        
        await AsyncStorage.setItem('authMethod', 'firebase');
        setIsAuthenticated(true);
        return response.user;
      }
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Login with Cognito
  const loginWithCognito = async (email, password) => {
    try {
      setAuthError(null);
      const response = await Auth.signIn(email, password);
      
      const userData = {
        id: response.attributes.sub,
        email: response.attributes.email,
        name: response.attributes.name || response.attributes.email,
      };
      
      setUser(userData);
      await AsyncStorage.setItem('authMethod', 'cognito');
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Register with Firebase
  const registerWithFirebase = async (email, password, userData) => {
    try {
      setAuthError(null);
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      
      if (response.user) {
        // Update profile with user data
        await response.user.updateProfile({
          displayName: userData.name,
        });
        
        // Save additional user data to Firestore if needed
        
        setUser({
          id: response.user.uid,
          email: response.user.email,
          name: userData.name,
        });
        
        await AsyncStorage.setItem('authMethod', 'firebase');
        setIsAuthenticated(true);
        return response.user;
      }
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Register with Cognito
  const registerWithCognito = async (email, password, userData) => {
    try {
      setAuthError(null);
      
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name: userData.name,
        },
      });
      
      // User needs to confirm their account
      return true;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Confirm Cognito registration
  const confirmCognitoRegistration = async (email, code) => {
    try {
      setAuthError(null);
      await Auth.confirmSignUp(email, code);
      return true;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const authMethod = await AsyncStorage.getItem('authMethod');
      
      if (authMethod === 'firebase') {
        await firebase.auth().signOut();
      } else if (authMethod === 'cognito') {
        await Auth.signOut();
      }
      
      await AsyncStorage.removeItem('authMethod');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    authError,
    loginWithFirebase,
    loginWithCognito,
    registerWithFirebase,
    registerWithCognito,
    confirmCognitoRegistration,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};