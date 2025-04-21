import { Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import React from "react";
import GlobalProvider from "../lib/global-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  SplashScreen.setOptions({
    duration: 1000,
    fade: true,
  });

  const [fontsLoaded] = useFonts({
    "Plus-Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Plus-Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Plus-Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Plus-Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Plus-Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Plus-Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "Plus-Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    const init = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
        // Clear all notifications when app mounts
        await Notifications.dismissAllNotificationsAsync();
      }
    };

    init();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  /* gesture handler root view required for reanimated in bottom sheet */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="sign-in" />
              <Stack.Screen name="mail-auth" />
            </Stack>
          </SafeAreaProvider>
        </GlobalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
