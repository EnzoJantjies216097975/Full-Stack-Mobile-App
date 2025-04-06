// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { awsAuthService } from '../services/aws';

// Create auth context
const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for stored authentication method
        const authMethod = await AsyncStorage.getItem('authMethod');
        
        // Attempt to get current authenticated user
        if (authMethod === 'cognito') {
          const currentUser = await awsAuthService.currentAuthenticatedUser();
          
          if (currentUser) {
            // Prepare user data
            const userData = {
              id: currentUser.attributes.sub,
              email: currentUser.attributes.email,
              name: currentUser.attributes.name || currentUser.attributes.email,
            };
            
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Authentication check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login method with AWS Cognito
  const loginWithCognito = async (email, password) => {
    try {
      setAuthError(null);
      setIsLoading(true);
      
      // Attempt sign in
      const userResponse = await awsAuthService.signIn(email, password);
      
      // Prepare user data
      const userData = {
        id: userResponse.attributes.sub,
        email: userResponse.attributes.email,
        name: userResponse.attributes.name || userResponse.attributes.email,
      };
      
      // Store authentication method
      await AsyncStorage.setItem('authMethod', 'cognito');
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      // Handle specific error types
      const errorMessage = error.message || 'Login failed';
      setAuthError(errorMessage);
      console.error('Cognito login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register method with AWS Cognito
  const registerWithCognito = async (email, password, additionalUserInfo = {}) => {
    try {
      setAuthError(null);
      setIsLoading(true);
      
      // Sign up user
      const signUpResponse = await awsAuthService.signUp(email, password, {
        name: additionalUserInfo.name,
        ...additionalUserInfo
      });
      
      // Store authentication method
      await AsyncStorage.setItem('authMethod', 'cognito');
      
      return signUpResponse;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setAuthError(errorMessage);
      console.error('Cognito registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      // Sign out from Cognito
      await awsAuthService.signOut();
      
      // Clear stored authentication data
      await AsyncStorage.removeItem('authMethod');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    authError,
    loginWithCognito,
    registerWithCognito,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;