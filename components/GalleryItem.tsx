import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import { ResizeMode, Video } from "expo-av";

const MiniGalleryItem = ({
  uri,
  isRemovable,
  type,
  onPressRemoveBtn,
}: {
  uri: any;
  type: "image" | "video";
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
      {type === "image" && (
        <Image
          source={{ uri }}
          style={styles.miniMedia}
          contentFit="cover"
          transition={300}
        />
      )}
      {type === "video" && (
        <>
          <Video
            source={{ uri }}
            style={styles.miniMedia}
            videoStyle={{}}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            shouldPlay={false}
            isLooping={false}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
          <Ionicons name="play" style={styles.playBtn} />
        </>
      )}
    </View>
  );
};

const GalleryItem = ({ uri, type }: { uri: any; type: "image" | "video" }) => {
  return (
    <>
      {type === "image" && (
        <Image
          source={{ uri }}
          style={styles.media}
          contentFit="cover"
          transition={300}
        />
      )}
      {type === "video" && (
        <>
          <Video
            source={{ uri }}
            style={styles.media}
            videoStyle={{}}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            shouldPlay={false}
            isLooping={false}
            resizeMode={ResizeMode.COVER}
            // useNativeControls
          />
          <Ionicons name="play" style={styles.playBtn} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  miniMedia: {
    height: 100,
    width: 100,
    borderRadius: 20,
    backgroundColor: "lightgrey",
    borderWidth: 0.4,
    borderColor: Colors.accent,
  },
  media: {
    height: 250,
    width: 250,
    borderRadius: 12,
  },
  playBtn: {
    fontSize: 30,
    position: "absolute",
    right: 5,
    bottom: 5,
    color: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export { MiniGalleryItem, GalleryItem };
