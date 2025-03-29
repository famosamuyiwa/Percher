import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/common";
import { Commafy, formatCurrency, generateUniqueId } from "@/utils/common";
import SettingsHeader from "@/components/SettingsHeader";
import PaystackCheckout from "@/hooks/usePaystack";
import { TextWithIcon } from "@/components/text-with-icon";
import { TransactionCard } from "@/components/Cards";
import { TransactionType } from "@/constants/enums";
import { router } from "expo-router";
import { TextField } from "@/components/Textfield";
import { Image } from "expo-image";
import images from "@/constants/images";
import CustomButton from "@/components/Button";

export default function Payments() {
  const [isClicked, setIsClicked] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const handleOnWithdraw = () => {};

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "#F5F5F5" }}>
      <View style={styles.container} className="flex-1">
        <SettingsHeader title="Payments" />
        <View className="px-5 py-10" style={styles.container}>
          <View style={styles.container}>
            <View
              style={styles.walletContainer}
              className="shadow-lg shadow-black-100/70 "
            >
              <View style={styles.row1}>
                <Text className="text-white font-plus-jakarta-regular text-sm">
                  Wallet Balance
                </Text>
                <AntDesign
                  size={20}
                  style={{ color: "white" }}
                  name="arrowright"
                />
              </View>
              <View>
                <Text
                  style={{ color: "white", fontSize: 25, marginVertical: 5 }}
                  className="font-plus-jakarta-regular"
                >
                  ₦{Commafy(500000)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <FontAwesome name="warning" color={"white"} />
                <Text className="text-xs font-plus-jakarta-regular text-white">
                  5% withdrawal fee
                </Text>
              </View>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  style={styles.row2}
                  onPress={() => setIsClicked(true)}
                >
                  <MaterialCommunityIcons name="bank-transfer-in" size={25} />
                  <Text
                    style={{ marginLeft: 5 }}
                    className="font-plus-jakarta-regular"
                  >
                    Deposit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.row2}
                  onPress={() => setWithdrawModalVisible(true)}
                >
                  <MaterialCommunityIcons name="bank-transfer-out" size={25} />
                  <Text
                    style={{ marginLeft: 5 }}
                    className="font-plus-jakarta-regular"
                  >
                    Withdraw
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={[styles.cardWrapper, { marginTop: 40 }]}
                onPress={() => router.push("/(root)/(settings)/payments/banks")}
              >
                <TextWithIcon
                  text="Add withdrawal bank"
                  icon={
                    <MaterialCommunityIcons
                      name="bank-transfer"
                      size={25}
                      color={"darkgrey"}
                    />
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardWrapper} onPress={() => {}}>
                <TextWithIcon
                  text="Add credit card"
                  icon={
                    <MaterialCommunityIcons
                      name="credit-card"
                      size={23}
                      color={"darkgrey"}
                    />
                  }
                />
              </TouchableOpacity>
            </View>

            <View
              style={{ marginTop: 40 }}
              className="flex-row justify-between items-center"
            >
              <Text className="font-plus-jakarta-bold">
                Recent Transactions
              </Text>
              <TouchableOpacity>
                <Text className="text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>

            <TransactionCard item={{ type: TransactionType.CREDIT }} />
            <TransactionCard item={{ type: TransactionType.DEBIT }} />

            <View>
              <PaystackCheckout
                billingDetail={{
                  amount: 50000,
                  billingEmail: "nenling19@gmail.com",
                  billingName: "Nen Ling",
                  billingMobile: "08033044770",
                  refNumber: generateUniqueId(),
                }}
                clicked={isClicked}
                onEnd={() => {
                  setIsClicked(false);
                }}
                onSuccess={() => {}}
              />
            </View>

            <Modal
              visible={withdrawModalVisible}
              transparent
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View className="px-5 bg-white rounded-t-3xl">
                  <View
                    style={{ backgroundColor: "lightgrey" }}
                    className="h-1 rounded-full mt-2 w-10 self-center"
                  />
                  <Pressable
                    onPress={() => setWithdrawModalVisible(false)}
                    className="self-end pt-2"
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(120, 120, 128, 0.12)",
                        borderRadius: 15,
                        padding: 5,
                      }}
                    >
                      <AntDesign name="close" size={16} color="grey" />
                    </View>
                  </Pressable>
                  <View className="pb-5">
                    <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-20 my-2">
                      <MaterialCommunityIcons
                        name="bank-transfer-out"
                        size={40}
                        color={Colors.accent}
                      />
                    </View>

                    <Text className="font-plus-jakarta-bold text-lg pb-10">
                      Withdraw To Bank 💰
                    </Text>
                    <View>
                      <TextField
                        isSmallLabelVisible={true}
                        label="Withdrawal amount ( ₦5000 min. )"
                        placeholder="5,000.00"
                        value={Commafy(withdrawalAmount)}
                        style={styles.input}
                        onValueChange={(newValue: string) =>
                          setWithdrawalAmount(Number(formatCurrency(newValue)))
                        }
                        isCurrency={true}
                        keyboardType="numeric"
                        placeholderColor={"darkgrey"}
                      />
                    </View>

                    <View className="flex-row items-center gap-2 justify-end">
                      <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 my-2">
                        <Image
                          source={images.zenithLogo}
                          style={{ width: 20, height: 20 }}
                        />
                      </View>
                      <Text className="text-xs font-plus-jakarta-semibold text-gray-500">
                        2209315462
                      </Text>
                    </View>

                    <View className="justify-end py-10 px-5">
                      <CustomButton
                        label="Withdraw"
                        onPress={handleOnWithdraw}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#F5F5F5",
    padding: 5,
    borderRadius: 50,
    position: "absolute",
    left: 0,
    marginLeft: 20,
  },
  walletContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 20,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row2: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  cardWrapper: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 0.2,
    borderColor: "darkgrey",
    borderRadius: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "black",
  },
  input: {
    height: 40,
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: 14,
    color: "darkgrey",
    backgroundColor: "lightgrey",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
});
