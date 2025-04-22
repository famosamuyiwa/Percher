import { Colors } from "@/constants/common";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text } from "react-native";
import { IMessage } from "react-native-gifted-chat";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import React from "react";

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: IMessage | null;
};

const ReplyMessageBar = ({ clearReply, message }: ReplyMessageBarProps) => {
  const backgroundColor = "white";
  const tintColor = Colors.primary;

  return (
    <>
      {message !== null && (
        <Animated.View
          style={{
            height: 50,
            flexDirection: "row",
            backgroundColor,
            borderWidth: 0.2,
            borderColor: "lightgrey",
          }}
          entering={FadeInDown}
          exiting={FadeOutDown}
        >
          <View
            style={{
              height: 50,
              width: 6,
              backgroundColor:
                message?.user.name === "Neemo" ? tintColor : "grey",
            }}
          ></View>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: message?.user.name === "Neemo" ? tintColor : "grey",
                paddingLeft: 10,
                paddingTop: 5,
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              {message?.user.name !== "Neemo" ? "You" : message?.user.name}
            </Text>
            <Text style={{ color: "grey", paddingLeft: 10, paddingTop: 5 }}>
              {message!.text.length > 40
                ? message?.text.substring(0, 40) + "..."
                : message?.text}
              {/* {message!.text.length > 40 || message!.text.includes("\n") ? message?.text.substring(0, message?.text.indexOf("\n")) + '...' : message?.text} */}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: 10,
            }}
          >
            <TouchableOpacity onPress={clearReply}>
              <Ionicons
                name="close-circle-outline"
                color={tintColor}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default ReplyMessageBar;
