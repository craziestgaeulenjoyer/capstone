import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { NavigationContainerRef } from "@react-navigation/native";

/**
 * We inject navigation later
 */
let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

export const authFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // SESSION EXPIRED
  if (response.status === 401 || response.status === 403) {
    await AsyncStorage.removeItem("token");

    Alert.alert(
      "Session expired",
      "Please login again.",
      [
        {
          text: "OK",
          onPress: () => {
            navigationRef?.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            });
          },
        },
      ],
      { cancelable: false }
    );

    throw new Error("Session expired");
  }

  return response;
};
