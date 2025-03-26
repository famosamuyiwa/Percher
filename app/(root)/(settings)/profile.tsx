import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { TextField } from "@/components/Textfield";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import SettingsHeader from "@/components/SettingsHeader";
import useImagePicker from "@/hooks/useImagePicker";
import useStorageBucket from "@/hooks/useBackblazeStorageBucket";
import { useUpdateUserMutation } from "@/hooks/mutation/useUserMutation";
import { useGlobalContext } from "@/lib/global-provider";
import { ToastType } from "@/constants/enums";

const ProfileScreen = () => {
  const { user, refetch, displayToast } = useGlobalContext();

  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone);
  const updateUserMutation = useUpdateUserMutation();

  const [isSaving, setIsSaving] = useState(false);

  const tintColor = Colors.primary;
  const { pickMultimedia } = useImagePicker();
  const { uploadMultimedia } = useStorageBucket();

  const handleSave = () => {
    setIsSaving(true);
    if (user?.avatar !== avatar) {
      uploadAndMutate();
    } else {
      mutate();
    }
  };

  const handleCancel = () => {
    // setAvatar(authQuery.data?.data?.avatar);
    // setName(authQuery.data?.data?.name);
    // setUserName(authQuery.data?.data?.username);
    // setEmail(authQuery.data?.data?.email);
    // setPhoneNumber(authQuery.data?.data?.phoneNumber);
    setIsEditing(false);
  };

  const handleImagePress = async () => {
    if (!isEditing) return;
    try {
      const image: any = await pickMultimedia(false, true);
      setAvatar(image.uri[0]);
    } catch {}
  };

  const uploadAndMutate = async () => {
    try {
      await uploadMultimedia(
        [
          {
            uri: avatar,
          },
        ],
        (downloadUrls: string[]) => {
          console.log("dowloadUrls: ", downloadUrls);
          updateUserMutation.mutate(
            {
              id: user?.id,
              name,
              avatar: downloadUrls[0] || avatar,
              phone: phoneNumber,
            },
            { onSettled, onSuccess }
          );
        }
      );
    } catch (err: any) {
      displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
      setIsSaving(false);
    }
  };

  const mutate = () => {
    updateUserMutation.mutate(
      {
        id: user?.id,
        name,
        phone: phoneNumber,
      },
      { onSettled, onSuccess }
    );
  };

  const onSettled = () => {
    setIsSaving(false);
  };

  const onSuccess = () => {
    refetch();
    setIsEditing(false);
  };

  return (
    <View style={styles.container} className="flex-1">
      <SettingsHeader title="Profile" />
      <View className="px-5 py-5" style={styles.container}>
        <View className="items-center justify-center">
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              style={styles.avatar}
              source={avatar}
              contentFit="cover"
              transition={300}
            />
            {isEditing && (
              <View
                className="absolute bottom-0 right-0 p-1 rounded-full"
                style={styles.camIcon}
              >
                <MaterialIcons name="camera-enhance" size={24} />
              </View>
            )}
          </TouchableOpacity>
          {!isEditing && (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="flex-row py-1 px-4 my-4 bg-white items-center"
            >
              <Feather name="edit" size={14} />
              <Text className="pl-2 font-plus-jakarta-regular">Edit</Text>
            </TouchableOpacity>
          )}
          {isEditing && !isSaving && (
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-row items-center"
              >
                <MaterialIcons
                  className="pr-1"
                  name="edit-off"
                  size={14}
                  color="red"
                />
                <Text className="text-red-500 font-plus-jakarta-regular">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-row py-1 my-4 items-center"
              >
                <MaterialCommunityIcons
                  name="circle-edit-outline"
                  size={14}
                  color={tintColor}
                />
                <Text className="px-2 text-primary-300 font-plus-jakarta-regular">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isEditing && isSaving && (
            <View className="flex-row items-center my-4 ">
              <ActivityIndicator color={tintColor} size="small" />
            </View>
          )}
        </View>
        <View className="my-2">
          <Text className="font-plus-jakarta-medium">Name</Text>
          <View style={styles.itemsContainer} className="my-4">
            <TextField
              isSmallLabelVisible={name}
              label="Display name"
              placeholder="Display name"
              value={name}
              onValueChange={setName}
              isEditable={isEditing}
              style={isEditing ? styles.inputEditing : styles.input}
              textColor={isEditing ? "black" : "darkgrey"}
            />
          </View>
        </View>
        <View className="my-2">
          <Text className="font-plus-jakarta-medium">Personal Information</Text>
          <View style={styles.itemsContainer} className="my-4">
            <TextField
              isSmallLabelVisible={email}
              label="Email"
              placeholder="Email"
              value={email}
              onValueChange={setEmail}
              isEditable={false}
              style={styles.input}
              textColor={"darkgrey"}
            />
            <TextField
              isSmallLabelVisible={phoneNumber}
              label="Phone Number"
              placeholder="Phone Number"
              value={phoneNumber}
              onValueChange={setPhoneNumber}
              isEditable={isEditing}
              style={isEditing ? styles.inputEditing : styles.input}
              textColor={isEditing ? "black" : "darkgrey"}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  itemsContainer: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  borderedItem: {
    borderBottomWidth: 1,
    borderColor: "#F4F4F4",
    paddingBottom: 5,
  },
  input: {
    height: 30,
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: 14,
    color: "darkgrey",
  },
  inputEditing: {
    height: 30,
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: 14,
    color: "black",
  },
  camIcon: {
    backgroundColor: "#F5F5F5",
  },
});

export default React.memo(ProfileScreen);
