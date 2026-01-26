// config/api.ts
import { Platform } from "react-native";

const DEV_LAN_IP = "192.168.1.8";
const PROD_API = "https://miamorecafe.com";

export const API_BASE =
  Platform.OS === "android"
    ? __DEV__
      ? `http://${DEV_LAN_IP}:5000`
      : PROD_API
    : __DEV__
      ? "http://localhost:5000"
      : PROD_API;

/**
 * Fix URLs returned by backend
 */
export const fixUrl = (url?: string | null): string | null => {
  if (!url) return null;

  if (__DEV__) {
    return url
      .replace("localhost:8000", `${DEV_LAN_IP}:5000`)
      .replace("10.0.2.2:8000", `${DEV_LAN_IP}:5000`);
  }

  // 🚀 RELEASE: force production domain
  return url
    .replace("localhost:8000", "miamorecafe.com")
    .replace("10.0.2.2:8000", "miamorecafe.com");
};
