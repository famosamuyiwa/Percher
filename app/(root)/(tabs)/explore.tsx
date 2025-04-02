import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import SearchBar from "../../../components/SearchBar";
import { Card } from "../../../components/Cards";
import Filters from "../../../components/Filters";
import NoResults from "../../../components/NoResults";
import {
  BookingStatus,
  FilterCategoryKey,
  PerchTypes,
  UserType,
} from "@/constants/enums";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import { useExplorePropertyQuery } from "@/hooks/query/usePropertyQuery";
import { Filter } from "@/interfaces";

export default function Explore() {
  const insets = useSafeAreaInsets();

  if (!insets) {
    return null; // Prevents glitching by waiting for insets
  }

  const params = useLocalSearchParams<{
    query?: string;
    categoryFilter?: PerchTypes;
  }>();
  const [filters, setFilters] = useState<Filter>({
    location: "",
    limit: 10,
    from: UserType.GUEST,
    perchType: params.categoryFilter,
  });
  const propertiesQuery = useExplorePropertyQuery(filters);

  // Memoize derived data
  const properties = useMemo(
    () => propertiesQuery.data?.pages.flatMap((page) => page.data) || [],
    [propertiesQuery.data]
  );

  const loadMore = useCallback(() => {
    if (propertiesQuery.hasNextPage) {
      propertiesQuery.fetchNextPage();
    }
  }, [propertiesQuery]);

  useEffect(() => {}, [filters]);

  const handleCardPress = useCallback((id: number) => {
    router.push(`/properties/${id}`);
  }, []);

  const listHeader = () => (
    <View className="px-5">
      <Text className="text-sm font-plus-jakarta-bold">
        {properties?.length} results found
      </Text>
    </View>
  );

  useEffect(() => {
    setFilters((prevData) => ({
      ...prevData,
      perchType: params.categoryFilter,
      searchTerm: params.query,
    }));
  }, [params.categoryFilter, params.query]);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: insets.top,
      }}
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
    >
      {/* <Button title="Seed" onPress={seed} /> */}

      <View className="px-5">
        <Text className="font-plus-jakarta-bold self-center text-lg">
          Explore
        </Text>
        <SearchBar placeholder="Search for perchs or locations" />

        <View className="my-5">
          <Filters categoryKey={FilterCategoryKey.PERCHTYPE} />
        </View>
      </View>
      <FlashList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mx-5">
            <Card item={item} onPress={() => handleCardPress(item.id)} />
          </View>
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          propertiesQuery.isLoading ? (
            <View className="w-full p-5 gap-5">
              <Skeleton width="100%" height={200} colorMode="light" />
              <Skeleton width="100%" height={200} colorMode="light" />
            </View>
          ) : (
            <NoResults />
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        scrollEventThrottle={16}
        estimatedItemSize={200}
      />
    </Animated.View>
  );
}
