import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-number-input';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [activeTab, setActiveTab] = useState<'signIn' | 'register'>('signIn');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessLoginModal, setShowSuccessLoginModal] = useState(false);

  // For login field errors
  const [loginError, setLoginError] = useState('');

  // For register field errors
  const [registerGeneralError, setRegisterGeneralError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Green border for an active text box
  const [focusedInput, setFocusedInput] = useState<string | null>(null);  

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register states
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef<PhoneInput>(null);

  //Fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleLogin = async () => {
    setLoginError(''); // clear old errors

    if (!email.trim() || !password.trim()) {
      setLoginError('Missing fields detected. Please fill up all fields.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessLoginModal(true);
      } else {
        setLoginError('Email and/or password is incorrect. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setLoginError('An error occurred. Please try again later.');
    }
  };

  const clearErrors = () => {
    setLoginError('');
    // If you also have register errors, clear them too:
    setRegisterGeneralError('');
  };

  const handleRegister = async () => {
    if (!phoneNumber.trim() || !regEmail.trim() || !regPassword.trim() || !confirmPassword.trim()) {
      setRegisterGeneralError('Missing fields detected. Please fill up all the fields.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setRegisterGeneralError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          phone: phoneNumber,
        }),
      });

      console.log("Register payload:", {
        email: regEmail,
        password: regPassword,
        phone: phoneNumber,
      });

      const data = await response.json();

      if (response.ok) {
         setShowSuccessModal(true);
      } else {
        setRegisterGeneralError(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      setRegisterGeneralError('An error occurred.');
    }
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(activeTab === 'signIn' ? -50 : 50); // you can adjust offset

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  useEffect(() => {
    if (phoneInput.current) {
      const input = phoneInput.current?.getTextInput();
      if (input) {
        input.addEventListener?.('focus', () => setFocusedInput('phone'));
        input.addEventListener?.('blur', () => setFocusedInput(null));
      }
    }
  }, []);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessLoginModal) {
      timer = setTimeout(() => {
        setShowSuccessLoginModal(false);
        navigation.navigate('VerificationScreen'); 
      }, 5000); 
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessLoginModal]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Registration Successful!</Text>
              <Text style={styles.modalMessage}>You can now log in with your account.</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  setActiveTab("signIn"); 
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSuccessLoginModal}
          onRequestClose={() => setShowSuccessLoginModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Login Successful!</Text>
              <Text style={styles.modalMessage}>
                Awaiting for redirect...
              </Text>
            </View>
          </View>
        </Modal>
        <Text style={styles.headerText}>Let’s get you signed in!</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              
              activeTab === 'signIn' && styles.activeTab,
            ]}
            onPress={() => {
              setActiveTab('signIn');
              clearErrors();
            }}
          >
            <Text style={activeTab === 'signIn' ? styles.activeTabText : styles.tabText}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'register' && styles.activeTab,
            ]}
            onPress={() => {
              setActiveTab('register');
              clearErrors();
            }}
          >
            <Text style={activeTab === 'register' ? styles.activeTabText : styles.tabText}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[ styles.form, 
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {activeTab === 'signIn' ? (
          <>
            <TextInput
              placeholder="example@gmail.com"
              style={[
                styles.input,
                focusedInput === 'email' && styles.focusedInput,
                loginError ? styles.errorInput : null, 
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="none"
            />

            <View
              style={[
                styles.passwordContainer,
                focusedInput === 'password' && { borderColor: '#92e3a9', borderWidth: 2 },
                loginError ? { borderColor: 'red', borderWidth: 2 } : {},
              ]}
            >
              <TextInput
                placeholder="Password"
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checked]}>
                  {rememberMe && <FontAwesome name="check" size={16} color="#fff" />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Or login with */}
            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or login with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={20} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="facebook" size={20} color="#3b5998" />
              </TouchableOpacity>
            </View>

            <Text style={styles.signupText}>
              Don’t have an account?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => setActiveTab('register')}
              >
                Register here
              </Text>
            </Text>
          </>
        ) : (
          <>
            {/* Phone Number Register Field */}
            <View
              style={[
                styles.phoneWrapper,
                focusedInput === 'phone' && styles.focusedInputWrapper,
                registerGeneralError && !phoneNumber.trim() ? styles.errorInput : {},
              ]}
            >
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode="PH"
                layout="first"
                onChangeFormattedText={setPhoneNumber}
                onChangeText={() => setFocusedInput('phone')} // fallback
                onBlur={() => setFocusedInput(null)}
                containerStyle={{
                  backgroundColor: '#f1f1f1',
                  borderRadius: 10,
                  height: 52,
                  width: '100%',
                }}
                textContainerStyle={{
                  backgroundColor: '#f1f1f1',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  height: 52,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                }}
                textInputStyle={{
                  fontSize: 16,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  margin: 0,
                  textAlignVertical: 'center',
                }}
                codeTextStyle={{
                  fontSize: 14, 
                  marginLeft: -2, 
                  paddingHorizontal: 0, 
                }}
                flagButtonStyle={{
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                textInputProps={{
                  onFocus: () => setFocusedInput('phone'),
                }}
                countryPickerProps={{
                  withCloseButton: false,
                  modalProps: {
                    transparent: true,
                    animationType: 'slide',
                  },
                  renderModalContent: (props) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={props.onClose} 
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)', 
                        justifyContent: 'flex-start',
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          marginTop: '30%', 
                          backgroundColor: 'white',
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          maxHeight: '70%',
                          overflow: 'hidden',
                          flex: 1,
                        }}
                      >
                        <props.CountryPicker {...props} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ),
                }}
              />
            </View>
            {/* Email Register Field */}
            <TextInput
              placeholder="example@gmail.com"
              style={[
                styles.input,
                focusedInput === 'regEmail' && styles.focusedInput,
                registerGeneralError && !regEmail.trim() ? styles.errorInput : null,
              ]}
              value={regEmail}
              onChangeText={setRegEmail}
              keyboardType="email-address"
              onFocus={() => setFocusedInput('regEmail')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="none"
            />
            {/* Password Register Field */} 
            <View
              style={[
                styles.passwordContainer,
                focusedInput === 'regPassword' && { borderColor: '#92e3a9', borderWidth: 2 },
                registerGeneralError && !regPassword.trim() ? { borderColor: 'red', borderWidth: 2 } : {},
              ]}
            >
              <TextInput
                placeholder="Password"
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                value={regPassword}
                onChangeText={setRegPassword}
                onFocus={() => setFocusedInput('regPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {/* Confirm Password Register Field */} 
            <View
              style={[
                styles.passwordContainer,
                focusedInput === 'confirmPassword' && { borderColor: '#92e3a9', borderWidth: 2 },
                registerGeneralError && !confirmPassword.trim() ? { borderColor: 'red', borderWidth: 2 } : {},
              ]}
            >
              <TextInput
                placeholder="Confirm Password"
                style={styles.passwordInput}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {registerGeneralError ? (
              <Text style={styles.errorText}>{registerGeneralError}</Text>
            ) : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
              <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>

            {/* Or register with */}
            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or register with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={20} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="facebook" size={20} color="#3b5998" />
              </TouchableOpacity>
            </View>

            <Text style={styles.signupText}>
              Already have an account?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => setActiveTab('signIn')}
              >
                Login here
              </Text>
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#8B5E3C',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', 
    borderRadius: 30,
    width: '80%',
    height: 50,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'hidden', // Clip children to match pill shape
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#92e3a9', // Light green as in image
    borderRadius: 25, // Ensure rounded corners
  },
  tabText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: '#92e3a9',
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },

  phoneWrapper: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },

  focusedInputWrapper: {
    borderWidth: 2,
    borderColor: '#92e3a9',
    borderRadius: 10,
  },
  form: {
    padding: 24,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checked: {
    backgroundColor: '#8B5E3C',
    borderColor: '#8B5E3C',
  },
  rememberMeText: {
    marginLeft: 6,
    fontSize: 14,
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2.5,
  },
  signupText: {
    textAlign: 'center',
    fontSize: 14,
    top: 10,
    color: '#444',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SignInScreen;
