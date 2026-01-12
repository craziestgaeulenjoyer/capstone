import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
// @ts-ignore: react-native-fbsdk-next may not have type declarations in this project
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
  const [fullName, setFullName] = useState('');

  //Fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("🔥 SignInScreen Mounted!");
  }, []);

  const handleLogin = async () => {
    setLoginError(''); 

    if (!email.trim() || !password.trim()) {
      setLoginError('Missing fields detected. Please fill up all fields.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const otpToken = data.otp_token;

        if (rememberMe) {
          await AsyncStorage.setItem(
            'userCredentials',
            JSON.stringify({ email, password, rememberMe: true })
          );
        } else {
          await AsyncStorage.removeItem('userCredentials');
        }

        setShowSuccessLoginModal(true);

        setTimeout(() => {
          setShowSuccessLoginModal(false);
          navigation.navigate('VerificationScreen', {
            email,      
            otpToken, 
          });
        }, 2000);
      } else {
        setLoginError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setLoginError('An error occurred. Please try again later.');
    }
  };

  const clearErrors = () => {
    setLoginError('');
    setRegisterGeneralError('');
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !regEmail.trim() || !regPassword.trim() || !confirmPassword.trim()) {
      setRegisterGeneralError("Missing fields detected. Please fill up all the fields.");
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
          full_name: fullName,
          email: regEmail,
          password: regPassword,
        }),
      });

      console.log("Register payload:", {
        full_name: fullName,
        email: regEmail,
        password: regPassword,
      });

      const data = await response.json();

      if (response.ok) {
         setShowSuccessModal(true);
      } else {
        setRegisterGeneralError(data.message || 'Registration failed.');
      }
    } catch (error) {
       setRegisterGeneralError('An error occurred.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // signIn() completes the interactive sign-in; getTokens() reliably returns idToken
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      // Send the ID token to backend for verification
      const response = await fetch('http://10.0.2.2:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the JWT token or navigate
        await AsyncStorage.setItem('session_token', data.sessionToken);
        navigation.navigate('Home'); 
      } else {
        console.log('Google login failed:', data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1018371869413-p1alpi2lc93rtbem9fdr80bidbebl3bh.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const stored = await AsyncStorage.getItem('userCredentials');
        if (stored) {
          const { email, password, rememberMe } = JSON.parse(stored);
          if (rememberMe) {
            setEmail(email);
            setPassword(password);
            setRememberMe(true);
          }
        }
      } catch (err) {
        console.error('Failed to load credentials', err);
      }
    };

    loadCredentials();
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(activeTab === 'signIn' ? -50 : 50); 

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
      <View style={styles.headerWrapper}>
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
            <Text style={styles.categoriesFirstText}>Email</Text>
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
            <Text style={styles.categoriesText}>Password</Text>
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
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
                <FontAwesome name="google" size={20} color="#DB4437" />
                <Text style={styles.iconText}>Sign In using Google</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Full Name Register Field */}
            <Text style={styles.categoriesFirstText}>Full Name</Text>
            <TextInput
              placeholder="John Doe"
              style={[
                styles.input,
                focusedInput === "fullName" && styles.focusedInput,
                registerGeneralError && !fullName.trim() ? styles.errorInput : {},
              ]}
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedInput("fullName")}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
              autoCorrect={false}
              keyboardType="default"
              inputMode="text"
            />
            {/* Email Register Field */}
            <Text style={styles.categoriesText}>Email</Text>
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
            <Text style={styles.categoriesText}>Password</Text>
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
            <Text style={styles.categoriesText}>Confirm Password</Text>
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

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
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
                <Text style={styles.iconText}>Register using Google</Text>
              </TouchableOpacity>
            </View>
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
  headerText: {
    color: '#fff',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  headerWrapper: {
    backgroundColor: '#8B5E3C',
    height: 150,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40, 
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  categoriesText: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#787777",
    fontFamily: 'Montserrat-Bold',
  },
  categoriesFirstText: {
    fontSize: 14,
    marginTop: 35,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#787777",
    fontFamily: 'Montserrat-Bold',
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
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', 
    marginTop: 10,
    borderRadius: 30,
    width: '80%',
    height: 65,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 18,
    overflow: 'hidden', 
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#76b13a', 
    borderRadius: 25, 
  },
  tabText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Montserrat',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Montserrat',
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: '#92e3a9',
  },
  phoneWrapper: {
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#a3a2a2",
    borderWidth: 2,
    elevation: 5,
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
    borderColor: "#a3a2a2",
    borderWidth: 2,
    elevation: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    borderColor: "#a3a2a2",
    borderWidth: 2,
    elevation: 5,
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
    width: 20,
    height: 20,
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
    fontSize: 15,
    fontFamily: 'Montserrat',
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    fontFamily: 'Montserrat',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 18,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
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
    marginBottom: 6,
  },
  socialIcons: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",         
    justifyContent: "center",      
    backgroundColor: "#f9f9f9",
    paddingVertical: 14,
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 7,
  },
  iconText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
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
