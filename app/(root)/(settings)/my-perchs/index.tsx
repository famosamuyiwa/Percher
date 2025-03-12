import { Card, GradientCard } from "@/components/Cards";
import SettingsHeader from "@/components/SettingsHeader";
import { Colors } from "@/constants/common";
import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { FlashList } from "@shopify/flash-list";

import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";

const MyPerchs = () => {
  const listHeader = () => <View className="px-5"></View>;

  const handleCardPress = (id: string) => {};

  const {
    data: bookings,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    skip: true,
  });

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <SettingsHeader title="My Perchs" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="py-5" style={{ flex: 1 }}>
          <View style={styles.itemsContainer} className="my-4 py-4">
            <FlashList
              data={[]}
              // keyExtractor={(item) => item.$id}
              keyExtractor={(item) => item}
              numColumns={1}
              contentContainerClassName="pb-32"
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View className="mx-5">
                  <Card item={item} onPress={() => handleCardPress(item)} />
                </View>
              )}
              ListHeaderComponent={listHeader}
              ListEmptyComponent={
                loading ? (
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
              estimatedItemSize={200}
            />
          </View>
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
    paddingVertical: 10,
    borderRadius: 15,
    height: "100%",
  },
  borderedItem: {
    borderBottomWidth: 1,
    borderColor: "#F4F4F4",
  },
});

export default MyPerchs;
