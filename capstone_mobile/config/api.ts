// config/api.ts
import { Platform } from "react-native";

// CHANGE THIS TO YOUR PC IP
const LAN_IP = "192.168.1.8";

export const API_BASE =
  Platform.OS === "android"
    ? __DEV__
      ? `http://${LAN_IP}:5000` // physical phone
      : "https://your-production-api.com"
    : "http://localhost:5000";

/**
 * Fix URLs returned by backend (if any)
 */
export const fixUrl = (url?: string | null): string | null => {
  if (!url) return null;
  return url
    .replace("localhost:8000", `${LAN_IP}:5000`)
    .replace("10.0.2.2:8000", `${LAN_IP}:5000`);
};
