import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { filterCategories } from "../constants/data";
import { FilterCategoryKey } from "@/constants/enums";

const Filters = ({ categoryKey }: { categoryKey: FilterCategoryKey }) => {
  const params = useLocalSearchParams<{ categoryFilter?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(
    params.categoryFilter ?? "All"
  );

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      return;
    }
    setSelectedCategory(category);
    router.setParams({ categoryFilter: category });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {filterCategories
        .filter((category) => category.key === categoryKey)
        .map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategoryPress(item.category)}
            className={`flex-col items-start mr-4 px-4 py-2 rounded-full ${
              selectedCategory === item.category
                ? "bg-primary-300"
                : "bg-primary-100 border border-primary-200"
            }`}
          >
            <Text
              className={`text-sm ${
                selectedCategory === item.category
                  ? "text-white font-plus-jakarta-bold mt-0.5"
                  : "text-black-300 font-plus-jakarta-regular"
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default Filters;
