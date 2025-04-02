import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { MaterialIcons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import NoResults from "@/components/NoResults";
import AnimationParallaxCarousel from "@/components/animation-parallax-carousel/animation-parallax-carousel";
import {
  Category,
  FilterCategoryKey,
  PerchTypes,
  UserType,
} from "@/constants/enums";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { HomeSkeleton } from "@/components/SkeletonLoader";
import { Skeleton } from "moti/skeleton";
import { Filter } from "@/interfaces";
import {
  useFeaturedPropertyQuery,
  usePropertiesQuery,
} from "@/hooks/query/usePropertyQuery";

export default function Index() {
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
  const { user, unreadCount } = useGlobalContext();

  const propertiesQuery = usePropertiesQuery({
    ...filters,
    category: Category.RECOMMENDATION,
  });
  const featuredPropertiesQuery = useFeaturedPropertyQuery({
    limit: 5,
    category: Category.FEATURED,
  });

  // Memoize derived data
  const properties = useMemo(
    () => propertiesQuery.data?.pages.flatMap((page) => page.data) || [],
    [propertiesQuery.data]
  );

  // Memoize derived data
  const featuredProperties = useMemo(
    () => featuredPropertiesQuery.data?.data || [],
    [featuredPropertiesQuery.data]
  );

  useEffect(() => {
    setFilters((prevData) => ({
      ...prevData,
      perchType: params.categoryFilter,
      searchTerm: params.query,
    }));
  }, [params.categoryFilter, params.query]);

  const handleCardPress = (id: number) => router.push(`/properties/${id}`);

  // Always call useMemo so that hooks order remains consistent
  const memoizedListHeader = useMemo(
    () => (
      <View>
        <View className="flex flex-row items-center justify-between mt-5 px-5">
          <View className="flex flex-row items-center">
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="font-plus-jakarta-semibold">
                Hey <Text className="text-accent-300">{user?.name}!</Text> 👋
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push("/(root)/notifications")}
            >
              <MaterialIcons name="notifications" size={20} />
              {unreadCount > 0 && (
                <View className="absolute -right-1 -top-1 w-4 h-4 bg-accent-300 border-2 border-white rounded-full" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-5">
          <SearchBar />
        </View>
        {featuredProperties.length > 0 && (
          <View className="mt-5">
            <View className="flex flex-row items-center justify-between px-5">
              <Text className="text-xl font-plus-jakarta-bold text-black-300">
                Guest Favorites
              </Text>
            </View>
            <View>
              <AnimationParallaxCarousel data={featuredProperties} />
            </View>
          </View>
        )}
        <View className="flex flex-row items-center justify-between px-5 mt-5">
          <Text className="text-xl font-plus-jakarta-bold text-black-300">
            Our Recommendation
          </Text>
          <TouchableOpacity>
            <Text className="text-sm font-plus-jakarta-semibold text-primary-300">
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View className="px-5">
          <Filters categoryKey={FilterCategoryKey.PERCHTYPE} />
        </View>
      </View>
    ),
    [featuredProperties, featuredPropertiesQuery.isLoading, user, unreadCount]
  );

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
      className="flex-1 bg-white h-full"
      style={{ paddingTop: insets.top }}
    >
      {featuredPropertiesQuery.isLoading ? (
        // Conditionally render the skeleton while loading
        <HomeSkeleton />
      ) : (
        // Render the FlashList when data is available
        <FlashList
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerClassName="pb-32"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex-1 px-2">
              <Card item={item} onPress={() => handleCardPress(item.id)} />
            </View>
          )}
          ListHeaderComponent={memoizedListHeader}
          ListEmptyComponent={
            propertiesQuery.isLoading ? (
              <View className="flex-row justify-between w-full p-5">
                <Skeleton width={160} height={200} colorMode="light" />
                <Skeleton width={160} height={200} colorMode="light" />
              </View>
            ) : (
              <NoResults />
            )
          }
          scrollEventThrottle={16}
          estimatedItemSize={250}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    paddingTop: 100,
  },
  loadingContainer: {
    paddingTop: 100,
  },
  searchBar: {
    borderWidth: 0.5,
    borderColor: "lightgrey",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
  },
});
