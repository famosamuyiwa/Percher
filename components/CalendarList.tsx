import type { CalendarListProps as FlashCalendarListProps } from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  fromDateId,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useMemo, memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { format } from "date-fns/fp";
import { CalendarRangeTheme } from "@/constants/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { addDays } from "date-fns/addDays";

interface CalendarListComponentProps {
  onBack: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

// Memoized header component to prevent unnecessary re-renders
const Header = memo(({ onBack }: { onBack: () => void }) => (
  <View className="mb-8 items-center justify-center w-11/12">
    <TouchableOpacity onPress={onBack} className="absolute -left-2">
      <Ionicons name="arrow-back-circle-sharp" size={40} />
    </TouchableOpacity>
    <Text className="font-plus-jakarta-bold text-lg">Calendar</Text>
    <View />
  </View>
));

export default function CalendarList({ onBack }: CalendarListComponentProps) {
  const insets = useSafeAreaInsets();

  if (!insets) {
    return null; // Prevents glitching by waiting for insets
  }

  // Memoize initial props
  const calendarListProps = useMemo<Partial<FlashCalendarListProps>>(() => {
    const today = new Date();
    return {
      calendarInitialMonthId: toDateId(today),
      calendarMinDateId: toDateId(today),
    };
  }, []);

  // Memoize date range hook
  const {
    isDateRangeValid,
    onClearDateRange,
    calendarActiveDateRanges,
    dateRange,
    onCalendarDayPress,
  } = useDateRange();

  // Memoize disabled dates
  const calendarDisabledDateIds = useMemo(
    () => ["2025-03-14", "2025-03-15"],
    []
  );

  // Memoize week day format
  const weekDayFormat = useMemo(() => format("EE"), []);

  // Memoize back handler
  const handleOnBack = useCallback(() => {
    if (!dateRange.startId) {
      onBack(undefined, undefined);
      return;
    }

    onBack(
      fromDateId(dateRange.startId),
      addDays(fromDateId(dateRange.endId ?? dateRange.startId), 1)
    );
  }, [dateRange.startId, dateRange.endId, onBack]);

  // Memoize calendar component props
  const calendarProps = useMemo(
    () => ({
      ...calendarListProps,
      calendarActiveDateRanges,
      onCalendarDayPress,
      calendarColorScheme: "light" as const,
      calendarDisabledDateIds,
      theme: CalendarRangeTheme,
      getCalendarWeekDayFormat: weekDayFormat,
    }),
    [
      calendarListProps,
      calendarActiveDateRanges,
      onCalendarDayPress,
      calendarDisabledDateIds,
      weekDayFormat,
    ]
  );

  return (
    <View style={styles.container}>
      <Header onBack={handleOnBack} />
      <View style={styles.calendarContainer}>
        <Calendar.List {...calendarProps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarContainer: {
    flex: 1,
    width: "100%",
  },
});
