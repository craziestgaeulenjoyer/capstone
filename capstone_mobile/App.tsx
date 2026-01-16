import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Linking } from "react-native";

import type { RootStackParamList } from "./routes/navigation";
import { navigationRef } from "./navigationRef";

import LandingScreen from "./miamore_screens/landing_screens/MainLandingScreen";
import ChoiceScreen from "./miamore_screens/landing_screens/SelectionScreen";
import SignInScreen from "./miamore_screens/authentication_screens/SignInScreen";
import VerificationScreen from "./miamore_screens/authentication_screens/VerificationScreen";
import ForgotPasswordScreen from "./miamore_screens/authentication_screens/ForgotPasswordScreen";
import OtpVerificationScreen from "./miamore_screens/authentication_screens/OtpVerificationScreen";
import ResetPasswordScreen from "./miamore_screens/authentication_screens/ResetPasswordScreen";
import HomeScreen from "./miamore_screens/app_screens/HomeScreen";
import MenuScreen from "./miamore_screens/app_screens/MenuScreen";
import NearbyScreen from "./miamore_screens/app_screens/NearbyScreen";
import CartScreen from "./miamore_screens/app_screens/CartScreen";
import ProfileScreen from "./miamore_screens/app_screens/ProfileScreen";

import { SessionProvider } from "./context/SessionContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      console.log("🔗 Deep link received:", url);

      if (!navigationRef.isReady()) return;

      if (url === "capstone://payment-success") {
        navigationRef.navigate("Home");
      }

      if (url === "capstone://payment-failed") {
        navigationRef.navigate("Cart", {
          checkoutStep: "confirm",
        });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  return (
    <SessionProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
          <Stack.Screen name="Choice" component={ChoiceScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen
            name="OtpVerificationScreen"
            component={OtpVerificationScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Nearby" component={NearbyScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SessionProvider>
  );
}
