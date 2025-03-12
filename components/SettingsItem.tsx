import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/common";

const SettingsItem = ({ icon, title, onPress }: any) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between px-2 py-4"
      >
        <View className="flex-row">
          {icon}
          <View className="px-5 justify-center">
            <Text className="font-plus-jakarta-medium">{title}</Text>
          </View>
        </View>
        <View>
          <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsItem;
