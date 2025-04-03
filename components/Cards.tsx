import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import icons from "../constants/icons";
import { Booking, Property, Transaction } from "../interfaces";
import { Image } from "expo-image";
import { Commafy, formatDate, formatTime } from "@/utils/common";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import { LinearGradient } from "expo-linear-gradient";
import { BookingStatus, Screens, TransactionMode } from "@/constants/enums";
import Lottie from "lottie-react-native";

interface Props {
  item: Property;
  source?: Screens;
  onPress?: () => void;
}

interface BookingProps {
  item: Booking;
  onPress?: () => void;
}

interface TransactionCardProps {
  item: Transaction; //for now
  onPress?: () => void;
}

export const FeaturedCard = ({ item, onPress }: Props) => {
  return (
    <View className="flex flex-col items-start relative">
      {item.rating && (
        <View className="flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute bottom-5 right-0">
          <Image source={icons.star} style={styles.starLg} />
          <Text className="text-xs font-plus-jakarta-bold text-primary-300 ml-1">
            {item.rating}
          </Text>
        </View>
      )}

      <View className="flex flex-col items-start absolute bottom-5 ">
        <Text
          className="text-xl font-plus-jakarta-extrabold text-white"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-base font-plus-jakarta-regular text-white">
          {item.location}
        </Text>
        <View className="flex flex-row items-center gap-2 w-full">
          <Text className="text-xl font-plus-jakarta-extrabold text-white">
            ₦{Commafy(item.price)}
          </Text>
          <Text className="text-xs font-plus-jakarta-regular text-white">
            {item.chargeType.toLowerCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const Card = ({ item, source, onPress }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      {item.rating && (
        <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
          <Image source={icons.star} style={styles.starSm} />
          <Text className="text-xs font-plus-jakarta-bold text-primary-300 ml-0.5">
            {item.rating}
          </Text>
        </View>
      )}

      <Image source={{ uri: item.header }} style={styles.cardImg} />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-p[us-jakarta-bold text-black-300">
          {item.name}
        </Text>
        <Text className="text-xs font-plus-jakarta-regular text-black-100">
          {item.location}
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <View className="flex flex-row items-center gap-1">
            <Text className="text-base font-plus-jakarta-bold text-primary-300">
              ₦{Commafy(item.price)}
            </Text>
            <Text className="text-xs font-plus-jakarta-regular text-black-100">
              {item.chargeType.toLowerCase()}
            </Text>
          </View>

          {source === Screens.MY_PERCHS && (
            <View
              style={{ backgroundColor: Colors.secondary }}
              className="border-secondary-300 p-2 rounded-full flex-row items-center gap-2"
            >
              <View className="size-2 rounded-full bg-white " />
              <Text className="text-xs font-plus-jakarta-bold text-white">
                {item.status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BookingCardGuest = ({ item, onPress }: BookingProps) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 rounded-3xl bg-secondary-300 shadow-lg shadow-black-100/70 "
      onPress={onPress}
    >
      <View className="flex-row justify-between px-4 py-2">
        <Text className="text-white font-plus-jakarta-bold text-xs">
          {item.property?.name}
        </Text>
        {(item.status === BookingStatus.CURRENT ||
          item.status === BookingStatus.UPCOMING) && (
          <Lottie
            source={require("@/assets/animations/searching.json")}
            loop={item.status !== BookingStatus.UPCOMING}
            autoPlay={item.status !== BookingStatus.UPCOMING}
            style={{
              width: 20,
              height: 20,
            }}
          />
        )}
      </View>

      <View className="bg-white flex-row py-4 rounded-b-3xl">
        <Image
          source={{ uri: item.property?.header }}
          style={styles.bookingCardGuestImg}
        />
        <View className="flex-1 pr-4 gap-2">
          <View className="flex-row justify-between p-r-4">
            <Text className="font-plus-jakarta-regular text-xs">Arrival</Text>
            <Text className="font-plus-jakarta-regular text-xs">
              {formatDate(item.startDate)}. {item.checkIn}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" font-plus-jakarta-regular text-xs">
              Departure
            </Text>
            <Text className=" font-plus-jakarta-regular text-xs">
              {formatDate(item.endDate)}. {item.checkOut}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Entypo name="location" size={14} color={Colors.accent} />
            <Text className=" font-plus-jakarta-regular text-xs">
              {item.property?.location}
            </Text>
          </View>
          <View className="flex-row justify-end">
            <Text className=" font-plus-jakarta-extrabold text-primary-300">
              ₦ {Commafy(item.invoice?.guestTotal)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BookingCardHost = ({ item, onPress }: BookingProps) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 rounded-3xl bg-secondary-300 shadow-lg shadow-black-100/70 "
      onPress={onPress}
    >
      <View className="flex-row justify-between px-4 py-2">
        <Text className="text-white font-plus-jakarta-bold text-xs">
          {item.property?.name}
        </Text>
        {item.status === BookingStatus.CURRENT ||
          (item.status === BookingStatus.UPCOMING && (
            <Lottie
              source={require("@/assets/animations/searching.json")}
              loop={item.status !== BookingStatus.UPCOMING}
              autoPlay={item.status !== BookingStatus.UPCOMING}
              style={{
                width: 20,
                height: 20,
              }}
            />
          ))}
      </View>

      <View className="bg-white flex-row py-4 rounded-b-3xl">
        <Image
          source={{ uri: item.guest?.avatar }}
          style={styles.bookingCardHostImg}
        />
        <View className="flex-1 pr-4 gap-2">
          <View className="flex-row justify-between p-r-4">
            <Text className="font-plus-jakarta-regular text-xs">Arrival</Text>
            <Text className="font-plus-jakarta-regular text-xs">
              {formatDate(item.startDate)}. {item.checkIn}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" font-plus-jakarta-regular text-xs">
              Departure
            </Text>
            <Text className=" font-plus-jakarta-regular text-xs">
              {formatDate(item.endDate)}. {item.checkOut}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Ionicons name="person" size={14} color={Colors.accent} />
            <Text className=" font-plus-jakarta-regular text-xs">
              {item.guest?.name}
            </Text>
          </View>
          <View className="flex-row justify-end">
            <Text className=" font-plus-jakarta-extrabold text-primary-300">
              ₦ {Commafy(item.invoice?.hostTotal)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const TransactionCard = ({ item, onPress }: TransactionCardProps) => {
  return (
    <TouchableOpacity className="flex-1 w-full mt-4" onPress={onPress}>
      <View className="flex-row py-4 rounded-3xl">
        {item.mode === TransactionMode.CREDIT && (
          <View className="px-2">
            <MaterialCommunityIcons
              name="cash-plus"
              color="#22c55e"
              size={40}
            />
          </View>
        )}

        {item.mode === TransactionMode.DEBIT && (
          <View className="px-2">
            <MaterialCommunityIcons
              name="cash-minus"
              color="#ef4444"
              size={40}
            />
          </View>
        )}

        <View className="flex-1 pr-4 gap-2">
          <View className="flex-row justify-between">
            <Text className=" font-plus-jakarta-semibold text-xs">
              {item.mode}
            </Text>
            <Text className=" font-plus-jakarta-regular text-xs">
              {item.createdAt ? formatTime(item.createdAt) : ""}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" font-plus-jakarta-regular text-xs">
              {item.type}
            </Text>
            <Text
              className={`font-plus-jakarta-extrabold ${
                item.mode === TransactionMode.CREDIT
                  ? "text-green-500"
                  : "text-red-500"
              } text-sm`}
            >
              {item.mode === TransactionMode.CREDIT ? "+ " : "-"} ₦
              {Commafy(item.amount)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const GradientCard = ({
  onPress,
  bgColor,
}: {
  onPress: () => void;
  bgColor: string;
}) => {
  return (
    <LinearGradient
      colors={[Colors.primary, bgColor, bgColor]}
      style={{
        borderRadius: 25,
        width: "90%",
        alignSelf: "center",
        marginBottom: 20,
      }}
    >
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          gap: 30,
          alignItems: "center",
        }}
      >
        <Image
          style={styles.houseImg}
          source={require("@/assets/images/house.png")}
          contentFit="contain"
        />
        <Text className="text-sm text-center font-plus-jakarta-regular">
          Get started with easy hosting! Register your first perch to start
          hosting guests all over the world
        </Text>
        <TouchableOpacity onPress={onPress} style={styles.btn}>
          <Text
            className="px-2 font-plus-jakarta-regular"
            style={{ color: "white" }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientImg: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    position: "absolute",
    bottom: 0,
  },
  featuredCardImg: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  starLg: {
    width: 14,
    height: 14,
  },
  starSm: {
    width: 10,
    height: 10,
  },
  cardImg: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  bookingCardGuestImg: {
    height: 80,
    width: 80,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  bookingCardHostImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  transactionCardImg: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  houseImg: {
    height: 60,
    width: 110,
  },
});
