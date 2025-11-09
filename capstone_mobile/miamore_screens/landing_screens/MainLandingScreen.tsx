import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Choice'>;

const MainLandingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/MiAmore2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Welcome to <Text style={styles.brandName}>Mi Amore</Text> Cafe
      </Text>

      <Text style={styles.subtitle}>
        Where Every Sip & Bite is Made{'\n'}with Love!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Choice')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainLandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    color: '#5B3B2B',
    textAlign: 'center',
    fontWeight: '600',
  },
  brandName: {
    color: '#84BD00',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#5B3B2B',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  button: {
    position: 'absolute',
    bottom: 60, 
    left: 20,
    right: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderColor: '#86b662',
    borderWidth: 1.5,
    alignItems: 'center',

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow (Android)
    elevation: 3,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#86b662',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
