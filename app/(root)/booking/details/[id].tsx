import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
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
import { useReviewBookingMutation } from "@/hooks/mutation/useBookingMutation";

// Components
const PropertyHeader = ({ header, onBack, onViewProperty, userType }: any) => {
  const windowHeight = Dimensions.get("window").height;

  return (
    <View className="relative w-full" style={{ height: windowHeight / 5 }}>
      <Image
        source={{ uri: header }}
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
            onPress={onBack}
            className="flex flex-row rounded-full size-11 items-center justify-center bg-white"
          >
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>

          {userType === UserType.GUEST && (
            <TouchableOpacity
              onPress={onViewProperty}
              className="flex flex-row rounded-full size-11 items-center justify-center bg-white"
            >
              <MaterialCommunityIcons name="home-search" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const PropertyInfo = ({ property, userType, booking, showPrompt }: any) => (
  <View className="mt-7 flex gap-2">
    <View className="px-5 flex-row justify-between items-center">
      <Text className="text-2xl font-plus-jakarta-extrabold">
        {property?.name}
      </Text>
      <View>
        {booking?.status && <BookingStatusBadge status={booking.status} />}
        <ActionButtons
          userType={userType}
          status={booking?.status}
          onApprove={() => showPrompt(ReviewAction.APPROVE)}
          onReject={() => showPrompt(ReviewAction.REJECT)}
        />
      </View>
    </View>

    <View className="flex flex-row items-center px-5">
      <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10">
        <FontAwesome5 name="bed" size={16} color={Colors.accent} />
      </View>
      <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
        {property?.bed} {(property?.bed ?? 0) > 1 ? "Beds" : "Bed"}
      </Text>
      <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 ml-7">
        <FontAwesome name="bath" size={16} color={Colors.accent} />
      </View>
      <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
        {property?.bathroom}{" "}
        {(property?.bathroom ?? 0) > 1 ? "Bathrooms" : "Bathroom"}
      </Text>
    </View>

    <View className="flex flex-row items-center justify-start gap-2 px-5">
      <Entypo name="location" size={16} color={Colors.accent} />
      <Text className="text-black-200 text-sm font-plus-jakarta-medium">
        {property?.location}
      </Text>
    </View>
  </View>
);

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  if (status !== BookingStatus.REJECTED) return null;

  return (
    <View
      style={{ backgroundColor: "red" }}
      className="border-secondary-300 p-2 rounded-full flex-row items-center gap-2"
    >
      <View className="size-2 rounded-full bg-white" />
      <Text className="text-xs font-plus-jakarta-bold text-white">
        Rejected
      </Text>
    </View>
  );
};

const ActionButtons = ({ userType, status, onApprove, onReject }: any) => {
  const showContactButtons = useMemo(() => {
    if (userType === UserType.GUEST) {
      return !(
        status === BookingStatus.REJECTED ||
        status === BookingStatus.CANCELLED ||
        status === BookingStatus.PENDING
      );
    }
    return (
      userType === UserType.HOST &&
      !(status === BookingStatus.PENDING || status === BookingStatus.DRAFT) &&
      status !== BookingStatus.REJECTED
    );
  }, [userType, status]);

  const showApprovalButtons = useMemo(() => {
    return userType === UserType.HOST && status === BookingStatus.PENDING;
  }, [userType, status]);

  if (!showContactButtons && !showApprovalButtons) return null;

  return (
    <View className="flex flex-row items-center gap-5">
      {showContactButtons && (
        <>
          <Ionicons name="chatbox-ellipses" size={28} color={Colors.primary} />
          <FontAwesome5 name="phone" size={25} color={Colors.primary} />
        </>
      )}
      {showApprovalButtons && (
        <>
          <TouchableOpacity onPress={onApprove}>
            <Ionicons name="checkmark-circle" size={40} color="limegreen" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onReject}>
            <Ionicons name="close-circle" size={40} color="red" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const BookingDetails = ({ booking }: any) => (
  <>
    <View className="bg-gray-100 py-3 my-5 px-5">
      <Text className="font-plus-jakarta-semibold">Perch Details</Text>
    </View>

    <View className="flex-row px-5 justify-between items-center my-5">
      <View className="flex-row items-center gap-2">
        <View className="w-8">
          <MaterialCommunityIcons
            name="calendar-arrow-right"
            size={25}
            color="darkgrey"
          />
        </View>
        <Text className="font-plus-jakarta-regular">Check-In Date</Text>
      </View>
      <Text className="font-plus-jakarta-semibold">
        {formatDate(booking?.startDate ?? "")}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <View className="flex-row items-center gap-2">
        <View className="w-8">
          <MaterialCommunityIcons
            name="clock-time-three"
            size={22}
            color="darkgrey"
          />
        </View>
        <Text className="font-plus-jakarta-regular">Check-In Time</Text>
      </View>
      <Text className="font-plus-jakarta-semibold">
        {booking?.checkIn || "--"}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <View className="flex-row items-center gap-2">
        <View className="w-8">
          <MaterialCommunityIcons
            name="calendar-arrow-left"
            size={25}
            color="darkgrey"
          />
        </View>
        <Text className="font-plus-jakarta-regular">Check-Out Date</Text>
      </View>
      <Text className="font-plus-jakarta-semibold">
        {formatDate(booking?.endDate ?? "")}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <View className="flex-row items-center gap-2">
        <View className="w-8">
          <MaterialCommunityIcons
            name="clock-time-nine"
            size={22}
            color="darkgrey"
          />
        </View>
        <Text className="font-plus-jakarta-regular">Check-Out Time</Text>
      </View>
      <Text className="font-plus-jakarta-semibold">
        {booking?.checkOut || "--"}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <View className="flex-row items-center gap-2">
        <View className="w-8">
          <FontAwesome6 name="house" size={19} color="darkgrey" />
        </View>
        <Text className="font-plus-jakarta-regular">Type</Text>
      </View>
      <Text className="font-plus-jakarta-semibold">
        {booking?.property?.type}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <View className="flex-row items-center gap-2">
        <View className="w-8">
          <FontAwesome5 name="phone" size={18} color="darkgrey" />
        </View>
        <Text className="font-plus-jakarta-regular">Phone</Text>
      </View>
      <Text className="font-plus-jakarta-semibold">
        {convertToInternationalPhoneNumber(booking?.host?.phone)}
      </Text>
    </View>
  </>
);

const PriceDetails = ({ invoice, userType }: any) => (
  <>
    <View className="bg-gray-100 py-3 my-5 px-5">
      <Text className="font-plus-jakarta-semibold">Price Details</Text>
    </View>
    <View className="my-5">
      <View className="flex-row px-5 justify-between items-center pb-2">
        <Text className="font-plus-jakarta-regular">Price</Text>
        <Text className="font-plus-jakarta-semibold">
          ₦ {Commafy(invoice?.price)}
        </Text>
      </View>
      <Text className="self-end px-5 text-gray-400 text-xs">
        ₦ {Commafy(invoice?.subPrice)} {" x"} {invoice?.period}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <Text className="font-plus-jakarta-regular">Caution Fee</Text>
      <Text className="font-plus-jakarta-semibold">
        ₦ {Commafy(invoice?.cautionFee)}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <Text className="font-plus-jakarta-regular">SubTotal</Text>
      <Text className="font-plus-jakarta-semibold">
        ₦ {Commafy(invoice?.subTotal)}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <Text className="font-plus-jakarta-regular">Service Fee</Text>
      <Text className="font-plus-jakarta-semibold">
        {userType === UserType.GUEST ? "₦" : "- ₦"}
        {Commafy(invoice?.[userType?.toLowerCase() + "ServiceFee"])}
      </Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <Text className="font-plus-jakarta-bold">Total</Text>
      <Text className="font-plus-jakarta-bold text-xl">
        ₦ {Commafy(invoice?.[userType?.toLowerCase() + "Total"])}
      </Text>
    </View>
  </>
);

const GuestDetails = ({ guest }: any) => (
  <>
    <View className="bg-gray-100 py-3 my-5 px-5">
      <Text className="font-plus-jakarta-semibold">Guest Details</Text>
    </View>
    <View className="flex-row px-5 justify-center items-center my-5">
      <Image source={{ uri: guest?.avatar }} style={styles.guestImg} />
    </View>
    <View className="flex-row px-5 justify-between items-center my-5">
      <Text className="font-plus-jakarta-regular">Name</Text>
      <Text className="font-plus-jakarta-semibold">{guest?.name}</Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <Text className="font-plus-jakarta-regular">Mail</Text>
      <Text className="font-plus-jakarta-semibold">{guest?.email}</Text>
    </View>
    <View className="flex-row px-5 justify-between items-center mb-5">
      <Text className="font-plus-jakarta-regular">Phone Number</Text>
      <Text className="font-plus-jakarta-semibold">
        {convertToInternationalPhoneNumber(guest?.phone)}
      </Text>
    </View>
  </>
);

const Details = () => {
  const { id, userType } = useLocalSearchParams<{
    id: string;
    userType?: UserType;
  }>();
  const { displayToast, showLoader, hideLoader } = useGlobalContext();
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
      "Confirmation",
      `Are you sure you want to ${choice} this request?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => handleApproval(choice) },
      ],
      { cancelable: true }
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

  if (bookingQuery.isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (bookingQuery.isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading booking details</Text>
      </View>
    );
  }

  const booking = bookingQuery.data?.data;
  const property = booking?.property;
  const guest = booking?.guest;

  return (
    <View className="bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10 bg-white"
      >
        <PropertyHeader
          header={property?.header}
          onBack={() => router.back()}
          onViewProperty={handleOnViewProperty}
          userType={userType}
        />

        <PropertyInfo
          property={property}
          userType={userType}
          booking={booking}
          showPrompt={showPrompt}
        />
        <BookingDetails booking={booking} />
        <PriceDetails invoice={booking?.invoice} userType={userType} />
        <GuestDetails guest={guest} />

        {userType === UserType.GUEST &&
          booking?.status === BookingStatus.PENDING && (
            <TouchableOpacity className="py-4 items-center" onPress={() => {}}>
              <Text className="font-plus-jakarta-semibold text-red-500">
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}
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
