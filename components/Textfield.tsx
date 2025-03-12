import React, { forwardRef, useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, StyleSheet, View, Text } from "react-native";
import { Colors } from "@/constants/common";

function TextField({
  label,
  isLabelVisible,
  placeholder,
  isSmallLabelVisible,
  value,
  onValueChange,
  isPassword,
  isPasswordHidden,
  onPasswordToggle,
  isEditable,
  keyboardType,
  style,
  isCurrency,
  textColor,
  onBlur,
  multiLine,
  numberOfLines,
  onContentSizeChange,
  placeholderColor,
}: any) {
  const color = Colors.primary;
  const handleTextChange = useCallback(
    (newValue: any) => {
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <View>
      {isLabelVisible && (
        <Text className="font-plus-jakarta-regular">{label}</Text>
      )}
      <View>
        {isSmallLabelVisible && (
          <Text className="text-xs font-plus-jakarta-regular">{label}</Text>
        )}
        <View style={[styles.textInput, style]}>
          <TextInput
            className="font-plus-jakarta-regular"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor || "lightgrey"}
            value={value}
            onChangeText={handleTextChange}
            secureTextEntry={isPasswordHidden}
            editable={isEditable}
            keyboardType={keyboardType ?? "default"}
            style={{ color: textColor || "black" }}
            onBlur={onBlur}
            multiline={multiLine}
            numberOfLines={numberOfLines}
            onContentSizeChange={onContentSizeChange}
          />
          {isCurrency && (
            <Text className="font-plus-jakarta-semibold absolute pl-3">₦</Text>
          )}
        </View>

        <Pressable
          onPress={onPasswordToggle}
          style={styles.passwordVisibilityIcon}
        >
          <View style={{ display: `${isPassword ? "flex" : "none"}` }}>
            <Ionicons
              name="eye-outline"
              style={[
                styles.passwordIcon,
                { display: `${isPasswordHidden ? "none" : "flex"}`, color },
              ]}
            />
            <Ionicons
              name="eye-off-outline"
              style={[
                styles.passwordIcon,
                { display: `${isPasswordHidden ? "flex" : "none"}`, color },
              ]}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const OTPField = forwardRef<TextInput | null, any>(
  (
    {
      label,
      isLabelVisible,
      placeholder,
      value,
      onValueChange,
      onKeyPress,
    }: any,
    ref
  ) => {
    const textColor = "black";
    const borderColorUnfocused = "gray";
    const borderColorFocused = Colors.primary;

    const [borderColor, setBorderColor] = useState(borderColorUnfocused);

    return (
      <View>
        {isLabelVisible ? (
          <Text className="font-plus-jakarta-regular">{label}</Text>
        ) : null}
        <View>
          <TextInput
            ref={ref}
            style={[
              styles.textInput,
              { textAlign: "center", color: textColor, borderColor },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={placeholder}
            value={value}
            onChangeText={function (newValue: any) {
              onValueChange(newValue);
            }}
            maxLength={1}
            keyboardType="numeric" // Set the keyboard type to numeric
            textContentType="oneTimeCode" // Set the text input mode (iOS)
            onFocus={function () {
              setBorderColor(borderColorFocused);
            }}
            onBlur={function () {
              setBorderColor(borderColorUnfocused);
            }}
            onKeyPress={onKeyPress}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  passwordVisibilityIcon: {
    position: "absolute",
    alignSelf: "flex-end",
    padding: 15,
    bottom: 0,
  },
  passwordIcon: {
    fontSize: 20,
  },
});

export { TextField, OTPField };
