import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { useGlobalContext } from "../lib/global-provider";
import { Redirect, router } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LoginProvider, ToastType } from "@/constants/enums";
import { ApiResponse, User } from "@/interfaces";
import { signIn } from "@/hooks/useGoogleOAuth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Colors } from "@/constants/common";
import { loginWithOAuth } from "@/api/api.service";
import { Toast } from "@/components/animation-toast/components";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID!, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const SignIn = () => {
  const { refetch, loading, isLoggedIn, displayToast } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  if (!loading && isLoggedIn) return <Redirect href="/(root)/(tabs)" />;

  const handleLogin = async (provider: LoginProvider) => {
    switch (provider) {
      case LoginProvider.GOOGLE:
        onHandleLoginWithGoogle();
        break;
      case LoginProvider.APPLE:
        break;
      case LoginProvider.MAIL:
        router.navigate("/mail-auth");
        break;
      default:
        return displayToast({
          type: ToastType.ERROR,
          description: `Invalid login provider`,
        });
    }
  };

  async function onHandleLoginWithGoogle() {
    setIsLoading(true);
    signIn((error: any, userInfo: any) => {
      if (error) {
        displayToast({
          type: ToastType.ERROR,
          description: error,
        });
        setIsLoading(false);
      } else if (userInfo) {
        handleToken(LoginProvider.GOOGLE, userInfo.user);
      } else {
        setIsLoading(false);
        console.log("Sign-in was canceled or no user info available");
      }
    });
  }

  // handle oauth token
  const handleToken = async (provider: LoginProvider, userInfo: any) => {
    try {
      if (userInfo) {
        await loginWithOAuth({
          provider,
          name: userInfo.name!,
          email: userInfo.email!,
        });
        refetch();
      } else {
        return displayToast({
          type: ToastType.ERROR,
          description: `User with email does not exist`,
        });
      }
    } catch (error: any) {
      return displayToast({
        type: ToastType.ERROR,
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          style={styles.onboardImg}
          contentFit="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-plus-jakarta-regular text-black-200">
            Welcome to Percher
          </Text>
          <Text className="text-3xl font-plus-jakarta-bold text-black-300 text-center mt-2">
            Let's Find You A Place {"\n"}
            <Text className="text-primary-300">To Feel At Home</Text>
          </Text>

          <TouchableOpacity
            onPress={() => handleLogin(LoginProvider.GOOGLE)}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 items-center"
          >
            <View className="flex flex-row items-center gap-2 w-8/12">
              <Image
                source={icons.google}
                style={styles.googleImg}
                contentFit="contain"
              />
              <Text className="text-lg font-plus-jakarta-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={() => handleLogin(LoginProvider.APPLE)}
              className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 items-center"
            >
              <View className="flex flex-row items-center gap-2 w-8/12">
                <AntDesign name="apple1" size={22} />
                <Text className="text-lg font-plus-jakarta-medium text-black-300 ml-2">
                  Continue with Apple
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => handleLogin(LoginProvider.MAIL)}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 items-center"
          >
            <View className="flex flex-row items-center gap-2  w-8/12">
              <Ionicons name="mail" size={22} />
              <Text className="text-lg font-plus-jakarta-medium text-black-300 ml-2">
                Continue with Mail
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLoading && (
        <View className="absolute w-full h-full items-center justify-center z-50">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  onboardImg: {
    width: "100%",
    height: "55%",
  },
  googleImg: {
    width: 20,
    height: 20,
  },
});

export default SignIn;
