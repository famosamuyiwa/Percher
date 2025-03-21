import SettingsHeader from "@/components/SettingsHeader";

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PerchRegistrationForm from "@/components/Forms";
import { PerchRegistrationFormData } from "@/interfaces";
import useStorageBucket from "@/hooks/useBackblazeStorageBucket";
import { useState } from "react";
import { ToastType } from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";

const Form = () => {
  const { uploadMultimedia, progress } = useStorageBucket();
  const [isLoading, setIsLoading] = useState(false);
  const { displayToast } = useGlobalContext();

  const handleRegisterClick = async (formData: PerchRegistrationFormData) => {
    try {
      const gallery = await uploadAndUpdateFormMediaURLs(formData.gallery);
      const proofOfIdentity = await uploadAndUpdateFormMediaURLs(
        formData.proofOfIdentity
      );
      const proofOfOwnership = await uploadAndUpdateFormMediaURLs(
        formData.proofOfOwnership
      );
      const dataAfterMediaUpload = {
        ...formData,
        gallery: gallery ?? [],
        proofOfIdentity: proofOfIdentity ?? [],
        proofOfOwnership: proofOfOwnership ?? [],
      };

      console.log("data: ", dataAfterMediaUpload);
    } catch (err: any) {
      displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    }
  };

  const uploadAndUpdateFormMediaURLs = async (uriList: any[]) => {
    let downloadUrls;

    if (uriList.length < 1) return;

    const files = uriList.map((u) => ({
      uri: u,
    }));

    await uploadMultimedia(files, (data: string[]) => {
      downloadUrls = data;
    });

    return downloadUrls;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { flex: 1 }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <View style={[styles.container, { flex: 1 }]}>
        <SettingsHeader title="Perch Registration" />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="py-5" style={{ flex: 1 }}>
            <View style={styles.itemsContainer} className="my-4 py-4">
              <View className="mb-5 mx-5">
                <Text className="font-plus-jakarta-semibold pb-5 -mt-5">
                  Registration Details
                </Text>
                <PerchRegistrationForm
                  data={
                    { propertyName: "Makossa" } as PerchRegistrationFormData
                  }
                  onSubmit={(formData: PerchRegistrationFormData) =>
                    handleRegisterClick(formData)
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  itemsContainer: {
    paddingVertical: 10,
    borderRadius: 15,
    height: "100%",
  },
  borderedItem: {
    borderBottomWidth: 1,
    borderColor: "#F4F4F4",
  },
});

export default Form;
