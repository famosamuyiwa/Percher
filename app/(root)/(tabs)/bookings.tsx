import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Picker } from "@react-native-picker/picker";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { getProperties } from "@/lib/appwrite";
import { Colors } from "@/constants/common";
import { CategoryKey, UserType } from "@/constants/enums";
import Filters from "@/components/Filters";
import EmptyBookings from "@/components/empty-screens/bookings";
import {
  BookingCardGuest,
  BookingCardHost,
  GradientCard,
} from "@/components/Cards";

const Bookings = () => {
  const { filter, query } = useLocalSearchParams<{
    query?: string;
    filter?: string;
  }>();
  const [userType, setUserType] = useState<UserType>(UserType.GUEST);
  const [userTypeModalVisible, setUserTypeVisible] = useState(false);

  const { data: bookings, loading } = useAppwrite({
    fn: getProperties,
    params: {
      filter: filter ?? "",
      query: query ?? "",
      limit: 20,
    },
    skip: true,
  });

  const handleCardPress = useCallback(
    (id: string) =>
      router.push({
        pathname: "/booking/details/[id]",
        params: { userType, id },
      }),
    [userType]
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <View className="mx-5 mb-5">
        {userType === UserType.GUEST ? (
          <BookingCardGuest
            item={item}
            onPress={() => handleCardPress(item.$id)}
          />
        ) : (
          <BookingCardHost
            item={item}
            onPress={() => handleCardPress(item.$id)}
          />
        )}
      </View>
    ),
    [userType, handleCardPress]
  );

  const listEmptyComponent = useMemo(() => {
    if (loading) {
      return (
        <ActivityIndicator size="small" className="text-primary-300 mt-5" />
      );
    }

    return (
      <View className="items-center justify-center mt-52">
        {userType === UserType.GUEST && false && (
          <GradientCard
            onPress={() => router.push("/(root)/(settings)/my-perchs")}
            bgColor="white"
          />
        )}
        <EmptyBookings />
      </View>
    );
  }, [loading, userType]);

  return (
    <SafeAreaView edges={["top"]} className="bg-white h-full">
      <View className="px-5">
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
          <Filters categoryKey={CategoryKey.BOOKINGS} />
        </View>
      </View>

      <FlashList
        data={bookings ?? []}
        numColumns={1}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        estimatedItemSize={200}
        ListHeaderComponent={<View className="px-5" />}
        ListEmptyComponent={listEmptyComponent}
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
    </SafeAreaView>
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
