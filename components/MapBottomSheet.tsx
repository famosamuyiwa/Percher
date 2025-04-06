import { Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMapContext } from "@/lib/map-provider";
import { router, useLocalSearchParams } from "expo-router";

const MapBottomSheet = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { selectedAddress, selectedCoordinates, takeMapSnapshot } =
    useMapContext();

  const { from } = useLocalSearchParams<{ from?: string }>();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleOnDetailsButtonPress = async () => {
    console.log("handleOnDetailsButtonPress");

    // Take a snapshot of the map
    if (selectedCoordinates) {
      // Take the snapshot using the function from context
      const snapshotUri = await takeMapSnapshot();
      console.log("Snapshot taken:", snapshotUri);

      // Close the bottom sheet
      bottomSheetRef.current?.close();

      // Navigate back with the snapshot
      if (from === "perch-registration") {
        // If we came from the perch registration form, navigate back with the snapshot
        router.back();
      } else {
        // Otherwise just go back
        router.back();
      }
    } else {
      // If no coordinates are selected, just close the bottom sheet
      bottomSheetRef.current?.close();
    }
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

          {selectedAddress ? (
            <>
              <Text className="text-base font-semibold mt-3 mb-1">Area:</Text>
              <Text className="text-base mb-2">{selectedAddress}</Text>
            </>
          ) : (
            <Text className="text-base italic text-gray-500 mb-2">
              No address selected
            </Text>
          )}

          {selectedCoordinates ? (
            <>
              <Text className="text-base font-semibold mt-3 mb-1">
                Coordinates:
              </Text>
              <Text className="text-base mb-2">
                {selectedCoordinates[1].toFixed(6)},{" "}
                {selectedCoordinates[0].toFixed(6)}
              </Text>
            </>
          ) : (
            <Text className="text-base italic text-gray-500 mb-2">
              No coordinates selected
            </Text>
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
