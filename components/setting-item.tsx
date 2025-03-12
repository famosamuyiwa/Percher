import { View, Switch, TouchableOpacity, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/common";

const ToggleItem = ({ title }: { title: string }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const tabIconSelected = Colors.primary;

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <View className="flex justify-between items-center flex-row ">
      <Text className="font-plus-jakarta-regular">{title}</Text>
      <Switch
        trackColor={{ false: "#767577", true: tabIconSelected }}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const RadioItem = ({ options, checkedValue, onChange, style }: any) => {
  const tabIconSelected = Colors.primary;
  const tintColor = Colors.primary;

  return (
    <View>
      {options.map((option: any) => {
        let active = checkedValue == option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={
              option !== options[options.length - 1]
                ? styles.borderedItem
                : null
            }
            onPress={() => {
              onChange(option.value);
            }}
          >
            <View className="py-4 flex-row justify-between items-center">
              <View className="w-80">
                <Text className="font-plus-jakarta-regular">
                  {option.label}
                </Text>
                {option.subLabel && (
                  <Text
                    className="text-sm pt-2 font-plus-jakarta-regular"
                    style={{ color: "darkgrey" }}
                  >
                    {option.subLabel}
                  </Text>
                )}
              </View>
              <MaterialIcons
                name={
                  active ? "radio-button-checked" : "radio-button-unchecked"
                }
                size={24}
                color={active ? tintColor : "lightgrey"}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  borderedItem: {
    borderBottomWidth: 1,
    borderColor: "#F4F4F4",
    paddingBottom: 5,
  },
});

export { ToggleItem, RadioItem };
