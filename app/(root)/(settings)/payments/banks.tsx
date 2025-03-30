import {
  fetchBankFromNigerianBanksApi,
  fetchBanksFromPaystack,
  verifyAccountNumberFromPaystack,
} from "@/api/api.service";
import CustomButton from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import SettingsHeader from "@/components/SettingsHeader";
import { TextField } from "@/components/Textfield";
import { Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useGlobalContext } from "@/lib/global-provider";
import { useUpdateWalletMutation } from "@/hooks/mutation/useWalletMutation";
import { useGlobalStore } from "@/store/store";
import { ToastType } from "@/constants/enums";

const Banks = () => {
  const params = useLocalSearchParams<{ id: string; query?: string }>();
  const { wallet } = useGlobalStore();
  const [banks, setBanks] = useState<any>([]);
  const [selectedBank, setSelectedBank] = useState<any>();
  const [selectedBankName, setSelectedBankName] = useState<any>();
  const [selectedBankLogo, setSelectedBankLogo] = useState<any>();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState<any>();
  const [filteredBanks, setFilteredBanks] = useState<any>([]);
  const [banksModalVisible, setBanksModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { showLoader, hideLoader, displayToast } = useGlobalContext();
  const updateWalletMutation = useUpdateWalletMutation();

  const filterBanks = () => {
    const filterBanks: any = banks.filter((b: any) =>
      b.name.toLowerCase().includes(params.query?.toLowerCase())
    );
    setFilteredBanks(filterBanks);
    if (filterBanks.length > 0) {
      setSelectedBank(filterBanks[0].code); // Set the first bank as default
      setSelectedBankName(filterBanks[0].name);
      setSelectedBankLogo(filterBanks[0].logo);
    }
  };

  const handleAccountNumberField = (text: string) => {
    setAccountNumber(text);
    if (text.length !== 10 || !selectedBank) {
      setAccountDetails(undefined);
      return;
    }
    verifyAccountNumber(text, selectedBank.code);
  };

  const verifyAccountNumber = async (accountNumber: string, code: number) => {
    try {
      const data = await verifyAccountNumberFromPaystack(
        Number(accountNumber),
        code
      );
      if (data.status) setAccountDetails(data.data);
    } catch (error: any) {
      displayToast({
        description: error.message,
        type: ToastType.ERROR,
      });
    }
  };

  useEffect(() => {
    const getBanks = async () => {
      const data = await fetchBankFromNigerianBanksApi();
      setBanks(data);
    };
    if (wallet?.accountNumber) {
      setSelectedBank(wallet.bankCode);
      setSelectedBankName(wallet.bankName);
      setSelectedBankLogo(wallet.bankLogo);
      setAccountNumber(wallet.accountNumber);
      setAccountDetails({
        account_name: wallet.accountName,
        account_number: wallet.accountNumber,
      });
    } else {
      resetDetails();
      setIsEditing(true);
    }

    getBanks();
  }, []);

  useEffect(() => {
    if (banks) {
      filterBanks();
    }
  }, [params.query]);

  const openBanksModal = () => {
    if (!isEditing) return;
    if (!selectedBank && banks.length > 0) {
      setSelectedBank(banks[0].code); // Set the first bank as default
      setSelectedBankName(banks[0].name);
      setSelectedBankLogo(banks[0].logo);
    }
    setBanksModalVisible(true);
  };

  const handleSetWithdrawalBank = () => {
    if (!selectedBank || !accountDetails) return;
    showLoader();
    const payload = {
      id: Number(params.id),
      bankName: selectedBank.name,
      bankCode: selectedBank.code,
      accountNumber: accountDetails.account_number,
      accountName: accountDetails.account_name,
      bankLogo: selectedBank.logo,
    };
    updateWalletMutation.mutate(payload, { onSuccess, onSettled });
  };

  const onSuccess = () => {
    setIsEditing(false);
  };

  const onSettled = () => {
    hideLoader();
  };

  const handleModalDoneClick = () => {
    if (!selectedBank) {
      const bank = params.query ? filteredBanks : banks;
      setSelectedBank(bank[0]);
      setSelectedBankName(bank[0].name);
      setSelectedBankLogo(bank[0].logo);
    }
    setBanksModalVisible(false);
  };

  const handleChangeBank = () => {
    resetDetails();
    setIsEditing(true);
  };

  const resetDetails = () => {
    setSelectedBank(undefined);
    setSelectedBankName(undefined);
    setSelectedBankLogo("");
    setAccountNumber("");
    setAccountDetails(undefined);
  };

  return (
    <ScrollView style={styles.container} className="flex-1">
      <SettingsHeader title="Withdrawal Bank" />
      <View className="px-5 py-5" style={styles.container}>
        <Text className="font-plus-jakarta-regular text-gray-500 text-lg">
          The bank you link here is where your Percher funds will be withdrawn
          into after you initiate a withdrawal. Funds are sent instantly ⚡️
        </Text>

        <View className="mt-10">
          {!isEditing && (
            <TouchableOpacity className="items-end" onPress={handleChangeBank}>
              <Text className=" font-plus-jakarta-regular pb-3 underline text-primary-300">
                Change
              </Text>
            </TouchableOpacity>
          )}
          <View>
            <Text className="text-xs font-plus-jakarta-regular pb-3">Bank</Text>
            <TouchableOpacity
              onPress={openBanksModal}
              style={{
                backgroundColor: "lightgrey",
                borderRadius: 10,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              {banks?.length > 0 && (
                <Modal
                  visible={banksModalVisible}
                  transparent
                  animationType="slide"
                >
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.pickerContainer}>
                        <View className="px-5">
                          <SearchBar />
                        </View>

                        <Picker
                          selectedValue={selectedBank?.code}
                          onValueChange={(itemValue) => {
                            const selected: any = banks.find(
                              (bank: any) => bank.code === itemValue
                            );
                            if (selected) {
                              setSelectedBank(selected);
                              setSelectedBankName(selected.name);
                              setSelectedBankLogo(selected.logo);
                            }
                          }}
                          itemStyle={{
                            color: "black",
                            fontSize: 18,
                          }}
                        >
                          {(params.query ? filteredBanks : banks).map(
                            (bank: any) => (
                              <Picker.Item
                                key={bank.code}
                                label={bank.name}
                                value={bank.code}
                              />
                            )
                          )}
                        </Picker>
                        <Button title="Done" onPress={handleModalDoneClick} />
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
              )}
              <Text className="font-plus-jakarta-regular">
                {selectedBankName || "-- Select a bank --"}
              </Text>
              <Entypo
                name="chevron-down"
                size={16}
                color={"darkgrey"}
                className="absolute right-0 px-5"
              />
            </TouchableOpacity>
            {selectedBank && (
              <View className="items-center justify-center self-end bg-accent-100 rounded-full size-10 my-2">
                <Image
                  source={{ uri: selectedBankLogo }}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            )}
          </View>
          {selectedBank && (
            <View className="pb-10">
              <TextField
                isSmallLabelVisible={true}
                label="Account number"
                placeholder="e.g 2209315462"
                value={accountNumber}
                onValueChange={(text: string) => handleAccountNumberField(text)}
                style={styles.input}
                keyboardType="numeric"
                placeholderColor="darkgrey"
                onBlur={() =>
                  verifyAccountNumber(accountNumber, selectedBank.code)
                }
                isEditable={isEditing}
              />
              {accountDetails && (
                <Text className="text-xs font-plus-jakarta-semibold text-gray-500 self-end py-2">
                  {accountDetails.account_name}
                </Text>
              )}
            </View>
          )}

          {isEditing && (
            <View className="mt-10">
              <CustomButton
                label="Set withdrawal bank"
                onPress={handleSetWithdrawalBank}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "black",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
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
  },
});

export default Banks;
