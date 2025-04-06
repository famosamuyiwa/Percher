import { StyleSheet, Text, View } from "react-native";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const MapBottomSheet = forwardRef(
  ({ children, ...props }: { children: ReactNode | ReactNode[] }, ref) => {
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        handleSheetChanges: (index: number) => handleSheetChanges(index),
      }),
      [handleSheetChanges]
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={[200]}
        {...props}
      >
        <BottomSheetView style={styles.container}>{children}</BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});

export default MapBottomSheet;
