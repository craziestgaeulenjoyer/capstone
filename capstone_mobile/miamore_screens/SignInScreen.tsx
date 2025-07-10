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
  TouchableWithoutFeedback, 
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-number-input';

const SignInScreen = () => {
  const [activeTab, setActiveTab] = useState<'signIn' | 'register'>('signIn');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Green border for an active text box
  const [focusedInput, setFocusedInput] = useState<string | null>(null);  

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Register states
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef<PhoneInput>(null);

  //Fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    Alert.alert('Login', `Email: ${email}`);
  };

  const handleRegister = () => {
    if (!regEmail || !regPassword || !confirmPassword || !phoneNumber) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    if (regPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert('Register', `Email: ${regEmail}, Phone: ${phoneNumber}`);
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Let’s get your signed in!</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'signIn' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('signIn')}
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
            onPress={() => setActiveTab('register')}
          >
            <Text style={activeTab === 'register' ? styles.activeTabText : styles.tabText}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
        {activeTab === 'signIn' ? (
          <>
            <TextInput
              placeholder="example@gmail.com"
              style={[
                styles.input,
                focusedInput === 'regEmail' && styles.focusedInput,
              ]}
              value={regEmail}
              onChangeText={setRegEmail}
              keyboardType="email-address"
              onFocus={() => setFocusedInput('regEmail')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="none"
            />

            <View
              style={[
                styles.passwordContainer,
                focusedInput === 'regPassword' && { borderColor: '#92e3a9', borderWidth: 2 }
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

              <TouchableOpacity>
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
            <View
              style={[
                styles.phoneWrapper,
                focusedInput === 'phone' && styles.focusedInputWrapper,
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
                  fontSize: 16,
                  marginLeft: -4,
                }}
                textInputProps={{
                  onFocus: () => setFocusedInput('phone'),
                }}
              />
            </View>

            <TextInput
              placeholder="example@gmail.com"
              style={[
                styles.input,
                focusedInput === 'regEmail' && styles.focusedInput,
              ]}
              value={regEmail}
              onChangeText={setRegEmail}
              keyboardType="email-address"
              onFocus={() => setFocusedInput('regEmail')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="none"
            />

            <View
              style={[
                styles.passwordContainer,
                focusedInput === 'regPassword' && { borderColor: '#92e3a9', borderWidth: 2 }
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

            <View
              style={[
                styles.passwordContainer,
                focusedInput === 'confirmPassword' && { borderColor: '#92e3a9', borderWidth: 2 }
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', // Make background white like in the image
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
