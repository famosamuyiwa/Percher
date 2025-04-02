import React from "react";
import { Stack } from "expo-router";

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="details/[id]" />
      <Stack.Screen name="confirmation/[id]" />
    </Stack>
  );
}
