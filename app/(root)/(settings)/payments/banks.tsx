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

const Banks = () => {
  const params = useLocalSearchParams<{ query?: string }>();

  const [banks, setBanks] = useState<any>([]);
  const [selectedBank, setSelectedBank] = useState<any>();
  const [selectedBankName, setSelectedBankName] = useState();
  const [selectedBankLogo, setSelectedBankLogo] = useState();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState<any>();
  const [filteredBanks, setFilteredBanks] = useState<any>([]);
  const [banksModalVisible, setBanksModalVisible] = useState(false);

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
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    const getBanks = async () => {
      const data = await fetchBankFromNigerianBanksApi();
      setBanks(data);
    };

    getBanks();
  }, []);

  useEffect(() => {
    if (banks) {
      filterBanks();
    }
  }, [params.query]);

  const openBanksModal = () => {
    if (!selectedBank && banks.length > 0) {
      setSelectedBank(banks[0].code); // Set the first bank as default
      setSelectedBankName(banks[0].name);
      setSelectedBankLogo(banks[0].logo);
    }
    setBanksModalVisible(true);
  };

  const handleSetWithdrawalBank = () => {};

  return (
    <ScrollView style={styles.container} className="flex-1">
      <SettingsHeader title="Withdrawal Bank" />
      <View className="px-5 py-5" style={styles.container}>
        <Text className="font-plus-jakarta-regular text-gray-500 text-lg">
          The bank you link here is where your Percher funds will be withdrawn
          into after you initiate a withdrawal. Funds are sent instantly ⚡️
        </Text>

        <View className="mt-10">
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
                            console.log("itemValue: ", itemValue);
                            console.log("selected: ", selected);
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
                        <Button
                          title="Done"
                          onPress={() => {
                            setBanksModalVisible(false);
                          }}
                        />
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
            <View className="items-center justify-center self-end bg-accent-100 rounded-full size-10 my-2">
              <Image
                source={{ uri: selectedBankLogo }}
                style={{ width: 20, height: 20 }}
              />
            </View>
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
              />
              {accountDetails && (
                <Text className="text-xs font-plus-jakarta-semibold text-gray-500 self-end py-2">
                  {accountDetails.account_name}
                </Text>
              )}
            </View>
          )}

          {accountDetails && (
            <CustomButton
              label="Set withdrawal bank"
              onPress={handleSetWithdrawalBank}
            />
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
