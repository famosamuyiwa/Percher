import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";

import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById } from "@/lib/appwrite";
import React, { useState } from "react";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import { Commafy } from "@/utils/common";
import { Modal } from "@/constants/enums";
import Button from "@/components/Button";
import CustomButton from "@/components/Button";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: id!,
    },
  });

  const handleOnPerchClick = () => {
    router.push(`/booking/${id}`);
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: property?.image }}
            style={styles.propertyImg}
            contentFit="cover"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row rounded-full size-11 items-center justify-center bg-white"
              >
                <Ionicons name="arrow-back" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {}}
                className="flex flex-row rounded-full size-11 items-center justify-center bg-white"
              >
                <FontAwesome name="share-alt" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-plus-jakarta-extrabold">
            {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-plus-jakarta-bold text-primary-300">
                {property?.type}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <AntDesign name="star" size={18} color="gold" />
              <Text className="text-black-200 text-sm mt-1 font-plus-jakarta-medium">
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10">
              <FontAwesome5 name="bed" size={16} color={Colors.accent} />
            </View>
            <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
              {property?.bedrooms} Bed(s)
            </Text>
            <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 ml-7">
              <FontAwesome name="bath" size={16} color={Colors.accent} />
            </View>
            <Text className="text-black-300 text-sm font-plus-jakarta-medium ml-2">
              {property?.bathrooms} Bathroom(s)
            </Text>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-plus-jakarta-bold">
              Agent
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={{
                    uri: property?.agent.avatar,
                  }}
                  style={styles.agentAvatar}
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-plus-jakarta-bold">
                    {property?.agent.name}
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-plus-jakarta-medium">
                    {property?.agent.email}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-5">
                <Ionicons
                  name="chatbox-ellipses"
                  size={28}
                  color={Colors.primary}
                />
                <FontAwesome5 name="phone" size={25} color={Colors.primary} />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-plus-jakarta-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-plus-jakarta mt-2">
              {property?.description}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-plus-jakarta-bold">
              Facilities
            </Text>

            {property?.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property?.facilities.map((item: string, index: number) => {
                  const facility = facilities.find(
                    (facility) => facility.title === item
                  );
                  return (
                    <View
                      key={index}
                      className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                    >
                      <View className="size-14 bg-accent-100 rounded-full flex items-center justify-center">
                        <Ionicons
                          name={facility ? facility.icon : icons.info}
                          size={24}
                          color={Colors.accent}
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-black-300 text-sm text-center font-plus-jakarta mt-1.5"
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {property?.gallery.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-plus-jakarta-bold">
                Gallery
              </Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={property?.gallery}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.galleryImg}
                  />
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-plus-jakarta-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 gap-2">
              <Entypo name="location" size={28} color={Colors.accent} />
              <Text className="text-black-200 text-sm font-plus-jakarta-medium">
                {property?.address}
              </Text>
            </View>

            <Image source={images.map} style={styles.locationImg} />
          </View>

          {property?.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <AntDesign name="star" size={20} color="gold" />
                  <Text className="text-black-300 text-xl font-plus-jakarta-bold ml-2">
                    {property?.rating} ({property?.reviews.length} reviews)
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text className="text-primary-300 text-base font-plus-jakarta-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-5">
                <Comment item={property?.reviews[0]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-plus-jakarta-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-plus-jakarta-bold"
            >
              ₦{Commafy(property?.price)}
            </Text>
          </View>
          <View className="flex-1">
            <CustomButton label="Perch Now" onPress={handleOnPerchClick} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  propertyImg: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  whiteGradient: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    zIndex: 40,
  },
  agentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 9999,
  },
  galleryImg: {
    height: 160,
    width: 160,
    borderRadius: 12,
  },
  locationImg: {
    height: 208,
    width: "100%",
    marginTop: 20,
    borderRadius: 12,
  },
});

export default Property;
