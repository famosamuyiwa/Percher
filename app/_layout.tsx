import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Plus-Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Plus-Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Plus-Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Plus-Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Plus-Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Plus-Jakarta-SemiBild": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "Plus-Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <Stack />;
}
