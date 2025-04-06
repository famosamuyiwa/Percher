import Map from "@/components/Map";
import MapBottomSheet from "@/components/MapBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
export default function MapScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Map />
      <MapBottomSheet />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
