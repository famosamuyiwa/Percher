import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Share,
  Text,
} from "react-native";
import { AppGradient } from "@/components/AppGradient";
import { router } from "expo-router";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
// import * as Clipboard from "expo-clipboard";
import { Colors } from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { Toast } from "@/components/animation-toast/components";
import { useGlobalContext } from "@/lib/global-provider";

const ReferralsScreen = () => {
  const tintColor = Colors.primary;
  const { displayToast } = useGlobalContext();

  const copyToClipboard = async () => {
    // if (!authQuery.data?.data?.referralCode) return;
    // await Clipboard.setStringAsync(authQuery.data.data.referralCode);
    alert("Text copied to clipboard!");
  };

  const shareInviteLink = async () => {
    // Check if we have a referral code
    // if (!authQuery.data?.data?.referralCode) {
    //   Alert.alert("Error", "No referral code available");
    //   return;
    // }

    // Construct the referral link
    const inviteLink = `https://yourapp.com/invite/referral-code`;

    // Custom invitation message
    const message = `Hey there! 🎉\n\nI just joined Percher and I thought you'd love it too! Use my referral code to get started:\n\n${inviteLink}\n\nI hope to see you on there! 😄`;

    try {
      // Use React Native's Share API
      const result = await Share.share({
        message: message,
        // optionally specify a title for Android
        title: "Join me on Tabbie!",
      });

      if (result.action === Share.sharedAction) {
        // Shared successfully
      } else if (result.action === Share.dismissedAction) {
        // Share was dismissed
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        // await Clipboard.setStringAsync(message);
        return displayToast({
          type: ToastType.ERROR,
          description: `User with email does not exist`,
        });
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
        return displayToast({
          type: ToastType.ERROR,
          description: `Something went wrong while sharing`,
        });
      }
    }
  };

  return (
    <AppGradient colors={[tintColor, tintColor, "white"]}>
      <View className="my-12">
        <Pressable onPress={() => router.back()} style={styles.arrowBack}>
          <MaterialIcons name="keyboard-backspace" size={16} color="white" />
        </Pressable>
      </View>
      <View>
        <Image
          style={styles.topImage}
          source={require("@/assets/images/refer1.png")}
          contentFit="cover"
          transition={1000}
        />
        <Image
          style={styles.bottomImage}
          source={require("@/assets/images/refer2.png")}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <View className="justify-center items-center">
        <Text className="text-2xl py-2 font-plus-jakarta-bold text-white">
          Refer and Earn
        </Text>
        <Text className="text-sm text-center font-plus-jakarta-regular">
          Invite a friend and earn points for every new user successfully
          registered using your referral code
        </Text>
      </View>
      <View className="items-center pt-8">
        <Text className="text-3xl font-plus-jakarta-bold text-white">
          {/* {authQuery.data?.data.referralPoints} */}
          500
        </Text>
      </View>
      <View className="flex-row justify-between mx-5 mt-8">
        <Text className="text-sm text-white font-plus-jakarta-regular">
          {/* Referral count: {authQuery.data?.data.referralCount} */}
          Referral count: 5
        </Text>
        <Pressable>
          <Text className="text-sm font-plus-jakarta-regular text-white underline">
            View referrals
          </Text>
        </Pressable>
      </View>
      <View className="bg-secondary-300 rounded-2xl flex-row justify-between items-center p-4 mx-5 my-2">
        <View className="gap-5">
          <Text className="text-white font-plus-jakarta-regular">
            Your referral code
          </Text>
          <View className="flex-row gap-4">
            <Text className="text-white font-plus-jakarta-bold">
              {/* {authQuery.data?.data.referralCode} */}
              MUYI-3984
            </Text>
            <Pressable onPress={copyToClipboard}>
              <Ionicons name="copy" color={tintColor} size={24} />
            </Pressable>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={shareInviteLink}
            className="flex-row gap-2 items-center bg-white p-2 rounded-full"
          >
            <Entypo name="share" color={tintColor} size={18} />
            <Text className="text-sm font-plus-jakarta-regular">
              Share invite
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppGradient>
  );
};

const styles = StyleSheet.create({
  arrowBack: {
    height: 28,
    width: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderColor: "white",
    borderWidth: 1,
    position: "absolute",
    marginLeft: 15,
    zIndex: 999,
  },
  topImage: {
    width: "100%",
    height: 120,
    marginVertical: 20,
  },
  bottomImage: {
    width: "100%",
    height: 180,
  },
});

export default ReferralsScreen;
