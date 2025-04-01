import EmptyBookings from "@/components/empty-screens/bookings";
import EmptyNotifications from "@/components/empty-screens/notifications";
import NotificationItem from "@/components/NotificationItem";
import { useNotificationQuery } from "@/hooks/query/useNotificationQuery";
import { useGlobalContext } from "@/lib/global-provider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const { unreadCount, markAllAsRead } = useGlobalContext();
  const notificationsQuery = useNotificationQuery();

  const notifications =
    notificationsQuery.data?.pages.flatMap((page) => page.data) || [];

  const handleOnBack = () => {
    router.back();
  };

  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, []);

  const listEmptyComponent = useMemo(() => {
    if (notificationsQuery.isLoading) {
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
        <EmptyBookings />
      </Animated.View>
    );
  }, [notificationsQuery.isLoading]);

  const loadMore = useCallback(() => {
    if (notificationsQuery.hasNextPage) {
      notificationsQuery.fetchNextPage();
    }
  }, [notificationsQuery]);

  return (
    <SafeAreaView className="px-5 flex-1 py-5" edges={["top"]}>
      <View className="mb-8 items-center justify-center">
        <TouchableOpacity onPress={handleOnBack} className="absolute -left-2">
          <Ionicons name="arrow-back-circle-sharp" size={40} />
        </TouchableOpacity>
        <Text className="font-plus-jakarta-bold text-lg">Notifications</Text>
        <View />
      </View>
      {notifications.length === 0 ? (
        <View className="flex-1 px-10 items-center">
          <View className="pt-[60%]">
            <EmptyNotifications />
          </View>
        </View>
      ) : (
        <FlashList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          contentContainerClassName="pb-32"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View className="h-1 my-4 bg-gray-200" />
          )}
          renderItem={({ item }) => <NotificationItem data={item} />}
          estimatedItemSize={100}
          ListHeaderComponent={<View className="px-5" />}
          ListEmptyComponent={listEmptyComponent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={16}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Notifications;
