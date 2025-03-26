import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import SettingsItem from "@/components/SettingsItem";
import { Colors } from "@/constants/common";
import { useGlobalContext } from "@/lib/global-provider";
import { logout } from "@/api/api.service";
import images from "@/constants/images";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Screens, ToastType } from "@/constants/enums";

const Profile = () => {
  const { user, refetch, displayToast, alertComingSoon } = useGlobalContext();

  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      refetch();
    } else {
      displayToast({
        type: ToastType.ERROR,
        description: "An error occurred while logging out",
      });
    }
  };

  const showPrompt = () => {
    Alert.alert(
      "Logout", // Title of the alert
      "Are you sure you want to proceed?", // Message
      [
        {
          text: "Cancel", // Cancel button
          onPress: () => {},
          style: "cancel", // Makes the text bold to highlight as a cancel action
        },
        {
          text: "Confirm", // Confirm button
          onPress: handleLogout,
        },
      ],
      { cancelable: true } // Allows dismissing the alert by tapping outside of it
    );
  };

  const handleNavigation = (screen: Screens) => {
    let route: any;
    switch (screen) {
      case Screens.NOTIFICATIONS:
      case Screens.APPEARANCE:
      case Screens.SECURITY:
      case Screens.HELP:
      case Screens.REFERRALS:
        alertComingSoon();
        break;
      case Screens.MY_PERCHS:
        route = "/(root)/(settings)/my-perchs";
        break;
      case Screens.PAYMENTS:
        route = "/(root)/(settings)/payments";
        break;
      default:
        route = "/";
    }
    if (!route) return;
    router.navigate(route);
  };

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
      className="flex-1"
    >
      <SafeAreaView style={styles.container} className="h-full px-5">
        <ScrollView
          className="py-5 "
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.navigate("/(root)/(settings)/profile")}
            className="flex-row items-center justify-between my-2"
            style={styles.itemsContainer}
          >
            <View className="flex-row">
              <Image
                style={styles.avatar}
                source={{ uri: user?.avatar }}
                contentFit="cover"
              />
              <View className="px-5 justify-center">
                <Text className="text-xl font-plus-jakarta-medium">
                  {user?.name}
                </Text>
                <Text
                  className="text-sm font-plus-jakarta-regular"
                  style={{ color: Colors.primary }}
                >
                  Edit profile
                </Text>
              </View>
            </View>
            <View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.primary}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.itemsContainer} className="my-4">
            <TouchableOpacity style={styles.borderedItem}>
              <SettingsItem
                icon={
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    color={Colors.primary}
                    size={20}
                  />
                }
                title="Notifications"
                onPress={() => handleNavigation(Screens.NOTIFICATIONS)}
              />
            </TouchableOpacity>
            <View style={styles.borderedItem} className="pt-2">
              <SettingsItem
                icon={
                  <FontAwesome6
                    name="house-chimney-user"
                    color={Colors.primary}
                    size={18}
                  />
                }
                title="My Perchs"
                onPress={() => handleNavigation(Screens.MY_PERCHS)}
              />
            </View>
            <View className="pt-2">
              <SettingsItem
                icon={
                  <MaterialIcons
                    name="currency-exchange"
                    color={Colors.primary}
                    size={20}
                  />
                }
                title="Payments"
                onPress={() => handleNavigation(Screens.PAYMENTS)}
              />
            </View>
          </View>
          <View style={styles.itemsContainer} className="my-4">
            <View style={styles.borderedItem}>
              <SettingsItem
                icon={
                  <Ionicons
                    name="invert-mode-sharp"
                    color={Colors.primary}
                    size={20}
                  />
                }
                title="Appearance"
                subtitle="System Settings"
                onPress={() => handleNavigation(Screens.APPEARANCE)}
              />
            </View>
            <View>
              <SettingsItem
                icon={
                  <MaterialIcons name="lock" color={Colors.primary} size={20} />
                }
                title="Security"
                onPress={() => handleNavigation(Screens.SECURITY)}
              />
            </View>
          </View>
          <View style={styles.itemsContainer} className="my-4">
            <View style={styles.borderedItem}>
              <SettingsItem
                icon={
                  <Feather
                    name="help-circle"
                    color={Colors.primary}
                    size={20}
                  />
                }
                title="Help"
                onPress={() => handleNavigation(Screens.HELP)}
              />
            </View>
            <View className="pt-2">
              <SettingsItem
                icon={
                  <MaterialIcons
                    name="group-add"
                    color={Colors.primary}
                    size={20}
                  />
                }
                title="Referrals"
                onPress={() => handleNavigation(Screens.REFERRALS)}
              />
            </View>
          </View>
          <View style={styles.itemsContainer} className="mt-4 mb-2">
            <TouchableOpacity onPress={showPrompt} className="flex-row px-2">
              <Ionicons name="exit-outline" size={20} color="red" />
              <Text
                className="px-5 font-plus-jakarta-medium"
                style={{ color: "red" }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-300 font-plus-jakarta-bold px-2 ">
            V-1.0.0
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  itemsContainer: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  borderedItem: {
    borderBottomWidth: 1,
    borderColor: "#F4F4F4",
  },
});

export default Profile;
