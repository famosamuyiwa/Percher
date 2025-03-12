import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { MaterialIcons } from "@expo/vector-icons";
import SearchBar from "../../../components/SearchBar";
import { Card, FeaturedCard } from "../../../components/Cards";
import Filters from "../../../components/Filters";
import { useGlobalContext } from "../../../lib/global-provider";
import { useAppwrite } from "../../../lib/useAppwrite";
import { getLatestProperties, getProperties } from "../../../lib/appwrite";
import NoResults from "../../../components/NoResults";
import AnimationParallaxCarousel from "@/components/animation-parallax-carousel/animation-parallax-carousel";
import { CategoryKey } from "@/constants/enums";

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  const listHeader = () => (
    <View>
      <View className="flex flex-row items-center justify-between mt-5 px-5">
        <View className="flex flex-row items-center">
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <View className="flex flex-col items-start ml-2 justify-center">
            <Text className="font-plus-jakarta-semibold">
              Hey <Text className="text-secondary-300">{user?.name}!</Text> 👋
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(root)/notifications")}
          >
            <MaterialIcons name="notifications" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-5">
        <SearchBar />
      </View>
      <View className="my-5">
        <View className="flex flex-row items-center justify-between px-5">
          <Text className="text-xl font-plus-jakarta-bold text-black-300">
            Guest Favorites
          </Text>
        </View>
        {latestPropertiesLoading ? (
          <ActivityIndicator size="small" className="text-primary-300" />
        ) : !latestProperties || latestProperties.length === 0 ? (
          <NoResults />
        ) : (
          <View>
            <AnimationParallaxCarousel data={latestProperties} />
          </View>
        )}
      </View>
      <View className="flex flex-row items-center justify-between px-5">
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
        <Filters categoryKey={CategoryKey.PERCHTYPE} />
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="bg-white h-full">
      {/* <Button title="Seed" onPress={seed} /> */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        ListHeaderComponent={useMemo(listHeader, [properties])}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
      />
    </SafeAreaView>
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
