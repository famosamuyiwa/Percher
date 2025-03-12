import type { CalendarListProps } from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  fromDateId,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { useMemo } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { format } from "date-fns/fp";
import { CalendarRangeTheme } from "@/constants/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { addDays } from "date-fns/addDays";

export default function CalendarList({
  onBack,
}: {
  onBack: (startDate: Date | undefined, endDate: Date | undefined) => void;
}) {
  const calendarListProps = useMemo<Partial<CalendarListProps>>(() => {
    const today = new Date();
    return {
      calendarInitialMonthId: toDateId(today),
      calendarMinDateId: toDateId(today),
    };
  }, []);

  const {
    isDateRangeValid,
    onClearDateRange,
    calendarActiveDateRanges,
    dateRange,
    onCalendarDayPress,
  } = useDateRange();
  const calendarDisabledDateIds = useMemo(
    () => ["2025-03-14", "2025-03-15"],
    []
  );

  const weekDayFormat = useMemo(() => format("EE"), []);

  const handleOnBack = () => {
    if (!dateRange.startId) return onBack(undefined, undefined);

    onBack(
      fromDateId(dateRange.startId),
      addDays(fromDateId(dateRange.endId ?? dateRange.startId), 1)
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View className="mb-8 items-center justify-center w-11/12">
        <TouchableOpacity onPress={handleOnBack} className="absolute -left-2">
          <Ionicons name="arrow-back-circle-sharp" size={40} />
        </TouchableOpacity>
        <Text className="font-plus-jakarta-bold text-lg">Calendar</Text>
        <View />
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          {...calendarListProps}
          calendarActiveDateRanges={calendarActiveDateRanges}
          onCalendarDayPress={onCalendarDayPress}
          calendarColorScheme={"light"}
          calendarDisabledDateIds={calendarDisabledDateIds}
          theme={CalendarRangeTheme}
          getCalendarWeekDayFormat={weekDayFormat}
        />
      </View>
      {/* <Calendar.HStack
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Button onPress={onClearDateRange} title="Clear range" />
        <View style={styles.vStack}>
          <Text>Start: {dateRange.startId ?? "?"}</Text>
          <Text>End: {dateRange.endId ?? "?"}</Text>
        </View>
        <View style={styles.vStack}>
          <Text>Is range valid?</Text>
          <Text>{isDateRangeValid ? "✅" : "❌"}</Text>
        </View>
      </Calendar.HStack> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    justifyContent: "space-between",
  },
  vStack: {
    gap: 4,
  },
});
