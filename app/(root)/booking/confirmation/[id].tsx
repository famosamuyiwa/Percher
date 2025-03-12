import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
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
import { Paystack } from "react-native-paystack-webview";
import PaystackCheckout from "@/hooks/usePaystack";
import CustomButton from "@/components/Button";

const BookingConfirmation = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [isClicked, setIsClicked] = useState(false);

  const newEmail: any = "barrakudadev@gmail.com";
  const handleOnMakePayment = () => {
    if (newEmail) setIsClicked(true);
  };

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
        <ScrollView>
          <View className="flex-row gap-5 px-5">
            <Image
              style={styles.propertyImg}
              source={images.newYork}
              contentFit="cover"
            />
            <View className="flex-1">
              <View className="flex-1 justify-around">
                <View className="flex-row justify-between">
                  <Text className="font-plus-jakarta-bold text-sm">
                    Famosa Hightowers
                  </Text>
                  <View className="flex-row gap-1 items-center">
                    <AntDesign name="star" size={14} color="gold" />
                    <Text className="font-plus-jakarta-regular text-sm ">
                      5.0
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-row">
                    <View className="flex flex-row items-center justify-center bg-secondary-100 rounded-full size-5">
                      <FontAwesome5
                        name="bed"
                        size={10}
                        color={Colors.secondary}
                      />
                    </View>
                    <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-1">
                      3
                    </Text>
                  </View>
                  <View className="flex-row">
                    <View className="flex flex-row items-center justify-center bg-secondary-100 rounded-full size-5">
                      <FontAwesome
                        name="bath"
                        size={10}
                        color={Colors.secondary}
                      />
                    </View>
                    <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-1">
                      2
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 items-baseline">
                  <Entypo name="location" size={14} color={Colors.secondary} />
                  <Text className="font-plus-jakarta-regular text-sm">
                    Lagos, Nigeria
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-plus-jakarta-bold text-secondary-300 text-sm">
                    ₦150,000.00
                  </Text>
                  <Text className="text-xs text-gray-400"> per night</Text>
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

          <View className="flex-1 justify-end py-10 px-5">
            <CustomButton label="Make payment" onPress={handleOnMakePayment} />
          </View>
        </ScrollView>
        {isClicked && (
          <PaystackCheckout
            billingDetail={{
              amount: 50000,
              billingEmail: newEmail,
              billingName: "Nen Ling",
              billingMobile: "08033044770",
            }}
            clicked={isClicked}
            onEnd={() => {
              setIsClicked(false);
            }}
            onSuccess={() => router.replace("/bookings")}
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
