import {
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FeaturedCard } from "@/components/Cards";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Property } from "@/interfaces";

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get("window").width - OFFSET * 2;
const ITEM_HEIGHT = 320;
type TProps = {
  scrollX: SharedValue<number>;
  id: number;
  total: number;
  item: Property;
};
const ParallaxCarouselCard = ({ item, scrollX, id, total }: TProps) => {
  const handleOnPress = (propertyId: number) => {
    router.push(`/properties/${propertyId}`);
  };

  const inputRange = [
    (id - 1) * ITEM_WIDTH,
    id * ITEM_WIDTH,
    (id + 1) * ITEM_WIDTH,
  ];
  const translateStyle = useAnimatedStyle(() => {
    // Scale: 0.8 when not centered, 1 when centered
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }], opacity };
  });
  const translateImageStyle = useAnimatedStyle(() => {
    const translate = interpolate(scrollX.value, inputRange, [
      -ITEM_WIDTH * 0.2,
      0,
      ITEM_WIDTH * 0.4,
    ]);
    return { transform: [{ translateX: translate }] };
  });
  const translateTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  return (
    <Animated.View
      style={[
        {
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginLeft: id === 0 ? OFFSET : undefined,
          marginRight: id === total - 1 ? OFFSET : undefined,
          overflow: "hidden",
          borderRadius: 14,
        },
        translateStyle,
      ]}
    >
      <Animated.View style={[translateImageStyle]}>
        <TouchableOpacity onPress={() => handleOnPress(item.id)}>
          <ImageBackground
            source={{ uri: item.header }}
            style={style.imageBackgroundStyle}
          >
            <LinearGradient
              colors={["transparent", "transparent", "rgba(0,0,0,0.8)"]}
              style={{ flex: 1 }}
            >
              <Animated.View
                style={[style.imageBackgroundView, translateTextStyle]}
              >
                <FeaturedCard item={item} />
              </Animated.View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default ParallaxCarouselCard;
const style = StyleSheet.create({
  imageBackgroundStyle: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  imageBackgroundView: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    flex: 1,
    justifyContent: "flex-end",
    gap: 4,
  },
});
