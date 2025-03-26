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
import { Colors } from "@/constants/common";
import { formatDate } from "@/utils/common";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/Button";
import CalendarList from "@/components/CalendarList";
import { useGlobalStore } from "@/store/store";
import { ChargeType } from "@/constants/enums";
import { Booking as BookingInterface } from "@/interfaces";

const Booking = () => {
  const { id, chargeType } = useLocalSearchParams<{
    id: string;
    chargeType: ChargeType;
  }>();
  const { property, saveBookingState, resetBookingState } = useGlobalStore();

  const [arrivalDate, setArrivalDate] = useState<Date | "">("");
  const [departureDate, setDepartureDate] = useState<Date | "">("");
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [checkInModalVisible, setCheckInModalVisible] = useState(false);
  const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);

  useEffect(() => {
    setArrivalDate("");
    setDepartureDate("");
    setCheckInTime("");
    setCheckOutTime("");
  }, []);

  const handleOnContinue = () => {
    if (arrivalDate === "" || departureDate === "" || !property) return;

    const booking: Partial<BookingInterface> = {
      startDate: arrivalDate,
      endDate: departureDate,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      chargeType,
      propertyId: property?.id,
      hostId: property?.host?.id!,
    };

    saveBookingState(undefined, booking);
    router.push(`/booking/confirmation/${id}`);
  };

  const handleOnCalendarModalDismiss = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (startDate && endDate) {
      setArrivalDate(startDate);
      setDepartureDate(endDate);
    }
    setCalendarModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 w-full rounded-3xl bg-white">
      <View className="flex-1 px-5 my-2">
        <View className="mb-8 items-center justify-center">
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
        <View>
          <View className=" gap-5 mb-8 ">
            <Text className=" font-plus-jakarta-semibold ">Period of Stay</Text>
            <TouchableOpacity
              onPress={() => setCalendarModalVisible(true)}
              className="h-10 rounded-lg border-primary-300 flex-row items-center px-2 gap-2"
              style={{ borderWidth: 0.4 }}
            >
              <FontAwesome5
                name="calendar-day"
                size={16}
                color={Colors.primary}
              />
              <Text className="text-sm font-plus-jakarta-regular w-10/12 text-center">
                {formatDate(arrivalDate)} {"   "} - {"   "}{" "}
                {formatDate(departureDate)}
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            visible={calendarModalVisible}
            transparent
            animationType="slide"
          >
            <View style={styles.calendarModalContainer}>
              <CalendarList onBack={handleOnCalendarModalDismiss} />
            </View>
          </Modal>
        </View>
        <View className="flex-row justify-between">
          <View className="w-5/12">
            <View className="gap-5 mb-8 ">
              <Text className=" font-plus-jakarta-semibold">Check-In Time</Text>
              <TouchableOpacity
                onPress={() => setCheckInModalVisible(true)}
                className="h-10 rounded-lg border-primary-300 flex-row items-center px-2 gap-2"
                style={{ borderWidth: 0.4 }}
              >
                <Entypo name="back-in-time" size={16} color={Colors.primary} />
                <Modal
                  visible={checkInModalVisible}
                  transparent
                  animationType="slide"
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={checkInTime}
                        onValueChange={(itemValue) => setCheckInTime(itemValue)}
                        itemStyle={{
                          color: "black", // Set text color
                          fontSize: 18, // Set font size
                        }}
                      >
                        {property?.checkInPeriods?.map(
                          (period: string, index: number) => (
                            <Picker.Item
                              key={index}
                              label={period}
                              value={period}
                            />
                          )
                        )}
                      </Picker>
                      <Button
                        title="Done"
                        onPress={() => setCheckInModalVisible(false)}
                      />
                    </View>
                  </View>
                </Modal>
                <Text className="text-sm font-plus-jakarta-regular w-10/12">
                  {checkInTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-5/12">
            <View className=" gap-5 mb-8 ">
              <Text className=" font-plus-jakarta-semibold">
                Check-Out Time
              </Text>
              <TouchableOpacity
                onPress={() => setCheckOutModalVisible(true)}
                className="h-10 rounded-lg border-primary-300 flex-row items-center px-2 gap-2"
                style={{ borderWidth: 0.4 }}
              >
                <Entypo name="back-in-time" size={16} color={Colors.primary} />
                <Modal
                  visible={checkOutModalVisible}
                  transparent
                  animationType="slide"
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={checkOutTime}
                        onValueChange={(itemValue) =>
                          setCheckOutTime(itemValue)
                        }
                        itemStyle={{
                          color: "black", // Set text color
                          fontSize: 18, // Set font size
                        }}
                      >
                        <Picker.Item
                          label={property?.checkOutPeriod}
                          value={property?.checkOutPeriod}
                        />
                      </Picker>
                      <Button
                        title="Done"
                        onPress={() => setCheckOutModalVisible(false)}
                      />
                    </View>
                  </View>
                </Modal>
                <Text className="text-sm font-plus-jakarta-regular w-10/12">
                  {checkOutTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View className="flex-row items-center gap-5 mb-5 justify-between">
          <Text className=" font-plus-jakarta-semibold">
            Availability Status
          </Text>
          <View className="border-secondary-300 bg-green-500 p-2 rounded-full flex-row items-center gap-2">
            <View className="size-2 rounded-full bg-white " />
            <Text className="text-xs font-plus-jakarta-bold text-white">
              Available
            </Text>
          </View>
        </View> */}

        <View className="flex-1 justify-end py-10">
          <CustomButton label="Continue" onPress={handleOnContinue} />
        </View>
      </View>
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
  calendarModalContainer: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "white",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
    color: "black",
  },
});

export default Booking;
