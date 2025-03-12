import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import EmptyNotifications from "@/components/empty-screens/notifications";
import { useAppwrite } from "@/lib/useAppwrite";
import { getProperties } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import Filters from "@/components/Filters";
import EmptyBookings from "@/components/empty-screens/bookings";
import { CategoryKey, UserType } from "@/constants/enums";
import { Picker } from "@react-native-picker/picker";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import {
  BookingCardGuest,
  BookingCardHost,
  GradientCard,
} from "@/components/Cards";

const Bookings = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [userType, setUserType] = useState<UserType>(UserType.GUEST);
  const [userTypeModalVisible, setUserTypeVisible] = useState(false);

  const {
    data: bookings,
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

  const listHeader = () => <View className="px-5"></View>;
  const handleCardPress = (id: string) =>
    router.push({
      pathname: `/booking/details/[id]`,
      params: { userType, id },
    });
  return (
    <SafeAreaView edges={["top"]} className="bg-white h-full">
      {/* <Button title="Seed" onPress={seed} /> */}
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
            <Modal
              visible={userTypeModalVisible}
              transparent
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={userType}
                    onValueChange={(itemValue) => setUserType(itemValue)}
                    itemStyle={{
                      color: "black", // Set text color
                      fontSize: 18, // Set font size
                    }}
                  >
                    <Picker.Item
                      label={UserType.GUEST}
                      value={UserType.GUEST}
                    />
                    <Picker.Item label={UserType.HOST} value={UserType.HOST} />
                  </Picker>
                  <Button
                    title="Done"
                    onPress={() => setUserTypeVisible(false)}
                  />
                </View>
              </View>
            </Modal>
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
        data={[1, 2]}
        // keyExtractor={(item) => item.$id}
        numColumns={1}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View className="mx-5 mb-5">
            {userType === UserType.GUEST && (
              <BookingCardGuest
                item={item}
                //   onPress={() => handleCardPress(item.$id)}
                onPress={() => handleCardPress(index + "")}
              />
            )}
            {userType === UserType.HOST && (
              <BookingCardHost
                item={item}
                //   onPress={() => handleCardPress(item.$id)}
                onPress={() => handleCardPress(index + "")}
              />
            )}
          </View>
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" className="text-primary-300 mt-5" />
          ) : (
            <View className="items-center justify-center mt-52">
              {/* // check if guest owns any perchs */}
              {userType === UserType.GUEST && false && (
                <GradientCard
                  onPress={() => router.push("/(root)/(settings)/my-perchs")}
                  bgColor="white"
                />
              )}
              {true && <EmptyBookings />}
            </View>
          )
        }
        estimatedItemSize={200}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "black",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
    color: "black",
  },
});
export default Bookings;
