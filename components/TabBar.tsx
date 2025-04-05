import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/common";
import { useAuthenticatedScreensContext } from "@/lib/authenticated-screens-provider";

type RouteName = "index" | "explore" | "bookings" | "profile"; // Define valid route names

const TabBar = ({ state, descriptors, navigation }: any) => {
  const { unreadCount } = useAuthenticatedScreensContext();
  const tabIconDefault = "#666876";
  const tabIconSelected = Colors.primary;
  const icons = {
    index: (props: any) => {
      let name = "home";
      if (!props.isFocused) name = "home-outline";
      return (
        <View>
          <Ionicons name={name} size={26} color={tabIconDefault} {...props} />
          {unreadCount > 0 && (
            <View className="absolute -right-1 -top-1 w-4 h-4 bg-accent-300 border-2 border-white rounded-full" />
          )}
        </View>
      );
    },
    explore: (props: any) => {
      let name = "search";
      if (!props.isFocused) name = "search-outline";
      return (
        <Ionicons name={name} size={26} color={tabIconDefault} {...props} />
      );
    },
    bookings: (props: any) => {
      let name = "ticket";
      if (!props.isFocused) name = "ticket-outline";
      return (
        <Ionicons name={name} size={26} color={tabIconDefault} {...props} />
      );
    },
    profile: (props: any) => {
      let name = "person";
      if (!props.isFocused) name = "person-outline";

      return (
        <Ionicons name={name} size={26} color={tabIconDefault} {...props} />
      );
    },
  };

  // Platform-specific background color
  const platformBackgroundColor =
    Platform.OS === "ios" ? "rgba(255,255,255,0.05)" : "white";

  return (
    <View style={styles.wrapper}>
      <BlurView
        experimentalBlurMethod="none"
        intensity={20}
        tint="light"
        style={[styles.tabBar, { backgroundColor: platformBackgroundColor }]}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          if (["_sitemap", "+not-found", ""].includes(route.name)) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key} // Add this line to provide a unique key
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBarItem}
            >
              {icons[route.name as RouteName]({
                color: isFocused ? tabIconSelected : tabIconDefault,
                isFocused,
              })}
              <Text
                className={`font-plus-jakarta-regular text-xs ${
                  isFocused ? "text-primary-300" : "#666876"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "absolute",
    flexDirection: "row",
    bottom: 25,
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "rgba(0, 0, 0, 0.1)", // Black shadow
    shadowOffset: { width: 5, height: 3 }, // Offset of the shadow
    shadowOpacity: 0.15, // How transparent the shadow is
    shadowRadius: 30, // How blurry the shadow looks
    elevation: 30, // Only for Android
  },

  tabBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    height: 70,
    overflow: "hidden",
    borderRadius: 25,
  },

  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    flexDirection: "column",
  },

  activeIconBar: {
    height: 4,
    width: "30%",
    backgroundColor: Colors.primary,
    position: "absolute",
    bottom: 0,
    borderRadius: 25,
  },

  addBtn: {
    width: 50,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderColor: "white",
    marginHorizontal: 10,
  },

  text: {
    fontSize: 30,
    color: "white",
  },
});
export default TabBar;
