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
import React, { useEffect, useState } from "react";
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
import {
  BookingStatus,
  PropertyScreenMode,
  ReviewAction,
  ToastType,
  UserType,
} from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";
import { useBookingQuery } from "@/hooks/query/useBookingQuery";
import {
  Commafy,
  convertToInternationalPhoneNumber,
  formatDate,
} from "@/utils/common";
import { Invoice } from "@/interfaces";
import { useReviewBookingMutation } from "@/hooks/mutation/useBookingMutation";

const Details = () => {
  const windowHeight = Dimensions.get("window").height;
  const { id, userType } = useLocalSearchParams<{
    id: string;
    userType?: UserType;
  }>();
  const { user, displayToast, showLoader, hideLoader } = useGlobalContext();
  const bookingQuery = useBookingQuery(Number(id));
  const reviewBookingMutation = useReviewBookingMutation();

  const handleApproval = async (choice: ReviewAction) => {
    showLoader();
    reviewBookingMutation.mutate(
      { action: choice, id: Number(id) },
      { onSuccess: () => onSuccess(choice), onSettled }
    );
  };

  const onSuccess = (choice: ReviewAction) => {
    displayToast({
      type: ToastType.SUCCESS,
      description: `You have successfully ${
        choice === ReviewAction.APPROVE ? "approved" : "rejected"
      } this request`,
    });
  };

  const onSettled = () => {
    hideLoader();
  };

  const showPrompt = (choice: ReviewAction) => {
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

  const handleOnViewProperty = () => {
    router.push({
      pathname: `/properties/[id]`,
      params: {
        id: bookingQuery.data?.data?.property?.id!,
        mode: PropertyScreenMode.VIEW_ONLY,
      },
    });
  };

  useEffect(() => {}, [bookingQuery.data?.data]);

  return (
    <View className="bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 5 }}>
          <Image
            source={{ uri: bookingQuery.data?.data?.property?.header }}
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
                  onPress={handleOnViewProperty}
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
              {bookingQuery.data?.data?.property?.name}
            </Text>

            {((userType === UserType.GUEST &&
              bookingQuery.data?.data?.status !== BookingStatus.REJECTED) ||
              (userType === UserType.HOST &&
                !(
                  bookingQuery.data?.data?.status === BookingStatus.PENDING ||
                  bookingQuery.data?.data?.status === BookingStatus.DRAFT
                ) &&
                bookingQuery.data?.data.status !== BookingStatus.REJECTED)) && ( // check if approval action has not been taken on record yet
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
              bookingQuery.data?.data?.status === BookingStatus.PENDING && ( // check if approval action has not been taken on record yet
                <View className="flex flex-row items-center gap-5">
                  <TouchableOpacity
                    onPress={() => showPrompt(ReviewAction.APPROVE)}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={40}
                      color={"limegreen"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showPrompt(ReviewAction.REJECT)}
                  >
                    <Ionicons name="close-circle" size={40} color={"red"} />
                  </TouchableOpacity>
                </View>
              )}

            {bookingQuery.data?.data?.status === BookingStatus.REJECTED && (
              <View
                style={{ backgroundColor: "red" }}
                className="border-secondary-300 p-2 rounded-full flex-row items-center gap-2"
              >
                <View className="size-2 rounded-full bg-white " />
                <Text className="text-xs font-plus-jakarta-bold text-white">
                  Rejected
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-row items-center px-5">
            <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10">
              <FontAwesome5 name="bed" size={16} color={Colors.accent} />
            </View>
            <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
              {bookingQuery.data?.data?.property?.bed}{" "}
              {(bookingQuery.data?.data?.property?.bed ?? 0) > 1
                ? "Beds"
                : "Bed"}
            </Text>
            <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 ml-7">
              <FontAwesome name="bath" size={16} color={Colors.accent} />
            </View>
            <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
              {bookingQuery.data?.data?.property?.bathroom}{" "}
              {(bookingQuery.data?.data?.property?.bathroom ?? 0) > 1
                ? "Bathrooms"
                : "Bathroom"}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-start gap-2 px-5">
            <Entypo name="location" size={16} color={Colors.accent} />
            <Text className="text-black-200 text-sm font-plus-jakarta-medium">
              {bookingQuery.data?.data?.property?.location}
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
              {formatDate(bookingQuery.data?.data?.startDate ?? "")}
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
            <Text className="font-plus-jakarta-semibold">
              {bookingQuery.data?.data?.checkIn || "--"}
            </Text>
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
              {formatDate(bookingQuery.data?.data?.endDate ?? "")}
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
            <Text className="font-plus-jakarta-semibold">
              {bookingQuery.data?.data?.checkOut || "--"}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <FontAwesome6 name="house" size={19} color={"darkgrey"} />
              </View>
              <Text className="font-plus-jakarta-regular">Type</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">
              {bookingQuery.data?.data?.property?.type}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <FontAwesome5 name="phone" size={18} color={"darkgrey"} />
              </View>
              <Text className="font-plus-jakarta-regular">Phone</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">
              {convertToInternationalPhoneNumber(
                bookingQuery.data?.data?.host?.phone
              )}
            </Text>
          </View>

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Price Details</Text>
          </View>
          <View className="my-5">
            <View className="flex-row px-5 justify-between items-center pb-2">
              <Text className="font-plus-jakarta-regular">Price</Text>
              <Text className="font-plus-jakarta-semibold">
                ₦ {Commafy(bookingQuery.data?.data?.invoice?.price)}
              </Text>
            </View>
            <Text className="self-end px-5 text-gray-400 text-xs">
              ₦ {Commafy(bookingQuery.data?.data?.invoice?.subPrice)} {" x"}{" "}
              {bookingQuery.data?.data?.invoice?.period}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Caution Fee</Text>
            <Text className="font-plus-jakarta-semibold">
              ₦ {Commafy(bookingQuery.data?.data?.invoice?.cautionFee)}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">SubTotal</Text>
            <Text className="font-plus-jakarta-semibold">
              ₦ {Commafy(bookingQuery.data?.data?.invoice?.subTotal)}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Service Fee</Text>
            <Text className="font-plus-jakarta-semibold">
              - ₦{" "}
              {Commafy(
                bookingQuery.data?.data?.invoice?.[
                  userType?.toLowerCase() + "ServiceFee"
                ]
              )}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-bold">Total</Text>
            <Text className="font-plus-jakarta-bold text-xl">
              ₦{" "}
              {Commafy(
                bookingQuery.data?.data?.invoice?.[
                  userType?.toLowerCase() + "Total"
                ]
              )}
            </Text>
          </View>

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Guest Details</Text>
          </View>

          <View className="flex-row px-5 justify-center items-center my-5">
            <Image
              source={{ uri: bookingQuery.data?.data?.guest?.avatar }}
              style={styles.guestImg}
            />
          </View>
          <View className="flex-row px-5 justify-between items-center my-5">
            <Text className="font-plus-jakarta-regular">Name</Text>
            <Text className="font-plus-jakarta-semibold">
              {bookingQuery.data?.data?.guest?.name}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Mail</Text>
            <Text className="font-plus-jakarta-semibold">
              {bookingQuery.data?.data?.guest?.email}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Phone Number</Text>
            <Text className="font-plus-jakarta-semibold">
              {convertToInternationalPhoneNumber(
                bookingQuery.data?.data?.guest?.phone
              )}
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
