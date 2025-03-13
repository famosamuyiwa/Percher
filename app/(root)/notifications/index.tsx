import EmptyNotifications from "@/components/empty-screens/notifications";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const handleOnBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="px-5 flex-1 py-5" edges={["top"]}>
      <View className="mb-8 items-center justify-center">
        <TouchableOpacity onPress={handleOnBack} className="absolute -left-2">
          <Ionicons name="arrow-back-circle-sharp" size={40} />
        </TouchableOpacity>
        <Text className="font-plus-jakarta-bold text-lg">Notifications</Text>
        <View />
      </View>
      <View className="flex-1 px-10 items-center">
        <View className="pt-[60%]">
          <EmptyNotifications />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Notifications;
