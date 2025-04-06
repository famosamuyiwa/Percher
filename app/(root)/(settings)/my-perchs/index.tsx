import { Card, GradientCard } from "@/components/Cards";
import SettingsHeader from "@/components/SettingsHeader";
import { FlashList } from "@shopify/flash-list";

import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useMemo, useState, useEffect } from "react";
import { useOwnedPropertyQuery } from "@/hooks/query/usePropertyQuery";
import { Filter } from "@/interfaces";
import SearchBar from "@/components/SearchBar";
import { Screens, UserType } from "@/constants/enums";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useMapContext } from "@/lib/map-provider";

const MyPerchs = () => {
  const [filters, setFilters] = useState<Filter>({
    location: {},
    limit: 10,
    from: UserType.HOST,
  });

  const { resetMap } = useMapContext();

  const handleCardPress = (id: number) => {
    router.push({
      pathname: "/my-perchs/form",
      params: {
        id,
      },
    });
  };

  // Memoize derived data
  const propertiesQuery = useOwnedPropertyQuery(filters);

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

  useEffect(() => {
    resetMap();
  }, []);

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <SettingsHeader title="My Perchs" />
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
                <Card
                  item={item}
                  source={Screens.MY_PERCHS}
                  onPress={() => handleCardPress(item.id)}
                />
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
      {properties.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/my-perchs/form")}
          className="absolute w-full items-end px-10 bottom-16 shadow-sm"
        >
          <AntDesign name="pluscircle" size={60} color={Colors.primary} />
        </TouchableOpacity>
      )}
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

export default MyPerchs;
