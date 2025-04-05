import { Card, GradientCard } from "@/components/Cards";
import SettingsHeader from "@/components/SettingsHeader";
import { FlashList } from "@shopify/flash-list";

import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
} from "react-native";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  useEyeballingPropertiesQuery,
  useOwnedPropertyQuery,
} from "@/hooks/query/usePropertyQuery";
import { Filter } from "@/interfaces";
import SearchBar from "@/components/SearchBar";
import { PropertyScreenMode, UserType } from "@/constants/enums";
import EmptyNotifications from "@/components/empty-screens/notifications";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

const Eyeballing = () => {
  const [filters, setFilters] = useState<Filter>({
    location: {},
    limit: 10,
    from: UserType.ADMIN,
  });

  const handleCardPress = (id: number) => {
    router.push({
      pathname: "/properties/[id]",
      params: {
        id,
        mode: PropertyScreenMode.EYE_BALLING,
      },
    });
  };

  // Memoize derived data
  const propertiesQuery = useEyeballingPropertiesQuery(filters);

  const properties = useMemo(
    () => propertiesQuery.data?.pages.flatMap((page) => page.data) || [],
    [propertiesQuery.data]
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

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <SettingsHeader title="Eyeballing" />
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
                layout={LinearTransition}
                entering={FadeIn.duration(500)}
                className="mx-5"
              >
                <Card item={item} onPress={() => handleCardPress(item.id)} />
              </Animated.View>
            )}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              propertiesQuery.isLoading ? (
                <ActivityIndicator
                  size="small"
                  className="text-primary-300 mt-5"
                />
              ) : (
                <View className="items-center justify-center mt-52">
                  <EmptyNotifications />
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
  itemsContainer: {
    borderRadius: 15,
    height: "100%",
  },
});

export default Eyeballing;
