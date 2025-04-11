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
import { MediaEntityType, UserType } from "@/constants/enums";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useMapContext } from "@/lib/map-provider";
import { useGlobalStore } from "@/store/store";
import useBackgroundUploads from "@/hooks/useBackgroundUploads";
const MyPerchs = () => {
  const [filters, setFilters] = useState<Filter>({
    location: {},
    limit: 10,
    from: UserType.HOST,
  });

  const { resetMap } = useMapContext();
  const { data: ownedProperties, isLoading } = useOwnedPropertyQuery(filters);
  const { failedUploads, uploadEntityMedia } = useBackgroundUploads();

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

  const uploadDummyData = () => {
    //dummy data
    const dummyData = [
      {
        type: "gallery",
        uri: "file:///Users/mac/Library/Developer/CoreSimulator/Devices/CA7EC17D-9FD5-49EC-8CEE-11E1FEA4973F/data/Containers/Data/Application/B2F85648-9916-46BE-A668-528E904704BA/Library/Caches/ImagePicker/5E64D8C2-14F2-44DD-B837-5238148CF994.mp4",
      },
      {
        type: "proofOfOwnership",
        uri: "file:///Users/mac/Library/Developer/CoreSimulator/Devices/CA7EC17D-9FD5-49EC-8CEE-11E1FEA4973F/data/Containers/Data/Application/B2F85648-9916-46BE-A668-528E904704BA/Library/Caches/ImagePicker/3637E63E-EBBF-4644-A1CD-AAAC519D2240.mp4",
      },
      // {
      //   type: "proofOfIdentity",
      //   uri: "file:///Users/mac/Library/Developer/CoreSimulator/Devices/CA7EC17D-9FD5-49EC-8CEE-11E1FEA4973F/data/Containers/Data/Application/B2F85648-9916-46BE-A668-528E904704BA/Library/Caches/ImagePicker/20F309B5-2D4B-4219-8119-F2676021DEAC.mp4",
      // },
    ] as any;
    uploadEntityMedia("1", MediaEntityType.PROPERTY, dummyData);
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <SettingsHeader
        title="My Perchs"
        isAddButtonVisible={isAddButtonVisible()}
      />
      <Button title="Upload Dummy Data" onPress={uploadDummyData} />
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
                <PerchSettingsCard
                  item={item}
                  onPress={() => handleCardPress(item.id)}
                />
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
