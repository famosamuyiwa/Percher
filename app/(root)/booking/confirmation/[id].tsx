import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import images from "@/constants/images";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import PaystackCheckout from "@/hooks/usePaystack";
import CustomButton from "@/components/Button";
import { useCreateBookingMutation } from "@/hooks/mutation/useBookingMutation";
import { useGlobalStore } from "@/store/store";
import { useGlobalContext } from "@/lib/global-provider";
import {
  Commafy,
  convertToInternationalPhoneNumber,
  formatDate,
} from "@/utils/common";
import { GUEST_SERVICE_FEE_PERCENTAGE } from "@/environment";

const BookingConfirmation = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { booking, property } = useGlobalStore();
  const { user } = useGlobalContext();
  const createBookingMutation = useCreateBookingMutation();
  const [invoice, setInvoice] = useState({
    price: 0,
    totalPrice: 0,
    cautionFee: 0,
    subTotal: 0,
    serviceFee: 0,
    total: 0,
  });
  const [isClicked, setIsClicked] = useState(false);

  const handleOnMakePayment = () => {
    if (!booking) return;
    createBookingMutation.mutate(booking, { onSettled, onSuccess });
  };

  const onSettled = () => {};

  const onSuccess = () => {
    if (user?.email) setIsClicked(true);
  };

  const handleOnPaymentSuccess = () => {
    router.replace("/bookings");
  };

  useEffect(() => {
    if (!booking || !property) return;

    const price = Number(property.price);
    const totalPrice = price * 2; //change 2 to stay period in digit
    const cautionFee = Number(property.cautionFee);
    const subTotal = totalPrice + cautionFee;
    const serviceFee = subTotal * (GUEST_SERVICE_FEE_PERCENTAGE / 100);
    const total = subTotal + serviceFee;
    setInvoice({
      price,
      totalPrice,
      cautionFee,
      subTotal,
      serviceFee,
      total,
    });
  }, [booking, property]);

  return (
    <SafeAreaView className="pb-5 flex-1 bg-white">
      <View className="my-2 py-4">
        <View className="pb-8 flex-row justify-between items-baseline px-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="font-plus-jakarta-regular text-primary-300">
              Back
            </Text>
          </TouchableOpacity>
          <Text className="font-plus-jakarta-bold text-lg">
            Perching Confirmation
          </Text>
          <TouchableOpacity onPress={() => router.dismiss(2)}>
            <Text className="font-plus-jakarta-regular text-red-500">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row gap-5 px-5">
            <Image
              style={styles.propertyImg}
              source={{ uri: property?.header }}
              contentFit="cover"
            />
            <View className="flex-1">
              <View className="flex-1 justify-around">
                <View className="flex-row justify-between">
                  <Text className="font-plus-jakarta-bold text-sm">
                    {property?.name}
                  </Text>
                  <View className="flex-row gap-1 items-center">
                    <AntDesign name="star" size={14} color="gold" />
                    <Text className="font-plus-jakarta-regular text-sm ">
                      {property?.rating ?? 0}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-row">
                    <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-5">
                      <FontAwesome5
                        name="bed"
                        size={10}
                        color={Colors.accent}
                      />
                    </View>
                    <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-1">
                      {property?.bed}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-5">
                      <FontAwesome
                        name="bath"
                        size={10}
                        color={Colors.accent}
                      />
                    </View>
                    <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-1">
                      {property?.bathroom}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 items-baseline">
                  <Entypo name="location" size={14} color={Colors.accent} />
                  <Text className="font-plus-jakarta-regular text-sm">
                    {property?.location}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-plus-jakarta-bold text-accent-300 text-sm">
                    {Commafy(property?.price ?? 0)}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {" "}
                    {property?.chargeType?.toLowerCase()}
                  </Text>
                </View>
              </View>
            </View>
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
              {formatDate(booking?.startDate ?? "") ?? "-"}
            </Text>
          </View>
          {booking?.checkIn && (
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
                {booking.checkIn}
              </Text>
            </View>
          )}
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
              {formatDate(booking?.endDate ?? "") ?? "-"}
            </Text>
          </View>
          {booking?.checkOut && (
            <View className="flex-row px-5 justify-between items-center mb-5">
              <View className="flex-row items-center gap-2">
                <View className="w-8">
                  <MaterialCommunityIcons
                    name="clock-time-nine"
                    size={22}
                    color={"darkgrey"}
                  />
                </View>
                <Text className="font-plus-jakarta-regular">
                  Check-Out Time
                </Text>
              </View>
              <Text className="font-plus-jakarta-semibold">
                {booking.checkOut}
              </Text>
            </View>
          )}
          <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <FontAwesome6 name="house" size={19} color={"darkgrey"} />
              </View>
              <Text className="font-plus-jakarta-regular">Type</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">{property?.type}</Text>
          </View>
          {/* <View className="flex-row px-5 justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-8">
                <FontAwesome5 name="phone" size={18} color={"darkgrey"} />
              </View>
              <Text className="font-plus-jakarta-regular">Phone</Text>
            </View>
            <Text className="font-plus-jakarta-semibold">
              (+234)-803-304-4770
            </Text>
          </View> */}

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Price Details</Text>
          </View>
          <View className="my-5">
            <View className="flex-row px-5 justify-between items-center pb-2">
              <Text className="font-plus-jakarta-regular">Price</Text>
              <Text className="font-plus-jakarta-semibold">
                ₦ {Commafy(invoice.totalPrice)}
              </Text>
            </View>
            <Text className="self-end px-5 text-gray-400 text-xs">
              ₦ {Commafy(invoice.price)} {" x"}2
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Caution Fee</Text>
            <Text className="font-plus-jakarta-semibold">
              ₦ {Commafy(invoice.cautionFee)}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">SubTotal</Text>
            <Text className="font-plus-jakarta-semibold">
              ₦ {Commafy(invoice.subTotal)}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Service Fee</Text>
            <Text className="font-plus-jakarta-semibold">
              ₦ {Commafy(invoice.serviceFee)}
            </Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-bold">Total</Text>
            <Text className="font-plus-jakarta-bold text-xl">
              ₦ {Commafy(invoice.total)}
            </Text>
          </View>

          <View className="bg-gray-100 py-3 my-5 px-5">
            <Text className="font-plus-jakarta-semibold">Guest Details</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center my-5">
            <Text className="font-plus-jakarta-regular">Name</Text>
            <Text className="font-plus-jakarta-semibold">{user?.name}</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Mail</Text>
            <Text className="font-plus-jakarta-semibold">{user?.email}</Text>
          </View>
          <View className="flex-row px-5 justify-between items-center mb-5">
            <Text className="font-plus-jakarta-regular">Phone Number</Text>
            <Text className="font-plus-jakarta-semibold">
              {convertToInternationalPhoneNumber(user?.phone)}
            </Text>
          </View>

          <View className="flex-1 justify-end py-10 px-5">
            <CustomButton label="Make payment" onPress={handleOnMakePayment} />
          </View>
        </ScrollView>
        {isClicked && (
          <PaystackCheckout
            billingDetail={{
              amount: invoice.total,
              billingEmail: user?.email!,
              billingName: user?.name!,
              billingMobile: user?.phone!,
            }}
            clicked={isClicked}
            onEnd={() => {
              setIsClicked(false);
            }}
            onSuccess={handleOnPaymentSuccess}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  propertyImg: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});

export default BookingConfirmation;
