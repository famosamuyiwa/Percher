import SettingsHeader from "@/components/SettingsHeader";

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PerchRegistrationForm from "@/components/forms/PerchRegistration";
import { PerchRegistrationFormData } from "@/interfaces";
import useStorageBucket from "@/hooks/useBackblazeStorageBucket";
import { useState } from "react";
import { ToastType } from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";
import { useCreatePropertyMutation } from "@/hooks/mutation/usePropertyMutation";
import { router, useLocalSearchParams } from "expo-router";
import { usePropertyQuery } from "@/hooks/query/usePropertyQuery";

const Form = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { uploadMultimedia, progress } = useStorageBucket();
  const [isLoading, setIsLoading] = useState(false);
  const { displayToast, showLoader, hideLoader } = useGlobalContext();
  const createPropertyMutation = useCreatePropertyMutation();
  const propertyQuery = usePropertyQuery(Number(id));

  const handleRegisterClick = async (formData: PerchRegistrationFormData) => {
    showLoader();
    let loadingMessage = "Preparing perch details...";
    try {
      const header = await uploadAndUpdateFormMediaURLs([formData.header]);
      loadingMessage = "Uploading header...";
      const gallery = await uploadAndUpdateFormMediaURLs(formData.gallery);
      loadingMessage = "Uploading gallery...";
      const proofOfIdentity = await uploadAndUpdateFormMediaURLs(
        formData.proofOfIdentity
      );
      loadingMessage = "Uploading proof of identity...";
      const proofOfOwnership = await uploadAndUpdateFormMediaURLs(
        formData.proofOfOwnership
      );
      loadingMessage = "Uploading proof of ownership...";
      const dataAfterMediaUpload = {
        propertyName: formData.propertyName || "",
        propertyType: formData.propertyType || "",
        chargeType: formData.chargeType || "",
        beds: formData.beds || 0,
        bathrooms: formData.bathrooms || 0,
        description: formData.description || "",
        price: formData.price || 0,
        cautionFee: formData.cautionFee || 0,
        facilities: formData.facilities || [],
        checkInTimes: formData.checkInTimes || [],
        checkOutTime: formData.checkOutTime || "",
        txc: formData.txc || false,
        header: header ? header[0] : "",
        gallery: gallery ?? [],
        proofOfIdentity: proofOfIdentity ?? [],
        proofOfOwnership: proofOfOwnership ?? [],
        latitude: formData.latitude ?? 0,
        longitude: formData.longitude ?? 0,
        address: `${formData.streetAddress}, ${formData.city}, ${formData.state}. ${formData.country}`,
        streetAddress: formData.streetAddress,
        propertyNumber: formData.propertyNumber,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        snapshot: formData.snapshot ?? "ook",
      };
      loadingMessage = "Finalizing perch registration...";
      console.log("data: ", dataAfterMediaUpload);
      mutate(dataAfterMediaUpload);
    } catch (err: any) {
      displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    } finally {
      hideLoader();
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

  const mutate = (formData: PerchRegistrationFormData) => {
    createPropertyMutation.mutate(formData, { onSettled, onSuccess });
  };

  const onSettled = () => {};

  const onSuccess = () => {
    router.dismiss();
  };

  const preloadedData = () => {
    const data = propertyQuery.data?.data;
    if (!id || !data) return {} as PerchRegistrationFormData;
    console.log("data: ", data);

    const mappedData: PerchRegistrationFormData = {
      ...data,
      propertyName: data.name,
      propertyType: data.type,
      beds: data.bed.toString(), //the form is expecting strings instead of numbers for some reason
      bathrooms: data.bathroom.toString(),
      gallery: data.gallery ?? [],
      facilities: (data.facilities as unknown as string[]) ?? [],
      checkInTimes: data.checkInPeriods ?? [],
      checkOutTime: data.checkOutPeriod ?? "",
      txc: data.termsAndConditions,
      propertyNumber: data.location.propertyNumber.toString(),
      streetAddress: data.location.streetAddress,
      city: data.location.city,
      state: data.location.state,
      country: data.location.country,
      snapshot: data.location.snapshotUrl,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    };
    return mappedData;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { flex: 1 }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <View style={[styles.container, { flex: 1 }]}>
        <SettingsHeader title="Perch Registration" />
        {(propertyQuery.isFetchedAfterMount || !id) && (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="py-5" style={{ flex: 1 }}>
              <View style={styles.itemsContainer} className="my-4 py-4">
                <View className="mb-5 mx-5">
                  <Text className="font-plus-jakarta-semibold pb-5 -mt-5">
                    Registration Details
                  </Text>
                  <PerchRegistrationForm
                    data={preloadedData()}
                    onSubmit={(formData: PerchRegistrationFormData) =>
                      handleRegisterClick(formData)
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        )}
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
});

export default Form;
