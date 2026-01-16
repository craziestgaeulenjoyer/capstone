import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./routes/navigation";

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

export function resetToLanding() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  }
}
    