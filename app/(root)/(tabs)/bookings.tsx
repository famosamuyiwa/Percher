import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Picker } from "@react-native-picker/picker";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/common";
import { BookingStatus, FilterCategoryKey, UserType } from "@/constants/enums";
import Filters from "@/components/Filters";
import EmptyBookings from "@/components/empty-screens/bookings";
import {
  BookingCardGuest,
  BookingCardHost,
  GradientCard,
} from "@/components/Cards";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import { Filter } from "@/interfaces";
import { useBookingsQuery } from "@/hooks/query/useBookingQuery";
import { useOwnedPropertyQuery } from "@/hooks/query/usePropertyQuery";

const Bookings = () => {
  const insets = useSafeAreaInsets();
  if (!insets) {
    return null; // Prevents glitching by waiting for insets
  }

  const params = useLocalSearchParams<{
    query?: string;
    categoryFilter?: BookingStatus;
  }>();
  const [filters, setFilters] = useState<Filter>({
    limit: 10,
    from: UserType.GUEST,
    bookingStatus: params.categoryFilter,
  });
  const bookingsQuery = useBookingsQuery(filters);
  const [userType, setUserType] = useState<UserType>(UserType.GUEST);
  const [userTypeModalVisible, setUserTypeVisible] = useState(false);

  const handleCardPress = (id: number) => {
    router.push({
      pathname: "/booking/details/[id]",
      params: { id, userType }, // userType is passed here as a parameter
    });
  };

  // Memoize derived data
  const propertiesQuery = useOwnedPropertyQuery({
    from: UserType.HOST,
    limit: 1,
  });

  const properties = useMemo(
    () => propertiesQuery.data?.pages.flatMap((page) => page.data) || [],
    [propertiesQuery.data]
  );

  // Memoize derived data
  const bookings = useMemo(
    () => bookingsQuery.data?.pages.flatMap((page) => page.data) || [],
    [bookingsQuery.data]
  );

  const loadMore = useCallback(() => {
    if (bookingsQuery.hasNextPage) {
      bookingsQuery.fetchNextPage();
    }
  }, [bookingsQuery]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <Animated.View
        layout={LinearTransition}
        entering={FadeIn.duration(500)}
        className="mx-5 mb-5"
      >
        {userType === UserType.GUEST ? (
          <BookingCardGuest
            item={item}
            onPress={() => handleCardPress(item.id)}
          />
        ) : (
          <BookingCardHost
            item={item}
            onPress={() => handleCardPress(item.id)}
          />
        )}
      </Animated.View>
    ),
    [userType, handleCardPress]
  );

  const listEmptyComponent = useMemo(() => {
    if (bookingsQuery.isLoading) {
      return (
        <View className="w-full p-5 gap-5">
          <Skeleton width="100%" height={200} colorMode="light" />
          <Skeleton width="100%" height={200} colorMode="light" />
        </View>
      );
    }

    return (
      <Animated.View
        layout={LinearTransition}
        entering={FadeIn.duration(500)}
        className="items-center justify-center mt-52"
      >
        {userType === UserType.HOST &&
          (properties.length < 1 ? (
            <GradientCard
              onPress={() => router.push("/(root)/(settings)/my-perchs")}
              bgColor="white"
            />
          ) : (
            <EmptyBookings />
          ))}
        {userType === UserType.GUEST && <EmptyBookings />}
      </Animated.View>
    );
  }, [bookingsQuery.isLoading, userType, properties.length]);

  useEffect(() => {
    setFilters((prevData) => ({
      ...prevData,
      from: userType,
      bookingStatus: params.categoryFilter,
    }));
  }, [userType, params.categoryFilter]);

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-white h-full"
    >
      <View className="px-5 pt-2">
        <View className="items-center justify-center">
          <Text className="font-plus-jakarta-bold text-lg self-center">
            Bookings
          </Text>
          <TouchableOpacity
            onPress={() => setUserTypeVisible(true)}
            className="h-10 w-3/12 rounded-lg border-primary-300 flex-row items-center px-2 gap-2 absolute right-0"
            style={{ borderWidth: 0.4 }}
          >
            <FontAwesome name="user" size={16} color={Colors.primary} />
            <Text className="text-xs font-plus-jakarta-semibold">
              {userType}
            </Text>
            <Entypo name="chevron-down" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View className="my-5">
          <Filters categoryKey={FilterCategoryKey.BOOKINGS} />
        </View>
      </View>

      <FlashList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        estimatedItemSize={200}
        ListHeaderComponent={<View className="px-5" />}
        ListEmptyComponent={listEmptyComponent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        scrollEventThrottle={16}
      />

      <Modal visible={userTypeModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userType}
              onValueChange={setUserType}
              itemStyle={{ color: "black", fontSize: 18 }}
            >
              <Picker.Item label={UserType.GUEST} value={UserType.GUEST} />
              <Picker.Item label={UserType.HOST} value={UserType.HOST} />
            </Picker>
            <Button title="Done" onPress={() => setUserTypeVisible(false)} />
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
});

export default Bookings;
