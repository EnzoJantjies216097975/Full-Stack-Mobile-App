import { create } from 'zustand';
import { firebaseAuth } from '../services/firebase';
import api from '../services/api';

const useAuth = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  // Initialize auth state on app load
  initialize: async () => {
    try {
      set({ isLoading: true });
      
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      
      // Validate token with API
      const response = await api.get('/auth/validate');
      const { user } = response.data;
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid token
      localStorage.removeItem('token');
      set({ isLoading: false });
    }
  },
  
  // Login with email/password
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Authenticate with Firebase
      const firebaseUser = await firebaseAuth.login(email, password);
      
      // Get ID token from Firebase
      const idToken = await firebaseUser.getIdToken();
      
      // Authenticate with our backend
      const response = await api.post('/auth/login', { idToken });
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // Logout
  logout: async () => {
    try {
      await firebaseAuth.logout();
      localStorage.removeItem('token');
      set({ 
        user: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}));

export default useAuth;