import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConfirmAccountScreen = ({ navigation, route }) => {
  // Number of verification code digits
  const CODE_LENGTH = 6;
  
  // Get email from route params or use a placeholder
  const email = route.params?.email || 'your email';
  
  // State for verification code
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // References for the input field
  const inputRef = useRef(null);
  
  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle countdown timer for resend option
  useEffect(() => {
    let interval = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);
  
  // Handle verification code change
  const handleCodeChange = (text) => {
    // Only allow digits
    const formattedText = text.replace(/[^0-9]/g, '');
    
    // Limit to CODE_LENGTH digits
    if (formattedText.length <= CODE_LENGTH) {
      setCode(formattedText);
      setError('');
      
      // Auto-submit when all digits are entered
      if (formattedText.length === CODE_LENGTH) {
        handleVerify(formattedText);
      }
    }
  };
  
  // Handle verification submission
  const handleVerify = async (verificationCode) => {
    const codeToVerify = verificationCode || code;
    
    // Validate the code
    if (codeToVerify.length !== CODE_LENGTH) {
      setError(`Please enter all ${CODE_LENGTH} digits`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call for verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your API to verify the code:
      // const response = await authService.verifyAccount(email, codeToVerify);
      
      // For demonstration, we'll accept any 6-digit code
      console.log('Account verified successfully');
      
      // Navigate to the next screen (could be login or onboarding)
      navigation.navigate('OnboardingScreen');
    } catch (error) {
      console.error('Verification error:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your API to resend the code:
      // await authService.resendVerificationCode(email);
      
      // Reset timer and state
      setCanResend(false);
      setTimer(30);
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (error) {
      console.error('Resend code error:', error);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/fitness-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Verify Your Account</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to {email}
            </Text>
          </View>

          {/* Verification Code Input */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Enter Verification Code</Text>
            
            <View style={styles.codeContainer}>
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                autoFocus
              />
              
              <View style={styles.codeBoxesContainer}>
                {Array(CODE_LENGTH).fill(0).map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.codeBox,
                      index < code.length && styles.codeBoxFilled,
                      error && styles.codeBoxError
                    ]}
                  >
                    <Text style={styles.codeBoxText}>
                      {index < code.length ? code[index] : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton, 
                (code.length !== CODE_LENGTH || isLoading) && styles.buttonDisabled
              ]}
              onPress={() => handleVerify()}
              disabled={code.length !== CODE_LENGTH || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify Account</Text>
              )}
            </TouchableOpacity>

            {/* Resend Code */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              
              {canResend ? (
                <TouchableOpacity 
                  onPress={handleResendCode}
                  disabled={isLoading}
                >
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend in {timer}s
                </Text>
              )}
            </View>
          </View>

          {/* Need Help Section */}
          <TouchableOpacity 
            style={styles.helpContainer}
            onPress={() => console.log('Help requested')}
          >
            <Text style={styles.helpText}>Need help? Contact Support</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  codeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  codeBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  codeBox: {
    width: 45,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  codeBoxFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  codeBoxError: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  codeBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#4299E1',
    fontWeight: '600',
    marginLeft: 5,
  },
  timerText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#4299E1',
  },
});

export default ConfirmAccountScreen;