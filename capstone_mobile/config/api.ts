// config/api.ts
export const API_BASE = "http://10.0.2.2:5000";

/**
 * Fix URLs returned by the Laravel backend (port 8000) to React Native dev server (port 5000)
 */
export const fixUrl = (url?: string | null): string | null => {
  if (!url) return null;
  return url.replace("10.0.2.2:8000", "10.0.2.2:5000");
};
