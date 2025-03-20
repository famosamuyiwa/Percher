import React from "react";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

const HomeSkeleton = ({ ...props }) => {
  return (
    <>
      <View className="p-5">
        <View>
          <Skeleton width={60} height={60} colorMode="light" radius={"round"} />
        </View>
        <View className="py-12">
          <Skeleton width="100%" height={30} colorMode="light" />
        </View>
        <Skeleton width="100%" height={320} colorMode="light" />
        <View className="py-12">
          <Skeleton width="100%" height={30} colorMode="light" />
        </View>
        <View className="flex-row justify-between w-full">
          <Skeleton width={160} height={200} colorMode="light" />
          <Skeleton width={160} height={200} colorMode="light" />
        </View>
      </View>
    </>
  );
};

export { HomeSkeleton };
