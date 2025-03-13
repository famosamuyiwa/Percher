import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/common";

const MiniGalleryItem = ({
  uri,
  isRemovable,
  onPressRemoveBtn,
}: {
  uri: any;
  isRemovable: boolean;
  onPressRemoveBtn: () => void;
}) => {
  return (
    <View className="items-center ">
      {isRemovable && (
        <TouchableOpacity
          onPress={onPressRemoveBtn}
          className="self-end pt-2 absolute z-50 -top-5 shadow-md"
        >
          <View className="bg-white p-1 rounded-full">
            <AntDesign name="close" size={16} color="grey" />
          </View>
        </TouchableOpacity>
      )}
      <Image
        style={styles.image}
        source={{ uri }}
        contentFit="cover"
        transition={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 20,
    backgroundColor: "lightgrey",
    borderWidth: 0.4,
    borderColor: Colors.accent,
  },
});

export default MiniGalleryItem;
