import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/common";
import { Commafy, generateUniqueId } from "@/utils/common";
import SettingsHeader from "@/components/SettingsHeader";
import PaystackCheckout from "@/hooks/usePaystack";
import { TextWithIcon } from "@/components/text-with-icon";
import { TransactionCard } from "@/components/Cards";
import { router } from "expo-router";
import { TextField } from "@/components/Textfield";
import { Image } from "expo-image";
import CustomButton from "@/components/Button";
import { useWalletQuery } from "@/hooks/query/useWalletQuery";
import { WITHDRAWAL_FEE_PERCENTAGE } from "@/environment";
import EmptyTransactions from "@/components/empty-screens/transactions";
import { useGlobalContext } from "@/lib/global-provider";
import { useGlobalStore } from "@/store/store";
import { Payment } from "@/interfaces";
import { ToastType, TransactionType } from "@/constants/enums";
import { useUpdateWalletMutation } from "@/hooks/mutation/useWalletMutation";
import {
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useVerifyPaymentMutation,
} from "@/hooks/mutation/usePaymentMutation";

export default function Payments() {
  const walletQuery = useWalletQuery();
  const verifyPaymentMutation = useVerifyPaymentMutation();
  const createPaymentMutation = useCreatePaymentMutation();
  const [isClicked, setIsClicked] = useState(false);
  const [modalInput, setModalInput] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<TransactionType | null>(
    null
  );
  const { saveWalletState } = useGlobalStore();
  const [transactionRef, setTransactionRef] = useState(generateUniqueId());
  const { user, alertComingSoon, showLoader, hideLoader, displayToast } =
    useGlobalContext();

  const handleOnModalButtonPress = () => {
    if (modalContent === TransactionType.WITHDRAWAL) {
      withdraw();
    } else {
      deposit();
    }
  };

  const withdraw = () => {
    setModalVisible(false);
    showLoader();
    setTimeout(() => {
      hideLoader();
    }, 3000);
  };

  const deposit = () => {
    setModalVisible(false);
    showLoader();
    const newTransactionRef = generateUniqueId();
    setTransactionRef(newTransactionRef);
    createPaymentMutation.mutate(
      {
        amount: modalInput,
        reference: newTransactionRef,
        transactionType: TransactionType.DEPOSIT,
      },
      {
        onSuccess: onCreatePaymentSuccess,
      }
    );
  };

  const onCreatePaymentSuccess = () => {
    hideLoader();
    setIsClicked(true);
  };

  const handleOnPaymentCanceled = () => {
    setIsClicked(false);
    resetModal();
  };

  const handleOnPaymentSuccess = () => {
    setIsClicked(false);
    showLoader();
    verifyPaymentMutation.mutate(transactionRef, {
      onSettled: onPaymentSettled,
    });
  };

  const onPaymentSettled = () => {
    resetModal();
    // simulate delay to prevent glitches
    setTimeout(() => {
      hideLoader();
    }, 1000);
  };

  const openModal = (type: TransactionType) => {
    setModalContent(type);
    setModalVisible(true);
  };

  const handleAddWithdrawalBank = () => {
    router.push({
      pathname: "/(root)/(settings)/payments/banks",
      params: { id: walletQuery.data?.data.id },
    });
  };

  useEffect(() => {
    if (walletQuery.data?.data) {
      saveWalletState(walletQuery.data?.data);
    }
  }, [walletQuery.data?.data]);

  const resetModal = () => {
    setModalInput(0);
    setModalVisible(false);
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "#F5F5F5" }}>
      <SettingsHeader title="Payments" />
      <View className="px-5 py-10">
        <View>
          <View className="shadow-lg shadow-black-100/70 rounded-2xl p-5 bg-secondary-300">
            <View className="flex-row justify-between items-center">
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
                ₦{Commafy(walletQuery.data?.data.balance)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <FontAwesome name="warning" color={"white"} />
              <Text className="text-xs font-plus-jakarta-regular text-white">
                {WITHDRAWAL_FEE_PERCENTAGE}% withdrawal fee
              </Text>
            </View>
            <View className="flex-row justify-between">
              <TouchableOpacity
                style={styles.row2}
                onPress={() => openModal(TransactionType.DEPOSIT)}
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
                onPress={() => openModal(TransactionType.WITHDRAWAL)}
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
              onPress={handleAddWithdrawalBank}
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
            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={alertComingSoon}
            >
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
            <Text className="font-plus-jakarta-bold">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-primary-300">See All</Text>
            </TouchableOpacity>
          </View>
          {walletQuery.data?.data.transactions?.length ? (
            walletQuery.data.data.transactions.map((item) => (
              <View key={item.id}>
                <TransactionCard item={item} />
              </View>
            ))
          ) : (
            <View className="w-full p-5">
              <EmptyTransactions />
            </View>
          )}
          <PaystackCheckout
            billingDetail={{
              amount: modalInput,
              billingEmail: user?.email!,
              billingName: user?.name!,
              billingMobile: user?.phone!,
              refNumber: transactionRef,
            }}
            clicked={isClicked}
            onEnd={handleOnPaymentCanceled}
            onSuccess={handleOnPaymentSuccess}
          />
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View className="px-5 bg-white rounded-t-3xl">
                <View
                  style={{ backgroundColor: "lightgrey" }}
                  className="h-1 rounded-full mt-2 w-10 self-center"
                />
                <Pressable onPress={resetModal} className="self-end pt-2">
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
                      name={
                        modalContent === TransactionType.WITHDRAWAL
                          ? "bank-transfer-out"
                          : "bank-transfer-in"
                      }
                      size={40}
                      color={Colors.accent}
                    />
                  </View>

                  <Text className="font-plus-jakarta-bold text-lg pb-10">
                    {modalContent === TransactionType.WITHDRAWAL
                      ? "Withdraw To Bank   💰"
                      : "Deposit To Wallet   🤑"}
                  </Text>
                  <View>
                    <TextField
                      isSmallLabelVisible={true}
                      label={`${modalContent} amount ( ₦5,000 min. )`}
                      placeholder="5,000.00"
                      value={
                        modalInput
                          ? Number(modalInput).toLocaleString() // Adds commas dynamically
                          : ""
                      }
                      style={styles.input}
                      onValueChange={(text: string) => {
                        // Remove non-numeric characters except for numbers
                        const rawValue = text.replace(/,/g, ""); // Remove commas before storing

                        // Ensure it's a valid number before updating the state
                        if (!isNaN(Number(rawValue))) {
                          setModalInput(Number(rawValue)); // Store raw number (without commas)
                        }
                      }}
                      isCurrency={true}
                      keyboardType="numeric"
                      placeholderColor={"darkgrey"}
                    />
                  </View>

                  <View className="flex-row items-center gap-2 justify-end">
                    {modalContent === TransactionType.WITHDRAWAL && (
                      <>
                        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 my-2">
                          <Image
                            source={{
                              uri: walletQuery.data?.data.bankLogo,
                            }}
                            style={{ width: 20, height: 20 }}
                          />
                        </View>
                        <Text className="text-xs font-plus-jakarta-semibold text-gray-500">
                          {walletQuery.data?.data.accountNumber}
                        </Text>
                      </>
                    )}
                    {modalContent === TransactionType.DEPOSIT && (
                      <View style={{ height: 40 }} />
                    )}
                  </View>

                  <View className="justify-end py-10 px-5">
                    <CustomButton
                      label={
                        modalContent === TransactionType.WITHDRAWAL
                          ? "Withdraw"
                          : "Deposit"
                      }
                      onPress={handleOnModalButtonPress}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
