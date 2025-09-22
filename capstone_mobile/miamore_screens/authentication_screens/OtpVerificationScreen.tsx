import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OtpVerificationScreen'>;

const OtpVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { email, token } = route.params as { email: string; token: string };

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentToken, setCurrentToken] = useState(token);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return (
      name.substring(0, 2) +
      '*'.repeat(Math.max(0, name.length - 4)) +
      name.slice(-2) +
      '@' +
      domain
    );
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      const otp = otpCode.join('');
      if (otp.length !== 6) {
        setModalMessage('Please enter a 6-digit code.');
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000);
        return;
      }

      const res = await fetch('http://10.0.2.2:5000/api/verify-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, token }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalMessage('OTP verified. Proceeding...');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ResetPassword', { email, token });
        }, 2000);
      } else {
        setModalMessage(data.message || 'Invalid OTP. Please try again.');
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setModalMessage('Server error.');
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch('http://10.0.2.2:5000/api/resend-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken }),
      });

      const text = await res.text(); 
      console.log("Resend response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setModalMessage("Server did not return valid JSON.");
        setModalVisible(true);
        return;
      }

      if (res.ok) {
        setCurrentToken(data.password_otp_token);
        setModalMessage('A new OTP has been sent to your email.');
      } else {
        setModalMessage(data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      console.error(err);
      setModalMessage('Server error while resending OTP.');
    } finally {
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Enter 6-Digit Code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit codes that you received on your email. We sent a code to{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{maskEmail(email)}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otpCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.otpInput}
            value={digit}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(value) => handleChange(index, value)}
          />
        ))}
      </View>

      <Text style={styles.resendText}>
        Didn’t get the OTP code?{' '}
        <Text style={styles.resendLink} onPress={handleResend}>
          Resend
        </Text>
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', padding: 20, backgroundColor: '#fff', paddingTop: 140 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 70, textAlign: 'left' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 45, },
  resendText: { textAlign: 'center', marginBottom: 30, color: '#555', fontSize: 15 }, 
  resendLink: { color: '#76b13a', fontWeight: 'bold' },
  otpInput: { width: 45, height: 45, marginHorizontal: 8, borderRadius: 10, borderWidth: 2, borderColor: '#E5E5E5', backgroundColor: '#F8F8F8', textAlign: 'center', fontSize: 20, color: '#333', },
  button: { backgroundColor: '#76b13a', padding: 15, borderRadius: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalText: { fontSize: 16, textAlign: 'center' },
});

export default OtpVerificationScreen;
