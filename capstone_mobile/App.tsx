import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './miamore_screens/MainLandingScreen';
import ChoiceScreen from './miamore_screens/SelectionScreen';
import SignInScreen from './miamore_screens/authentication_screens/SignInScreen';
import LoadingScreen from './miamore_screens/LoadingScreen';
import VerificationScreen from './miamore_screens/authentication_screens/VerificationScreen';
import ForgotPasswordScreen from './miamore_screens/authentication_screens/ForgotPasswordScreen';
import OtpVerificationScreen from './miamore_screens/authentication_screens/OtpVerificationScreen';
import ResetPasswordScreen from './miamore_screens/authentication_screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="Choice" component={ChoiceScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
