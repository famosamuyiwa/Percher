import { View, StyleSheet } from "react-native";
import { ToggleItem } from "@/components/setting-item";
import SettingsHeader from "@/components/SettingsHeader";

const NotificationSettings = () => {
  return (
    <View style={styles.container} className="flex-1">
      <SettingsHeader title="Notifications" />
      <View className="px-5 py-5" style={styles.container}>
        <View className="my-2">
          <View style={styles.itemsContainer} className="my-4">
            <View>
              <ToggleItem title="Show notifications" />
            </View>
          </View>
          <View style={styles.itemsContainer} className="my-4">
            <View style={styles.borderedItem} className="pb-4">
              <ToggleItem title="Split notifications" />
            </View>
            <View style={styles.borderedItem} className="py-4">
              <ToggleItem title="Payment notifications" />
            </View>
            <View style={{ paddingBottom: 5 }} className="py-4">
              <ToggleItem title="Friends notifications" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  itemsContainer: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  borderedItem: {
    borderBottomWidth: 1,
    borderColor: "#F4F4F4",
  },
  input: {
    height: 30,
    paddingVertical: 0,
    borderWidth: 0,
  },
});

export default NotificationSettings;
