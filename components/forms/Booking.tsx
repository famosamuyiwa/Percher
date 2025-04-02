import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, TouchableOpacity, Button, Modal } from "react-native";
import * as z from "zod";
import { useState } from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import useImagePicker from "@/hooks/useImagePicker";
import { Picker } from "@react-native-picker/picker";
import {
  ChargeType,
  CheckOutTime,
  ToastType,
  TransactionType,
} from "@/constants/enums";
import CustomButton from "../Button";
import { useGlobalContext } from "@/lib/global-provider";
import { BookingFormData, FormProps } from "@/interfaces";
import CalendarList from "../CalendarList";
import { formStyles } from "./styles";
import { formatDate } from "@/utils/common";
import { TextField } from "../Textfield";
import Calendar from "../Calendar";

// Validation Schema
const schema = z.object({
  periodOfStay: z.string().min(1, "Required"),
  checkInTime: z.string().min(1, "Required"),
  checkOutTime: z.string().min(1, "Required"),
  periodInDigits: z.number().default(1),
  arrivalDate: z.date().optional(),
  departureDate: z.date().optional(),
});

enum ModalType {
  CALENDAR = "calendar",
  CHECK_IN = "checkIn",
  CHECK_OUT = "checkOut",
}

// Add this function before the BookingForm component
function isCheckOutModal(content: ModalType): content is ModalType.CHECK_OUT {
  return content === ModalType.CHECK_OUT;
}

function isChargeTypeMonthlyOrYearly(chargeType: ChargeType): boolean {
  return chargeType === ChargeType.MONTHLY || chargeType === ChargeType.YEARLY;
}

