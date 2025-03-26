import React, { useState, useImperativeHandle, forwardRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Colors } from "@/constants/common";
import { ActivityIndicator, View } from "react-native";

const Loader = forwardRef(({}, ref) => {
  const [visibility, setVisibility] = useState(false);

  const show = () => {
    setVisibility(true);
  };

  const hide = () => {
    setVisibility(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show: () => show(),
      hide: () => hide(),
    }),
    [show, hide]
  );

  return (
    <>
      {visibility && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="w-full h-full absolute items-center justify-center bg-black/50"
        >
          <ActivityIndicator color={Colors.primary} size="large" />
        </Animated.View>
      )}
    </>
  );
});

export default Loader;
