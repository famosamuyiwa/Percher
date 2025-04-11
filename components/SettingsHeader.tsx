import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/common";

const SettingsHeader = ({
  title,
  isAddButtonVisible,
}: {
  title: string;
  isAddButtonVisible?: boolean;
}) => {
  const insets = useSafeAreaInsets();

  if (!insets) {
    return null; // Prevents glitching by waiting for insets
  }

  return (
    <View
      style={{ backgroundColor: "#F5F5F5", paddingTop: insets.top }}
      className="px-5"
    >
      <View style={styles.wrapper}>
        <Pressable onPress={() => router.back()} style={styles.arrowBack}>
          <MaterialIcons name="keyboard-backspace" size={16} color="#9A9A9A" />
        </Pressable>
        <Text className="text-xl text-center w-full font-plus-jakarta-bold">
          {title}
        </Text>

        {isAddButtonVisible && (
          <TouchableOpacity
            onPress={() => router.push("/my-perchs/form")}
            className="absolute right-0"
          >
            <AntDesign name="pluscircle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  arrowBack: {
    backgroundColor: "#FAFAFA",
    height: 28,
    width: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    position: "absolute",
    marginLeft: 15,
    zIndex: 999,
  },
});
export default SettingsHeader;
