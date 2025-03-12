import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Button,
  StyleSheet,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/common";

interface MultiPickerProps {
  options: string[]; // List of options to select from
  selectedValues: string[]; // Initially selected values
  onChange: (selected: string[]) => void; // Callback to return selected values
  label?: string; // Optional label for the picker
}

const MultiPicker = ({
  options,
  selectedValues = [],
  onChange,
}: MultiPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedValues);

  // Toggle selection of an item
  const toggleSelection = (item: string) => {
    setSelectedItems(
      (prevSelected) =>
        prevSelected.includes(item)
          ? prevSelected.filter((value) => value !== item) // Remove if selected
          : [...prevSelected, item] // Add if not selected
    );
  };

  return (
    <View>
      {/* Picker Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.pickerButton}
      >
        <Text numberOfLines={1} className="font-plus-jakarta-regular ">
          {selectedItems.length > 0 ? selectedItems.join(", ") : `-- Select --`}
        </Text>
        <Entypo
          name="chevron-down"
          size={16}
          color={"darkgrey"}
          className="absolute right-0 px-5"
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              contentContainerClassName="p-5"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => toggleSelection(item)}
                >
                  <MaterialCommunityIcons
                    name={
                      selectedItems.includes(item)
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
                    }
                    size={24}
                    color={
                      selectedItems.includes(item) ? Colors.primary : "black"
                    }
                  />
                  <Text className="font-plus-jakarta-regular ml-3">{item}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Done Button */}
            <Button
              title="Done"
              onPress={() => {
                onChange(selectedItems); // Return selected values
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    height: 40,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  item: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "black",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
    color: "black",
    maxHeight: "40%",
  },
});

export default MultiPicker;
