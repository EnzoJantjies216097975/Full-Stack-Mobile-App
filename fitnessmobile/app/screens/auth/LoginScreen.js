// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loginWithFirebase, loginWithCognito, authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('firebase'); // 'firebase' or 'cognito'
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      
      if (authMethod === 'firebase') {
        await loginWithFirebase(email, password);
      } else {
        await loginWithCognito(email, password);
      }
      
      // Navigation is handled automatically via the AuthContext
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo and Header */}
          <View style={styles.header}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Fitness Bootcamp</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
          </View>
          
          {/* Auth Method Selector */}
          <View style={styles.authSelectorContainer}>
            <TouchableOpacity
              style={[
                styles.authSelector,
                authMethod === 'firebase' && styles.authSelectorActive,
              ]}
              onPress={() => setAuthMethod('firebase')}
            >
              <Text
                style={[
                  styles.authSelectorText,
                  authMethod === 'firebase' && styles.authSelectorTextActive,
                ]}
              >
                Firebase
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.authSelector,
                authMethod === 'cognito' && styles.authSelectorActive,
              ]}
              onPress={() => setAuthMethod('cognito')}
            >
              <Text
                style={[
                  styles.authSelectorText,
                  authMethod === 'cognito' && styles.authSelectorTextActive,
                ]}
              >
                AWS Cognito
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#D1D5DB"
              activeOutlineColor="#4F46E5"
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              outlineColor="#D1D5DB"
              activeOutlineColor="#4F46E5"
              right={
                <TextInput.Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <Button
              mode="contained"
              style={styles.loginButton}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              color="#4F46E5"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </View>
          
          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  authSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  authSelector: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  authSelectorActive: {
    borderBottomColor: '#4F46E5',
  },
  authSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  authSelectorTextActive: {
    color: '#4F46E5',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  loginButton: {
    paddingVertical: 8,
    backgroundColor: '#4F46E5',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
});

export default LoginScreen;