import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalStore } from "@/store/store";
import { ChargeType, CheckOutTime } from "@/constants/enums";
import { BookingFormData, Booking as BookingInterface } from "@/interfaces";
import {
  GUEST_SERVICE_FEE_PERCENTAGE,
  HOST_SERVICE_FEE_PERCENTAGE,
} from "@/environment";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import BookingForm from "@/components/forms/Booking";
import { splitAndTrim } from "@/utils/common";

const Booking = () => {
  const { id, chargeType } = useLocalSearchParams<{
    id: string;
    chargeType: ChargeType;
  }>();
  const { property, saveBookingState, resetBookingState } = useGlobalStore();

  const handleOnContinue = (formData: BookingFormData) => {
    if (!property || !formData.departureDate || !formData.arrivalDate) return;

    const subPrice = Number(property.price);
    const period = differenceInCalendarDays(
      formData.departureDate,
      formData.arrivalDate
    );
    const price = subPrice * period;
    const cautionFee = Number(property.cautionFee);
    const subTotal = price + cautionFee;
    const guestServiceFee = subPrice * (GUEST_SERVICE_FEE_PERCENTAGE / 100);
    const hostServiceFee = subPrice * (HOST_SERVICE_FEE_PERCENTAGE / 100);
    const hostTotal = subTotal - hostServiceFee;
    const guestTotal = subTotal + guestServiceFee;

    const invoice = {
      price,
      subPrice,
      period,
      cautionFee,
      subTotal,
      guestServiceFee,
      hostServiceFee,
      hostTotal,
      guestTotal,
    };

    const booking: Partial<BookingInterface> = {
      startDate: formData.arrivalDate,
      endDate: formData.departureDate,
      checkIn: formData.checkInTime,
      checkOut: formData.checkOutTime,
      chargeType,
      propertyId: property?.id,
      hostId: property?.host?.id!,
      invoice,
    };

    saveBookingState(undefined, booking);
    router.push(`/booking/confirmation/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 w-full rounded-3xl bg-white">
      <View className="flex-1 px-5 my-2">
        <View className="mb-2 items-center justify-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute -left-2"
          >
            <Ionicons name="arrow-back-circle-sharp" size={40} />
          </TouchableOpacity>
          <Text className="font-plus-jakarta-bold text-lg">
            Perching Details
          </Text>
          <View />
        </View>
        <View style={{ flex: 1 }}>
          <BookingForm
            data={{} as BookingFormData}
            staticData={{
              chargeType,
              checkInPeriod: property?.checkInPeriods,
              checkOutPeriod: [property?.checkOutPeriod],
            }}
            onSubmit={(formData: BookingFormData) => handleOnContinue(formData)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Booking;
