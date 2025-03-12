import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { RadioItem } from "@/components/setting-item";
import { AppearanceRadioOptions } from "@/constants/radioOptions";
import SettingsHeader from "@/components/SettingsHeader";

const Appearance = () => {
  const [option, setOption] = useState(1);

  return (
    <View style={styles.container} className="flex-1">
      <SettingsHeader title="Appearance" />
      <View className="px-5 py-5" style={styles.container}>
        <View className="my-2">
          <View style={styles.itemsContainer} className="my-4">
            <RadioItem
              options={AppearanceRadioOptions}
              checkedValue={option}
              onChange={setOption}
            />
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
    paddingBottom: 5,
  },
  input: {
    height: 30,
    paddingVertical: 0,
    borderWidth: 0,
  },
});

export default React.memo(Appearance);
