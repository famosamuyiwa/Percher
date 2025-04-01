import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalStore } from "@/store/store";
import MediaViewer from "@/components/MediaViewer";

const Gallery = () => {
  const { id } = useLocalSearchParams<{
    id: string;
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
      <MediaViewer defaultIndex={Number(id)} gallery={property?.gallery!} />
    </View>
  );
};

export default Gallery;
