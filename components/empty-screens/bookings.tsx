import { View, Text, StyleSheet } from "react-native";
import React from "react";
import EmptyNotificationsImage from "@/assets/images/empty-history.svg";

const EmptyBookings = () => {
  return (
    <View className="items-center">
      <EmptyNotificationsImage width={165} height={100} />
      <Text
        className="text-center text-xl mt-10 mb-2 font-plus-jakarta-light"
        style={styles.color}
      >
        No booking found
      </Text>
      <Text
        className="text-center text-sm font-plus-jakarta-extralight"
        style={styles.color}
      >
        Book your first perch to start tracking your stays
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  color: {
    color: "rgba(108, 108, 108, 1)",
  },
});

export default EmptyBookings;
