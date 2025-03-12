import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { MaterialIndicator } from "react-native-indicators";
import { Colors } from "@/constants/common";

const CustomButton = ({
  label,
  onPress,
  isLoading,
  isDisabled,
}: {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <>
      {!isDisabled && (
        <TouchableOpacity
          onPress={onPress}
          className={`items-center justify-center bg-primary-300 shadow-md shadow-zinc-400"
       rounded-full py-3 h-12`}
        >
          {isLoading ? (
            <MaterialIndicator color={"white"} size={20} />
          ) : (
            <Text className="text-white text-center font-plus-jakarta-bold">
              {label}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {isDisabled && (
        <TouchableOpacity
          onPress={onPress}
          className={`items-center justify-center bg-gray-300 rounded-full py-3 h-12`}
        >
          {isLoading ? (
            <MaterialIndicator color={"white"} size={20} />
          ) : (
            <Text className="text-white text-center font-plus-jakarta-bold">
              {label}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

export default CustomButton;