export default function BookingForm({
  data,
  onSubmit,
  staticData,
}: FormProps<BookingFormData, any>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalType | null>(null);
  const { displayToast } = useGlobalContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: data,
  });

  const periodOfStay = watch("periodOfStay");
  const checkInTime = watch("checkInTime"); // Automatically updates when changed
  const checkOutTime = watch("checkOutTime"); // Automatically updates when changed

  const handleOnSubmit = async (data: any) => {
    try {
      onSubmit(data);
    } catch (err: any) {
      displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    }
  };

  const handleOnCalendarRangeModalDismiss = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (startDate && endDate) {
      setValue(
        "periodOfStay",
        `${formatDate(startDate)} - ${formatDate(endDate)}`
      );
      setValue("arrivalDate", startDate);
      setValue("departureDate", endDate);
    }
    resetModal();
  };

  const handleOnCalendarModalDismiss = (startDate: Date | undefined) => {
    if (startDate) {
      setValue("periodOfStay", `${formatDate(startDate)}`);
      setValue("arrivalDate", startDate);
    }
    resetModal();
  };

  const openModal = (type: ModalType) => {
    setModalContent(type);
    setModalVisible(true);
  };

  const resetModal = () => {
    setModalVisible(false);
  };

  const handleModalDoneClick = (modalContent: ModalType) => {
    switch (modalContent) {
      case ModalType.CHECK_IN:
        if (!checkInTime) setValue("checkInTime", staticData?.checkInPeriod[0]);
        break;
      case ModalType.CHECK_OUT:
        if (!checkOutTime)
          setValue("checkOutTime", staticData?.checkOutPeriod[0]);
        break;
    }
    resetModal();
  };

  return (
    <View className="gap-10">
      <View className="bg-white rounded-2xl p-5 gap-5">
        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 mb-2">
          <Ionicons name="ticket" size={20} color={Colors.accent} />
        </View>
        {staticData?.chargeType !== ChargeType.NIGHTLY && (
          <View className="w-4/12">
            <Controller
              control={control}
              name="periodInDigits"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label={
                    staticData?.chargeType === ChargeType.MONTHLY
                      ? "Number of months"
                      : "Number of years"
                  }
                  placeholder="1"
                  value={value}
                  onValueChange={(text: string) => onChange(Number(text))}
                  style={formStyles.input}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholderColor="darkgrey"
                />
              )}
            />
            {errors.periodInDigits && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.periodInDigits.message}
              </Text>
            )}
          </View>
        )}
        <View>
          <Controller
            control={control}
            name="periodOfStay"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  {isChargeTypeMonthlyOrYearly(staticData?.chargeType)
                    ? "Arrival Date"
                    : "Period of Stay"}
                </Text>
                <TouchableOpacity
                  onPress={() => openModal(ModalType.CALENDAR)}
                  style={formStyles.pickerBtn}
                >
                  <Ionicons name="calendar-number" size={20} />
                  <View className="flex-1 justify-center">
                    <Text className="font-plus-jakarta-regular ">
                      {periodOfStay ??
                        (isChargeTypeMonthlyOrYearly(staticData?.chargeType)
                          ? "-- Pick arrival date --"
                          : "-- Pick range --")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.periodOfStay && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.periodOfStay.message}
            </Text>
          )}
        </View>

        <View className="flex-row gap-5 justify-between ">
          <View className="flex-1">
            <Controller
              control={control}
              name="checkInTime"
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <Text className="text-xs font-plus-jakarta-regular pb-3">
                    Check-In period
                  </Text>
                  <TouchableOpacity
                    onPress={() => openModal(ModalType.CHECK_IN)}
                    style={formStyles.pickerBtn}
                  >
                    <Entypo name="back-in-time" size={20} />
                    <Text className="font-plus-jakarta-regular">
                      {checkInTime ?? "-- Select --"}
                    </Text>
                    <Entypo
                      name="chevron-down"
                      size={16}
                      color={"darkgrey"}
                      className="absolute right-0 px-5"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.checkInTime && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.checkInTime.message}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="checkOutTime"
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <Text className="text-xs font-plus-jakarta-regular pb-3">
                    Check-Out period
                  </Text>
                  <TouchableOpacity
                    onPress={() => openModal(ModalType.CHECK_OUT)}
                    style={formStyles.pickerBtn}
                  >
                    <Entypo name="back-in-time" size={20} />

                    <Text className="font-plus-jakarta-regular">
                      {checkOutTime ?? "-- Select --"}
                    </Text>
                    <Entypo
                      name="chevron-down"
                      size={16}
                      color={"darkgrey"}
                      className="absolute right-0 px-5"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.checkOutTime && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.checkOutTime.message}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-5 my-5 justify-between">
          <Text className=" font-plus-jakarta-semibold">Charge Type</Text>
          <View className="border-secondary-300 bg-secondary-300 p-2 rounded-full flex-row items-center gap-2">
            <View className="size-2 rounded-full bg-white " />
            <Text className="text-xs font-plus-jakarta-bold text-white">
              {staticData?.chargeType}
            </Text>
          </View>
        </View>
      </View>

      <View className="justify-end py-10 px-5">
        <CustomButton
          label="Continue"
          onPress={handleSubmit((data) => {
            handleOnSubmit(data);
          })}
          isDisabled={!isValid}
        />
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        {modalContent === ModalType.CALENDAR && (
          <View style={formStyles.calendarModalContainer}>
            {isChargeTypeMonthlyOrYearly(staticData?.chargeType) ? (
              <Calendar onBack={handleOnCalendarModalDismiss} />
            ) : (
              <CalendarList onBack={handleOnCalendarRangeModalDismiss} />
            )}
          </View>
        )}

        {(modalContent === ModalType.CHECK_OUT ||
          modalContent === ModalType.CHECK_IN) && (
          <View style={formStyles.modalContainer}>
            <View style={formStyles.pickerContainer}>
              <Picker
                selectedValue={
                  isCheckOutModal(modalContent) ? checkOutTime : checkInTime
                }
                onValueChange={(itemValue) => {
                  const fieldName = isCheckOutModal(modalContent)
                    ? "checkOutTime"
                    : "checkInTime";
                  setValue(fieldName, itemValue);
                }}
                itemStyle={{
                  color: "black", // Set text color
                  fontSize: 18, // Set font size
                }}
              >
                {Object.values(
                  isCheckOutModal(modalContent)
                    ? staticData?.checkOutPeriod
                    : staticData?.checkInPeriod
                ).map((type: any) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
              <Button
                title="Done"
                onPress={() => {
                  handleModalDoneClick(modalContent);
                }}
              />
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
