import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  FadeIn,
  FadeOut,
  clamp,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
const { width } = Dimensions.get("screen");
const _itemSize = width * 0.24;
const _spacing = 12;
const itemTotalSize = _itemSize + _spacing;

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedVideo = Animated.createAnimatedComponent(Video);

function CarouselItem({
  imageUri,
  index,
  scrollX,
}: {
  imageUri: string;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const styles = useAnimatedStyle(() => {
    return {
      borderWidth: 4,
      borderColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        ["transparent", "white", "transparent"]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [_itemSize / 3, 0, _itemSize / 3]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles,
        {
          marginRight: _spacing,
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2,
        },
      ]}
    >
      <Image
        source={{ uri: imageUri }}
        style={{
          flex: 1,
          borderRadius: _itemSize / 2,
        }}
      />
    </Animated.View>
  );
}

const MediaViewer = ({
  defaultIndex,
  gallery,
}: {
  defaultIndex?: number;
  gallery: string[];
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex ?? 0);

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : gallery.length - 1;
    setActiveIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < gallery.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
  };

  return (
    <View className="flex-1 justify-center">
      <View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: "black" }]}
      >
        {gallery[activeIndex].includes("mp4") ? (
          <AnimatedVideo
            key={`video-${activeIndex}`}
            source={{ uri: gallery[activeIndex] }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={true}
            isMuted={false}
            shouldPlay={true}
            rate={1.0}
            volume={1.0}
            useNativeControls
          />
        ) : (
          <AnimatedImage
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            key={`image-${activeIndex}`}
            source={{ uri: gallery[activeIndex] }}
            style={{ flex: 1 }}
            contentFit="contain"
          />
        )}
      </View>
      <View className="flex-row justify-between items-center px-4 pb-4">
        <TouchableOpacity
          onPress={handlePrevious}
          className="w-10 h-10 rounded-full bg-white/50 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className="w-10 h-10 rounded-full bg-white/50 items-center justify-center active:bg-white/30"
        >
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MediaViewer;
