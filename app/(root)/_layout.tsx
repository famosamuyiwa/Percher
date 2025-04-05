import React from "react";
import { useGlobalContext } from "../../lib/global-provider";
import { ActivityIndicator } from "react-native";
import { Redirect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthenticatedScreensProvider, {
  useAuthenticatedScreensContext,
} from "@/lib/authenticated-screens-provider";

export default function AppLayout() {
  const { loading, isLoggedIn } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <AuthenticatedScreensProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="notifications/index" />
        <Stack.Screen name="properties/[id]" />
        <Stack.Screen name="(settings)" />
      </Stack>
    </AuthenticatedScreensProvider>
  );
}
