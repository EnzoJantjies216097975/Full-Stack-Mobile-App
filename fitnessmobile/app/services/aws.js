// src/services/aws.js
import { Amplify, Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure Amplify
export const configureAmplify = () => {
  try {
    const config = {
      Auth: {
        region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
        userPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID,
        userPoolWebClientId: process.env.EXPO_PUBLIC_AWS_USER_POOL_CLIENT_ID,
        identityPoolId: process.env.EXPO_PUBLIC_AWS_IDENTITY_POOL_ID,
        
        // Optional: additional configuration for persistent auth
        storage: AsyncStorage,
        
        // Customize authentication methods
        authenticationFlowType: 'USER_SRP_AUTH',
        
        // OAuth configuration (optional)
        oauth: {
          domain: process.env.EXPO_PUBLIC_AWS_COGNITO_DOMAIN,
          scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: 'myapp://callback',
          redirectSignOut: 'myapp://signout',
          responseType: 'code'
        }
      }
    };

    // Configure Amplify
    Amplify.configure(config);
  } catch (error) {
    console.error('Amplify configuration error:', error);
  }
};

// AWS Cognito Authentication Service
export const awsAuthService = {
  // Sign up a new user
  signUp: async (email, password, attributes = {}) => {
    try {
      const result = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          ...attributes
        }
      });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  
  // Confirm sign up with verification code
  confirmSignUp: async (email, code) => {
    try {
      const result = await Auth.confirmSignUp(email, code);
      return result;
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  },
  
  // Sign in user
  signIn: async (email, password) => {
    try {
      const user = await Auth.signIn(email, password);
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  // Sign out user
  signOut: async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
  
  // Get current authenticated user
  currentAuthenticatedUser: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  // Forgot password flow
  forgotPassword: async (email) => {
    try {
      const result = await Auth.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  // Confirm new password
  forgotPasswordSubmit: async (email, code, newPassword) => {
    try {
      const result = await Auth.forgotPasswordSubmit(email, code, newPassword);
      return result;
    } catch (error) {
      console.error('Confirm new password error:', error);
      throw error;
    }
  }
};

// Export individual services for flexibility
export const awsServices = {
  auth: awsAuthService
};