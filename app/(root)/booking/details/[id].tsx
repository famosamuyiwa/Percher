import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import images from "@/constants/images";
import { Colors } from "@/constants/common";
import { ApprovalActions, ToastType, UserType } from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";

const Details = () => {
  const windowHeight = Dimensions.get("window").height;
  const { id, userType } = useLocalSearchParams();

  const { user, displayToast } = useGlobalContext();

  const handleApproval = async (choice: ApprovalActions) => {
    if (true) {
      displayToast({
        type: ToastType.SUCCESS,
        description: `You have successfully ${
          choice === ApprovalActions.APPROVE ? "approved" : "rejected"
        } this request`,
      });
    } else {
      displayToast({
        type: ToastType.ERROR,
        description: "An error occurred. Try again later",
      });
    }
  };

  const showPrompt = (choice: ApprovalActions) => {
    Alert.alert(
      "Confirmation", // Title of the alert
      `Are you sure you want to ${choice} this request?`, // Message
      [
        {
          text: "Cancel", // Cancel button
          onPress: () => {},
          style: "cancel", // Makes the text bold to highlight as a cancel action
        },
        {
          text: "Confirm", // Confirm button
          onPress: () => handleApproval(choice),
        },
      ],
      { cancelable: true } // Allows dismissing the alert by tapping outside of it
    );
  };

  return (
    <View className="bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 5 }}>
          <Image
            source={images.newYork}
            style={styles.propertyImg}
            contentFit="cover"
          />
          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row rounded-full size-11 items-center justify-center bg-white"
              >
                <Ionicons name="arrow-back" size={20} />
              </TouchableOpacity>

              {userType === UserType.GUEST && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/properties/${"67c443e900042ef21474"}`)
                  }
                  className="flex flex-row rounded-full size-11 items-center justify-center bg-white"
                >
                  <MaterialCommunityIcons name="home-search" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View className="mt-7 flex gap-2">
          <View className="px-5 flex-row justify-between items-center">
            <Text className="text-2xl font-plus-jakarta-extrabold">
              Famosa HighTowers
            </Text>

            {(userType === UserType.GUEST ||
              (userType === UserType.HOST && false)) && ( // check if approval action has not been taken on record yet
              <View className="flex flex-row items-center gap-5">
                <Ionicons
                  name="chatbox-ellipses"
                  size={28}
                  color={Colors.primary}
                />
                <FontAwesome5 name="phone" size={25} color={Colors.primary} />
              </View>
            )}

            {userType === UserType.HOST &&
              true && ( // check if approval action has not been taken on record yet
                <View className="flex flex-row items-center gap-5">
                  <TouchableOpacity
                    onPress={() => showPrompt(ApprovalActions.APPROVE)}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={40}
                      color={"limegreen"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showPrompt(ApprovalActions.REJECT)}
                  >
                    <Ionicons name="close-circle" size={40} color={"red"} />
                  </TouchableOpacity>
                </View>
              )}
          </View>

          <View className="flex flex-row items-center px-5">
            <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10">
              <FontAwesome5 name="bed" size={16} color={Colors.accent} />
            </View>
            <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
              3 Bed(s)
            </Text>
            <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 ml-7">
              <FontAwesome name="bath" size={16} color={Colors.accent} />
            </View>
            <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
              4 Bathroom(s)
            </Text>
          </View>

          <View className="flex flex-row items-center justify-start gap-2 px-5">
            <Entypo name="location" size={16} color={Colors.accent} />
            <Text className="text-black-200 text-sm font-plus-jakarta-medium">
              23, omighodalo street ogudu GRA, ojota. Lagos, Nigeria.
            </Text>
          </View>

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Perch Details</Text>
          </View>

          <View className="flex-row px-5 justify-between items-center my-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  size={25}
                  color={"darkgrey"}
                />
              </View>
              <Text className="font-plus-jakarta-regular">Check-In Date</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">
              Wed, Dec 03, 2025
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <MaterialCommunityIcons
                  name="clock-time-three"
                  size={22}
                  color={"darkgrey"}
                />
              </View>
              <Text className="font-plus-jakarta-regular">Check-In Time</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">2:00 pm</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <MaterialCommunityIcons
                  name="calendar-arrow-left"
                  size={25}
                  color={"darkgrey"}
                />
              </View>
              <Text className="font-plus-jakarta-regular">Check-Out Date</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">
              Wed, Dec 04, 2025
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <MaterialCommunityIcons
                  name="clock-time-nine"
                  size={22}
                  color={"darkgrey"}
                />
              </View>
              <Text className="font-plus-jakarta-regular">Check-Out Time</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">12:00 pm</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <FontAwesome6 name="house" size={19} color={"darkgrey"} />
              </View>
              <Text className="font-plus-jakarta-regular">Type</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">Apartment</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <FontAwesome5 name="phone" size={18} color={"darkgrey"} />
              </View>
              <Text className="font-plus-jakarta-regular">Phone</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">
              (+234)-803-304-4770
            </Text>
          </View>

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Price Details</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center my-5">
            <Text className="font-plus-jakarta-regular">Price</Text>
            <Text className="font-plus-jakarta-semibold">₦150,000.00</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Service Fee</Text>
            <Text className="font-plus-jakarta-semibold">₦10,000.00</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-bold">Total</Text>
            <Text className="font-plus-jakarta-bold">₦160,000.00</Text>
          </View>

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Guest Details</Text>
          </View>

          <View className="flex-row px-5 justify-center items-center my-5">
            <Image source={images.avatar} style={styles.guestImg} />
          </View>
          <View className="flex-row px-5 justify-between items-center my-5">
            <Text className="font-plus-jakarta-regular">Name</Text>
            <Text className="font-plus-jakarta-semibold">Muyiwa</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Mail</Text>
            <Text className="font-plus-jakarta-semibold">
              nenling@gmail.com
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Phone Number</Text>
            <Text className="font-plus-jakarta-semibold">
              (+234)-816-784-5287
            </Text>
          </View>
          {userType === UserType.GUEST && (
            <TouchableOpacity className="py-4 items-center" onPress={() => {}}>
              <Text className="font-plus-jakarta-semibold text-red-500">
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  propertyImg: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  guestImg: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginHorizontal: 10,
  },
});

export default Details;
