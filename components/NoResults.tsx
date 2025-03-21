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
      className="flex items-center my-5"
    >
      <Image source={images.noResult} style={styles.img} contentFit="contain" />
      <Text className="text-2xl font-rubik-bold text-black-300 mt-5">
        No Results
      </Text>
      <Text className="text-base text-black-100 mt-2">
        We could not find any result
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: "91%",
    height: 320,
  },
});

export default NoResults;
