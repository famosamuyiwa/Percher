import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";

type Props = {
  items: any[];
  scrollX: SharedValue<number>;
  paginationIndex: number;
};

const { width } = Dimensions.get("screen");

const Pagination = ({ items, paginationIndex, scrollX }: Props) => {
  return (
    <View style={styles.container}>
      {items.map((_, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          "worklet";
          const position = index * width;
          const dotWidth = interpolate(
            scrollX.value,
            [position - width, position, position + width],
            [8, 20, 8],
            Extrapolation.CLAMP
          );
          return {
            width: dotWidth,
            backgroundColor: paginationIndex === index ? "black" : "lightgrey",
          };
        });

        return (
          <Animated.View key={index} style={[styles.dot, animatedStyle]} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    marginHorizontal: 2,
    borderRadius: 8,
  },
});

export default Pagination;
