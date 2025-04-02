import React from "react";
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="appearance" />
      <Stack.Screen name="help" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="referrals" />
      <Stack.Screen name="my-perchs" />
      <Stack.Screen name="payments" />
    </Stack>
  );
}
