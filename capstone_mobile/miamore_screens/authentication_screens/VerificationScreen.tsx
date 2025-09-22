import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Modal, 
  Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../routes/navigation'; 

type VerificationRouteProp = RouteProp<RootStackParamList, 'VerificationScreen'>;

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<VerificationRouteProp>();

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState(route.params.otpToken); 

  const [showResendModal, setShowResendModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      setShowSuccessModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: code, 
          token: otpToken
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('Home');
        }, 2000);
      } else {
        setShowResendModal(true);
      }
    } catch (err) {
      console.error(err);
      setShowResendModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otpToken })
      });

      const text = await response.text();
      console.log("Resend response:", text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        setShowResendModal(true);
        return;
      }

      if (response.ok) {
        setOtpToken(data.otp_token); 
        setTimeout(() => {
          setShowResendModal(true);
        }, 2000);
      } else {
        setShowResendModal(true);
      }
    } catch (err) {
      console.error(err);
      setShowResendModal(true);
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email; 
    return (
      name.substring(0, 2) + '*'.repeat(Math.max(0, name.length - 4)) + name.slice(-2) + '@' + domain
    );
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
        <Text style={{ fontWeight: 'bold' }}>{maskEmail(route.params.email)}</Text>
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
        If you don’t receive a code,{' '}
        <Text style={styles.resendLink} onPress={handleResend}>
          Resend
        </Text>
      </Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.continueText}>{loading ? 'Verifying...' : 'Continue'}</Text>
      </TouchableOpacity>
      
      {/* Resend Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showResendModal}
        onRequestClose={() => setShowResendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>OTP Update</Text>
            <Text style={styles.modalMessage}>A new OTP has been sent to your email.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowResendModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Successful OTP Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>OTP verified successfully! Redirecting...</Text>
          </View>
        </View>
      </Modal>

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
    justifyContent: 'center',
    marginTop: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    marginHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#F8F8F8',
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
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
    backgroundColor: '#76b13a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: '#73C04D',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
