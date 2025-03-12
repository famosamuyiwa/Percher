import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { login } from "../lib/appwrite";
import { useGlobalContext } from "../lib/global-provider";
import { Redirect, router } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LoginProvider } from "@/constants/enums";

const SignIn = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/(root)/(tabs)" />;

  const handleLogin = async (provider: LoginProvider) => {
    let result = undefined;
    switch (provider) {
      case LoginProvider.GOOGLE:
        result = await login();
        break;
      case LoginProvider.APPLE:
        break;
      case LoginProvider.MAIL:
        router.navigate("/mail-auth");
        break;
      default:
        Alert.alert("Error", "Invalid login provider");
    }
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
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
