import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";

import images from "@/constants/images";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

const NoResults = () => {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
      className="flex items-center my-10"
    >
      <Image source={images.noResult} style={styles.img} contentFit="contain" />
      <Text className="text-2xl font-plus-jakarta-semibold text-black-200 mt-5">
        No Results
      </Text>
      <Text className="text-base font-plus-jakarta-light text-black-100 mt-2">
        We could not find any result
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: "50%",
    height: 200,
  },
});

export default NoResults;
