import { Card, GradientCard, PerchSettingsCard } from "@/components/Cards";
import SettingsHeader from "@/components/SettingsHeader";
import { FlashList } from "@shopify/flash-list";

import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Button,
} from "react-native";
import { router } from "expo-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useOwnedPropertyQuery } from "@/hooks/query/usePropertyQuery";
import { Filter } from "@/interfaces";
import SearchBar from "@/components/SearchBar";
import { UserType } from "@/constants/enums";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useMapContext } from "@/lib/map-provider";
import useBackgroundUploads from "@/hooks/useBackgroundUploads";
const MyPerchs = () => {
  const [filters, setFilters] = useState<Filter>({
    location: {},
    limit: 10,
    from: UserType.HOST,
  });

  const { resetMap } = useMapContext();
  const { data: ownedProperties, isLoading } = useOwnedPropertyQuery(filters);

  const handleCardPress = (id: number) => {
    router.push({
      pathname: "/my-perchs/form",
      params: {
        id,
      },
    });
  };

  // Memoize derived data
  const properties = useMemo(
    () => ownedProperties?.pages.flatMap((page) => page.data) || [],
    [ownedProperties]
  );

  const listHeader = () => {
    return (
      properties.length > 0 && (
        <View className="px-5">
          <Text className="text-sm font-plus-jakarta-bold">
            Total: {properties?.length}
          </Text>
        </View>
      )
    );
  };

  useEffect(() => {
    resetMap();
  }, []);

  const isAddButtonVisible = useCallback(() => {
    return properties.length > 0;
  }, [properties.length]);

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <SettingsHeader
        title="My Perchs"
        isAddButtonVisible={isAddButtonVisible()}
      />
      {properties.length > 0 && (
        <View className="mx-5 pb-5">
          <SearchBar />
        </View>
      )}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-5" style={{ flex: 1 }}>
          <FlashList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            contentContainerClassName="pb-32"
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animated.View
                key={index}
                layout={LinearTransition}
                entering={FadeIn.duration(500)}
                className="mx-5"
              >
                <PerchSettingsCard item={item} onPress={() => {}} />
              </Animated.View>
            )}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              isLoading ? (
                <ActivityIndicator
                  size="small"
                  className="text-primary-300 mt-5"
                />
              ) : (
                <View className="items-center justify-center mt-52">
                  <GradientCard
                    onPress={() => router.push("/my-perchs/form")}
                    bgColor={"#F5F5F5"}
                  />
                </View>
              )
            }
            scrollEventThrottle={16}
            estimatedItemSize={200}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
});

export default MyPerchs;
