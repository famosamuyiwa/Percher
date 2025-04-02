import { View, TouchableOpacity } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalStore } from "@/store/store";
import MediaViewer from "@/components/MediaViewer";
import { GalleryType } from "@/constants/enums";
const Gallery = () => {
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: GalleryType;
  }>();

  const { property } = useGlobalStore();

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => router.back()}
        className="z-50 top-20 left-5 absolute rounded-full size-11 items-center justify-center bg-white"
      >
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>
      <MediaViewer defaultIndex={Number(id)} gallery={property?.[type]!} />
    </View>
  );
};

export default Gallery;
