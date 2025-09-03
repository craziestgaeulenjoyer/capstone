import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OtpVerificationScreen'>;

const OtpVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { email, token } = route.params as { email: string; token: string; };

  const [otp, setOtp] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleVerify = async () => {
    try {
      const { token } = route.params as { email: string; token: string };

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
        setTimeout(() => {
          setModalVisible(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setModalMessage('Server error.');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
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
      <Text style={styles.subtitle}>We sent a code to {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        keyboardType="number-pad"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', padding: 20, backgroundColor: '#fff', paddingTop: 140 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, textAlign: 'center', fontSize: 18, letterSpacing: 8 },
  button: { backgroundColor: '#92e3a9', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalText: { fontSize: 16, textAlign: 'center' },
});

export default OtpVerificationScreen;
