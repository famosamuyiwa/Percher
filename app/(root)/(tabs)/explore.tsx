import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import SearchBar from "../../../components/SearchBar";
import { Card } from "../../../components/Cards";
import Filters from "../../../components/Filters";
import { useAppwrite } from "../../../lib/useAppwrite";
import { getProperties } from "../../../lib/appwrite";
import NoResults from "../../../components/NoResults";
import { CategoryKey } from "@/constants/enums";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  const listHeader = () => (
    <View className="px-5">
      <Text className="text-sm font-plus-jakarta-bold">
        {properties?.length} results found
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="bg-white h-full">
      {/* <Button title="Seed" onPress={seed} /> */}

      <View className="px-5">
        <Text className="font-plus-jakarta-bold self-center text-lg">
          Explore
        </Text>
        <SearchBar />

        <View className="my-5">
          <Filters categoryKey={CategoryKey.PERCHTYPE} />
        </View>
      </View>
      <FlashList
        data={properties}
        keyExtractor={(item) => item.$id}
        numColumns={1}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mx-5">
            <Card item={item} onPress={() => handleCardPress(item.$id)} />
          </View>
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        estimatedItemSize={200}
      />
    </SafeAreaView>
  );
}
