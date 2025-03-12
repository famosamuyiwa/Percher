import { CalendarTheme } from "@marceloterreiro/flash-calendar";

export const Colors = {
  primary: "#00BFFF",
  secondary: "#FF7F50",
  accent: "#1F2430",
};

export const CalendarRangeTheme: CalendarTheme = {
  rowMonth: {
    content: {
      color: Colors.accent,
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 0.4,
      borderBottomColor: "lightgrey",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: Colors.accent } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: Colors.primary,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? Colors.primary : "transparent",
        borderRadius: 4,
      },
      content: {
        color: !isPressed ? Colors.accent : "#ffffff",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: Colors.primary,
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? Colors.primary : "transparent",
      },
      content: {
        color: isPressed ? "#ffffff" : Colors.accent,
      },
    }),
    active: ({ isEndOfRange, isStartOfRange, isDisabled }) => ({
      container: {
        backgroundColor: isDisabled ? "lightgrey" : Colors.primary,
        borderTopLeftRadius: isStartOfRange ? 4 : 0,
        borderBottomLeftRadius: isStartOfRange ? 4 : 0,
        borderTopRightRadius: isEndOfRange ? 4 : 0,
        borderBottomRightRadius: isEndOfRange ? 4 : 0,
      },
      content: {
        color: isDisabled ? "darkgrey" : "white",
      },
    }),
    disabled: ({ isEndOfRange, isStartOfRange }) => ({
      content: {
        color: "lightgrey",
      },
    }),
  },
};
