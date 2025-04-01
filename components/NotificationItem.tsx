import { View, Text } from "react-native";
import React from "react";
import { INotification } from "@/interfaces";
import { formatDate, formatTime } from "@/utils/common";
import { NotificationStatus } from "@/constants/enums";

const NotificationItem = ({ data }: { data: INotification<any> }) => {
  return (
    <View className="flex-row justify-between items-center">
      {data.type && (
        <View className="flex-row items-center">
          {/* <CategoryIcon categoryEnum={data.category as CategoryIcons} /> */}
          <View className="justify-between px-4 w-full">
            <Text
              className={` ${
                data.status === NotificationStatus.READ
                  ? "text-gray-500 font-plus-jakarta-light"
                  : "text-black font-plus-jakarta-medium"
              }`}
            >
              {data.type}
            </Text>
            <Text
              className={`font-plus-jakarta-light text-sm ${
                data.status === NotificationStatus.READ
                  ? "text-gray-500"
                  : "text-black"
              }`}
            >
              {data.message}
            </Text>
            <Text
              style={{ color: "grey" }}
              className="text-xs pt-1 font-plus-jakarta-regular"
            >
              {formatDate(data.createdAt)}. {formatTime(data.createdAt)}
            </Text>
          </View>
        </View>
      )}
      {/* {data.avatar && <View></View>} */}
      {/* {data.type !== null && (
        <View className="py-1 px-2 rounded-md bg-accent-100">
          <Text className="text-sm font-plus-jakarta-medium text-accent-300">
            {data.type}
          </Text>
        </View>
      )} */}
    </View>
  );
};

export default NotificationItem;
