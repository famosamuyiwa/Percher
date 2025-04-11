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
import { ApiResponse, PerchRegistrationFormData, Property } from "@/interfaces";
import { MediaEntityType, MediaUploadType, ToastType } from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";
import { useCreatePropertyMutation } from "@/hooks/mutation/usePropertyMutation";
import { router, useLocalSearchParams } from "expo-router";
import { usePropertyQuery } from "@/hooks/query/usePropertyQuery";
import useBackgroundUploads from "@/hooks/useBackgroundUploads";
import { uploadToR2 } from "@/hooks/useR2";

const Form = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { displayToast, showLoader, hideLoader } = useGlobalContext();
  const createPropertyMutation = useCreatePropertyMutation();
  const propertyQuery = usePropertyQuery(Number(id));
  const { uploadEntityMedia } = useBackgroundUploads();

  const handleRegisterClick = async (formData: PerchRegistrationFormData) => {
    showLoader();

    try {
      //upload lightweight required media first before letting the rest upload in the background

      //upload header
      let header = "";
      if (formData.header) {
        const url = await uploadToR2(formData.header);
        header = url;
      }

      //upload snapshot
      let snapshot = "";
      if (formData.snapshot) {
        const url = await uploadToR2(formData.snapshot);
        snapshot = url;
      }

      // Create a copy of form data with empty media URLs for initial registration
      const initialFormData = {
        ...formData,
        address: `${formData.streetAddress}, ${formData.city}, ${formData.state}. ${formData.country}.`,
        header,
        snapshot,
      };

      // Register the property first without media
      createPropertyMutation.mutate(initialFormData, {
        onSuccess: (payload) => onSuccess(payload, formData),
      });
    } catch (err: any) {
      displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    } finally {
      hideLoader();
    }
  };

  const onSettled = () => {};

  const onSuccess = (
    payload: ApiResponse<Property>,
    formData: PerchRegistrationFormData
  ) => {
    const propertyId = payload.data.id.toString();

    // Add media uploads to the background queue
    uploadEntityMedia(
      propertyId,
      MediaEntityType.PROPERTY,
      mediaItems(formData)
    );

    displayToast({
      type: ToastType.SUCCESS,
      description:
        "Property registered successfully. Media uploads will continue in the background.",
    });
    router.dismiss();
  };

  const preloadedData = () => {
    const data = propertyQuery.data?.data;
    if (!id || !data) return {} as PerchRegistrationFormData;

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

  const mediaItems = (formData: PerchRegistrationFormData) => {
    return [
      ...formData.gallery.map((uri) => ({
        uri,
        type: MediaUploadType.GALLERY,
      })),
      ...formData.proofOfIdentity.map((uri) => ({
        uri,
        type: MediaUploadType.PROOF_OF_IDENTITY,
      })),
      ...formData.proofOfOwnership.map((uri) => ({
        uri,
        type: MediaUploadType.PROOF_OF_OWNERSHIP,
      })),
    ];
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
