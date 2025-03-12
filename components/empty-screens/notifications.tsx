import { View, Text, StyleSheet } from "react-native";
import React from "react";
import EmptyNotificationsImage from "@/assets/images/empty-history.svg";

const EmptyNotifications = () => {
  return (
    <View className="items-center">
      <EmptyNotificationsImage width={165} height={100} />
      <Text className="text-center text-xl mt-10 mb-2" style={styles.color}>
        No notification found
      </Text>
      <Text className="text-center text-sm" style={styles.color}>
        For now, you're all caught up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  color: {
    color: "rgba(108, 108, 108, 1)",
  },
});

export default EmptyNotifications;
