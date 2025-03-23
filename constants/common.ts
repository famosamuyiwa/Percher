import { CalendarTheme } from "@marceloterreiro/flash-calendar";

export const USE_AUTH_QUERY_KEY = ["auth"];
export const USE_PROPERTY_QUERY_KEY = ["property"];
export const USE_FEATURED_PROPERTY_QUERY_KEY = ["property", "featured"];
export const USE_OWNED_PROPERTIES_QUERY_KEY = ["property", "owned"];
export const USE_EXPLORE_PROPERTIES_QUERY_KEY = ["property", "explore"];
export const USE_SINGLE_PROPERTY_QUERY_KEY = ["property", "single"];
export const USE_BOOKING_QUERY_KEY = ["booking"];

export const Colors = {
  primary: "#00BFFF",
  accent: "#FF7F50",
  secondary: "#1F2430",
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
  itemWeekName: { content: { color: Colors.secondary } },
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
        color: !isPressed ? Colors.secondary : "#ffffff",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: Colors.primary,
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? Colors.primary : "transparent",
      },
      content: {
        color: isPressed ? "#ffffff" : Colors.secondary,
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
