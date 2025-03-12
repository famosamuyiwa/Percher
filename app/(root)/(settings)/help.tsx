import SettingsHeader from "@/components/SettingsHeader";
import { Colors } from "@/constants/common";
import { View, StyleSheet, Text } from "react-native";
const Help = () => {
  const tintColor = Colors.primary;

  return (
    <View style={styles.container} className="flex-1">
      <SettingsHeader title="Help" />
      <View className="px-5 py-5" style={styles.container}>
        <View style={styles.itemsContainer} className="my-4 py-4">
          <View style={styles.borderedItem} className="pb-4">
            <Text className="text-primary-300 font-plus-jakarta-regular">
              Help Center
            </Text>
          </View>
          <View style={styles.borderedItem} className="py-4">
            <Text className="text-primary-300 font-plus-jakarta-regular">
              Terms and Conditions
            </Text>
          </View>
          <View className="text-primary-300 font-plus-jakarta-regular py-4">
            <Text style={{ color: tintColor }}>Privacy Policy</Text>
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
});

export default Help;
