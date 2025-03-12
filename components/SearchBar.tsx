import { View, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useDebouncedCallback } from "use-debounce";

import { Feather, Ionicons } from "@expo/vector-icons";

const SearchBar = ({ isFiltered }: { isFiltered?: boolean }) => {
  const path = usePathname();
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ query: text });
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };
  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-full bg-accent-100 border border-primary-100 mt-5 py-2">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Feather name="search" size={20} color="grey" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search for anything"
          placeholderTextColor={"lightgrey"}
          className="text-sm font-plus-jakarta-regular text-black-300 ml-2 flex-1"
        />

        {isFiltered && (
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color="grey" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;
