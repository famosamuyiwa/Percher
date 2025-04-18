import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMapContext } from "@/lib/map-provider";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/common";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const MapBottomSheet = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    selectedAddress,
    selectedCoordinates,
    takeMapSnapshot,
    isLoadingSelectedAddress,
  } = useMapContext();

  const { from } = useLocalSearchParams<{ from?: string }>();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const handleOnDetailsButtonPress = async () => {
    // Take a snapshot of the map
    if (selectedCoordinates) {
      // Take the snapshot using the function from context
      await takeMapSnapshot();
    }

    // Close the bottom sheet
    bottomSheetRef.current?.close();
    router.back();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      onChange={handleSheetChanges}
      snapPoints={[70]}
    >
      <BottomSheetView className="px-4 pb-10">
        <View className="px-4">
          <Text className="text-xl font-bold mb-4 ">Location Details</Text>

          {isLoadingSelectedAddress && (
            <Animated.View
              layout={LinearTransition}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(200)}
              className="mt-5"
            >
              <ActivityIndicator size="small" color={Colors.primary} />
            </Animated.View>
          )}

          {!isLoadingSelectedAddress && selectedCoordinates && (
            <>
              <Text className="text-base font-semibold mt-3 mb-1">Area:</Text>
              <Text className="text-base mb-2">{selectedAddress}</Text>
              <Text className="text-base font-semibold mt-3 mb-1">
                Coordinates:
              </Text>
              <Text className="text-base mb-2">
                {selectedCoordinates[1].toFixed(6)},{" "}
                {selectedCoordinates[0].toFixed(6)}
              </Text>
            </>
          )}

          {!isLoadingSelectedAddress && !selectedCoordinates && (
            <>
              <Text className="text-base italic text-gray-500 mb-2 text-center">
                Tap on the map to pin your location
              </Text>
            </>
          )}

          <TouchableOpacity
            className="bg-primary-300 p-3 rounded-lg items-center mt-5"
            onPress={handleOnDetailsButtonPress}
          >
            <Text className="text-white text-base font-semibold">
              {selectedCoordinates ? "Continue" : "Close"}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default MapBottomSheet;
