import AsyncStorage from "@react-native-async-storage/async-storage";

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

  if (response.status === 401 || response.status === 403) {
    await AsyncStorage.removeItem("token");

    (global as any).sessionExpired?.();

    throw new Error("Session expired");
  }

  return response;
};
