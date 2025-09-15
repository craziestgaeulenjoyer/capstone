import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    // Focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: code,
          token: route.params?.otpToken
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP verified. Logging in...');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.message || 'Verification failed.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Image
        source={require('../../assets/two-factor-auth.png')} 
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Verification Email</Text>
      <Text style={styles.subtitle}>
        Please enter the code we sent to{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{route.params?.email}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otpCode.map((digit, index) => (
          <TextInput
            key={index}
            id={`otp-${index}`}
            style={styles.otpInput}
            value={digit}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(value) => handleChange(index, value)}
          />
        ))}
      </View>

      <Text style={styles.resendText}>
        If you don’t receive a code,{' '}
        <Text style={styles.resendLink} onPress={() => Alert.alert('Not implemented')}>
          Resend
        </Text>
      </Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.continueText}>{loading ? 'Verifying...' : 'Continue'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backArrow: {
    fontSize: 32,
    color: '#5A5A5A',
  },
  image: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    color: '#555'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#A4C87C',
    width: 40,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 5
  },
  resendText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#888'
  },
  resendLink: {
    color: '#73C04D',
    fontWeight: 'bold'
  },
  continueButton: {
    backgroundColor: '#92e3a9',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
