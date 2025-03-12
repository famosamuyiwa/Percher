import React from "react";
import { Redirect, Slot, Stack } from "expo-router";

export default function PaymentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="banks" />\{" "}
    </Stack>
  );
}
