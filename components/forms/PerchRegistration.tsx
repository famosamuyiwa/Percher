import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Modal,
  ScrollView,
} from "react-native";
import * as z from "zod";
import { TextField } from "../Textfield";
import { useState, useEffect } from "react";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/common";
import { Image } from "expo-image";
import useImagePicker from "@/hooks/useImagePicker";
import { Picker } from "@react-native-picker/picker";
import {
  ChargeType,
  CheckInTime,
  CheckOutTime,
  Facility,
  PerchTypes,
  ToastType,
} from "@/constants/enums";
import MiniGalleryItem from "../GalleryItem";
import MultiPicker from "../MultiPicker";
import CustomButton from "../Button";
import { useGlobalContext } from "@/lib/global-provider";
import { FormProps, PerchRegistrationFormData } from "@/interfaces";
import { formStyles } from "./styles";
import { router } from "expo-router";
import { useMapContext } from "@/lib/map-provider";

// Validation Schema
const schema = z.object({
  propertyName: z.string().min(2, "Must be at least 2 characters"),
  propertyType: z.string().min(2, "Must be at least 2 characters"),
  chargeType: z.string().min(2, "Must be at least 2 characters"),
  beds: z.number().min(1, "Must be at least 1"),
  bathrooms: z.number().min(1, "Must be at least 1"),
  description: z.string().min(20, "Must be at least 50 characters"),
  header: z.string().min(20, "Upload a header"),
  price: z.number().min(1, "Must be at least 1"),
  cautionFee: z.number().min(1, "Must be at least 1"),
  gallery: z.array(z.string()).default([]), // Ensures it's always an array
  proofOfOwnership: z.array(z.string()).min(1, "Required").default([]), // Ensures it's always an array
  proofOfIdentity: z.array(z.string()).min(1, "Required").default([]), // Ensures it's always an array
  txc: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
  facilities: z.array(z.string()).default([]), // Ensures it's always an array
  checkInTimes: z.array(z.string()).min(1, "Required").default([]), // Ensures it's always an array
  checkOutTime: z.string().min(1, "Required").default(""),
  propertyNumber: z.number().min(1, "Required"),
  streetAddress: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  snapshot: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export default function PerchRegistrationForm({
  data,
  onSubmit,
}: FormProps<PerchRegistrationFormData, any>) {
  const [height, setHeight] = useState(20);
  const [perchTypeModalVisible, setPerchTypeModalVisible] = useState(false);
  const [chargeTypeModalVisible, setChargeTypeModalVisible] = useState(false);
  const [checkOutPeriodModalVisible, setCheckOutPeriodModalVisible] =
    useState(false);

  const { displayToast } = useGlobalContext();
  const { pickMultimedia } = useImagePicker();
  const { snapshot: mapSnapshot, selectedCoordinates } = useMapContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { ...data, country: "Nigeria" },
  });
  const header = watch("header"); // Automatically updates when changed
  const gallery = watch("gallery");
  const proofOfOwnership = watch("proofOfOwnership");
  const proofOfIdentity = watch("proofOfIdentity");
  const facilities = watch("facilities");
  const txc = watch("txc");
  const chargeType = watch("chargeType");
  const perchType = watch("propertyType");
  const checkInTimes = watch("checkInTimes");
  const checkOutTime = watch("checkOutTime");
  const snapshot = watch("snapshot");

  // Update the form's snapshot value when the mapSnapshot changes
  useEffect(() => {
    if (mapSnapshot) {
      setValue("snapshot", mapSnapshot, { shouldValidate: true });
    }
  }, [mapSnapshot, setValue]);

  useEffect(() => {
    if (selectedCoordinates) {
      setValue("latitude", selectedCoordinates[1], { shouldValidate: true });
      setValue("longitude", selectedCoordinates[0], { shouldValidate: true });
    }
  }, [selectedCoordinates, setValue]);

  const handleHeaderSelect = async () => {
    try {
      const image: any = await pickMultimedia(false, true);
      setValue("header", image.uri[0], { shouldValidate: true });
    } catch {
      console.log("Error picking media");
    }
  };

  const handleSnapshotSelect = async () => {
    router.push({
      pathname: "/map",
    });
  };

  const handleAddToList = async (listName: string) => {
    try {
      const images: any = await pickMultimedia(false, false, true);
      switch (listName) {
        case "gallery":
          const currentGallery = gallery || []; // Ensure it's an array
          const updatedGallery = [...currentGallery, ...images.uri];

          setValue("gallery", updatedGallery, { shouldValidate: true }); // Update form state
          break;
        case "proofOfOwnership":
          const currentProofOfOwnership = proofOfOwnership || []; // Ensure it's an array
          const updatedProofOfOwnership = [
            ...currentProofOfOwnership,
            ...images.uri,
          ];
          setValue("proofOfOwnership", updatedProofOfOwnership, {
            shouldValidate: true,
          }); // Update form state
          break;
        case "proofOfIdentity":
          const currentProofOfIdentity = proofOfIdentity || []; // Ensure it's an array
          const updatedProofOfIdentity = [
            ...currentProofOfIdentity,
            ...images.uri,
          ];

          setValue("proofOfIdentity", updatedProofOfIdentity, {
            shouldValidate: true,
          }); // Update form state
          break;
        default:
          return;
      }
    } catch {
      console.log("Error uploading image");
    }
  };

  const handleRemoveFromList = (listName: string, imgUri: any) => {
    switch (listName) {
      case "gallery":
        setValue(
          "gallery",
          gallery?.filter((uri) => uri !== imgUri),
          { shouldValidate: true }
        );
        break;
      case "proofOfOwnership":
        setValue(
          "proofOfOwnership",
          proofOfOwnership?.filter((uri) => uri !== imgUri),
          { shouldValidate: true }
        );
        break;
      case "proofOfIdentity":
        setValue(
          "proofOfIdentity",
          proofOfIdentity?.filter((uri) => uri !== imgUri),
          { shouldValidate: true }
        );
        break;
      default:
        return;
    }
  };

  const handleOnSubmit = async (data: any) => {
    try {
      onSubmit(data);
    } catch (err: any) {
      displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    }
  };

  return (
    <View className="gap-10">
      <View className="bg-white rounded-2xl p-5 gap-5">
        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 mb-2">
          <Entypo name="home" size={16} color={Colors.accent} />
        </View>
        <View>
          <Controller
            control={control}
            name="propertyName"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                isSmallLabelVisible={true}
                label="Perch name"
                placeholder="e.g Transcorp Hilton"
                value={value}
                onValueChange={onChange}
                style={formStyles.input}
                onBlur={onBlur}
                placeholderColor="darkgrey"
              />
            )}
          />
          {errors.propertyName && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.propertyName.message}
            </Text>
          )}
        </View>

        <View className="flex-row gap-5">
          <View className="w-5/12">
            <Controller
              control={control}
              name="beds"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label="Beds"
                  placeholder="e.g 2"
                  value={value}
                  onValueChange={(text: string) => onChange(Number(text))}
                  style={formStyles.input}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholderColor="darkgrey"
                />
              )}
            />
            {errors.beds && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.beds.message}
              </Text>
            )}
          </View>
          <View className="w-5/12">
            <Controller
              control={control}
              name="bathrooms"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label="Bathrooms"
                  placeholder="e.g 3"
                  value={value}
                  onValueChange={(text: string) => onChange(Number(text))}
                  style={formStyles.input}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholderColor="darkgrey"
                />
              )}
            />
            {errors.bathrooms && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.bathrooms.message}
              </Text>
            )}
          </View>
        </View>

        <View>
          <Controller
            control={control}
            name="facilities"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Facilities
                </Text>
                <MultiPicker
                  options={Object.values(Facility)} // Options
                  selectedValues={facilities} // Initially selected
                  onChange={onChange} // Callback function
                  label="Facilities"
                />
              </View>
            )}
          />
          {errors.facilities && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.facilities.message}
            </Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="propertyType"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Perch type
                </Text>
                <TouchableOpacity
                  onPress={() => setPerchTypeModalVisible(true)}
                  style={formStyles.pickerBtn}
                >
                  <Modal
                    visible={perchTypeModalVisible}
                    transparent
                    animationType="slide"
                  >
                    <View style={formStyles.modalContainer}>
                      <View style={formStyles.pickerContainer}>
                        <Picker
                          selectedValue={perchType}
                          onValueChange={(itemValue) =>
                            setValue("propertyType", itemValue, {
                              shouldValidate: true,
                            })
                          }
                          itemStyle={{
                            color: "black", // Set text color
                            fontSize: 18, // Set font size
                          }}
                        >
                          {Object.values(PerchTypes).map((type) => (
                            <Picker.Item key={type} label={type} value={type} />
                          ))}
                        </Picker>
                        <Button
                          title="Done"
                          onPress={() => {
                            setPerchTypeModalVisible(false);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>
                  <Text className="font-plus-jakarta-regular">
                    {perchType ?? "-- Select --"}
                  </Text>
                  <Entypo
                    name="chevron-down"
                    size={16}
                    color={"darkgrey"}
                    className="absolute right-0 px-5"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.propertyType && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.propertyType.message}
            </Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                isSmallLabelVisible={true}
                label="Description"
                placeholder="e.g describe the experience living here"
                value={value}
                onValueChange={onChange}
                style={[
                  formStyles.input,
                  { height, minHeight: 40, padding: 10 },
                ]}
                onContentSizeChange={(event: any) =>
                  setHeight(event.nativeEvent.contentSize.height)
                }
                onBlur={onBlur}
                multiLine={true}
                placeholderColor="darkgrey"
              />
            )}
          />
          {errors.description && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.description.message}
            </Text>
          )}
        </View>

        <View className="mt-5">
          <Controller
            control={control}
            name="header"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Header
                </Text>
                <TouchableOpacity
                  className="h-40 items-center justify-center"
                  style={{ backgroundColor: "lightgrey", borderRadius: 10 }}
                  onPress={() => {
                    handleHeaderSelect();
                  }}
                >
                  {!header && (
                    <MaterialCommunityIcons
                      name="image-size-select-actual"
                      size={50}
                      color={"darkgrey"}
                    />
                  )}
                  {header && (
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        borderWidth: 0.4,
                        borderColor: Colors.accent,
                      }}
                      source={{ uri: header }}
                      contentFit="cover"
                      contentPosition={"center"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.header && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.header.message}
            </Text>
          )}
        </View>
      </View>

      <View className="bg-white rounded-2xl p-5 gap-5">
        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 mb-2">
          <Entypo name="location" size={16} color={Colors.accent} />
        </View>
        <View>
          <Controller
            control={control}
            name="streetAddress"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                isSmallLabelVisible={true}
                label="Street Address"
                placeholder="e.g Omoighodalo Street"
                value={value}
                onValueChange={onChange}
                style={formStyles.input}
                onBlur={onBlur}
                placeholderColor="darkgrey"
              />
            )}
          />
          {errors.streetAddress && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.streetAddress.message}
            </Text>
          )}
        </View>

        <View className="flex-row gap-5">
          <View className="w-5/12">
            <Controller
              control={control}
              name="propertyNumber"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label="House Number"
                  placeholder="e.g 23"
                  value={value}
                  onValueChange={(text: string) => onChange(Number(text))}
                  style={formStyles.input}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholderColor="darkgrey"
                />
              )}
            />
            {errors.propertyNumber && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.propertyNumber.message}
              </Text>
            )}
          </View>
          <View className="w-5/12">
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label="City"
                  placeholder="e.g Ogudu"
                  value={value}
                  onValueChange={(text: string) => onChange(text)}
                  style={formStyles.input}
                  onBlur={onBlur}
                  placeholderColor="darkgrey"
                />
              )}
            />
            {errors.city && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.city.message}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row gap-5">
          <View className="w-5/12">
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label="State"
                  placeholder="e.g Lagos"
                  value={value}
                  onValueChange={(text: string) => onChange(text)}
                  style={formStyles.input}
                  onBlur={onBlur}
                  placeholderColor="darkgrey"
                />
              )}
            />
            {errors.state && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.state.message}
              </Text>
            )}
          </View>

          <View className="w-5/12">
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  isSmallLabelVisible={true}
                  label="Country"
                  placeholder="e.g Nigeria"
                  value={value}
                  onValueChange={(text: string) => onChange(text)}
                  style={formStyles.input}
                  onBlur={onBlur}
                  placeholderColor="darkgrey"
                  isEditable={false}
                />
              )}
            />
            {errors.country && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.country.message}
              </Text>
            )}
          </View>
        </View>
        <View>
          <Controller
            control={control}
            name="snapshot"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Location
                </Text>
                <TouchableOpacity
                  className="h-52 items-center justify-center"
                  style={{ backgroundColor: "lightgrey", borderRadius: 10 }}
                  onPress={() => {
                    handleSnapshotSelect();
                  }}
                >
                  {!snapshot && (
                    <FontAwesome6
                      name="map-location-dot"
                      size={50}
                      color={"darkgrey"}
                    />
                  )}
                  {snapshot && (
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        borderWidth: 0.4,
                        borderColor: Colors.accent,
                      }}
                      source={{ uri: snapshot }}
                      contentFit="cover"
                      contentPosition={"center"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.snapshot && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.snapshot.message}
            </Text>
          )}
        </View>
      </View>

      <View className="bg-white rounded-2xl p-5 gap-5 ">
        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 mb-2">
          <Entypo name="images" size={16} color={Colors.accent} />
        </View>
        <View>
          <Controller
            control={control}
            name="gallery"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Gallery
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => handleAddToList("gallery")}
                    className="px-5"
                  >
                    <MaterialCommunityIcons
                      name="file-image-plus"
                      size={40}
                      color={"darkgrey"}
                    />
                  </TouchableOpacity>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row h-40"
                    contentContainerClassName="items-center"
                  >
                    {gallery?.map((picture: any, index: any) => (
                      <View className="mr-5" key={index}>
                        <MiniGalleryItem
                          uri={picture}
                          isRemovable={true}
                          onPressRemoveBtn={() =>
                            handleRemoveFromList("gallery", picture)
                          }
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          />
          {errors.gallery && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.gallery.message}
            </Text>
          )}
        </View>
      </View>

      <View className="bg-white rounded-2xl p-5 gap-5">
        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 mb-2">
          <FontAwesome6
            name="hand-holding-dollar"
            size={16}
            color={Colors.accent}
          />
        </View>
        <View>
          <Controller
            control={control}
            name="chargeType"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Charge type
                </Text>
                <TouchableOpacity
                  onPress={() => setChargeTypeModalVisible(true)}
                  style={formStyles.pickerBtn}
                >
                  <Modal
                    visible={chargeTypeModalVisible}
                    transparent
                    animationType="slide"
                  >
                    <View style={formStyles.modalContainer}>
                      <View style={formStyles.pickerContainer}>
                        <Picker
                          selectedValue={chargeType}
                          onValueChange={(itemValue) =>
                            setValue("chargeType", itemValue, {
                              shouldValidate: true,
                            })
                          }
                          itemStyle={{
                            color: "black", // Set text color
                            fontSize: 18, // Set font size
                          }}
                        >
                          {Object.values(ChargeType).map((type) => (
                            <Picker.Item key={type} label={type} value={type} />
                          ))}
                        </Picker>
                        <Button
                          title="Done"
                          onPress={() => {
                            // onChange(chargeType);
                            setChargeTypeModalVisible(false);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>
                  <Text className="font-plus-jakarta-regular">
                    {chargeType ?? "-- Select --"}
                  </Text>
                  <Entypo
                    name="chevron-down"
                    size={16}
                    color={"darkgrey"}
                    className="absolute right-0 px-5"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.chargeType && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.chargeType.message}
            </Text>
          )}
        </View>

        <View className="flex-row gap-5">
          <View className="w-5/12">
            <Controller
              control={control}
              name="checkInTimes"
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <Text className="text-xs font-plus-jakarta-regular pb-3">
                    Check-In periods
                  </Text>
                  <MultiPicker
                    options={Object.values(CheckInTime)} // Options
                    selectedValues={checkInTimes} // Initially selected
                    onChange={onChange} // Callback function
                  />
                </View>
              )}
            />
            {errors.checkInTimes && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.checkInTimes.message}
              </Text>
            )}
          </View>
          <View className="w-5/12">
            <Controller
              control={control}
              name="checkOutTime"
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <Text className="text-xs font-plus-jakarta-regular pb-3">
                    Check-Out period
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCheckOutPeriodModalVisible(true)}
                    style={formStyles.pickerBtn}
                  >
                    <Modal
                      visible={checkOutPeriodModalVisible}
                      transparent
                      animationType="slide"
                    >
                      <View style={formStyles.modalContainer}>
                        <View style={formStyles.pickerContainer}>
                          <Picker
                            selectedValue={checkOutTime}
                            onValueChange={(itemValue) =>
                              setValue("checkOutTime", itemValue)
                            }
                            itemStyle={{
                              color: "black", // Set text color
                              fontSize: 18, // Set font size
                            }}
                          >
                            {Object.values(CheckOutTime).map((type) => (
                              <Picker.Item
                                key={type}
                                label={type}
                                value={type}
                              />
                            ))}
                          </Picker>
                          <Button
                            title="Done"
                            onPress={() => {
                              setCheckOutPeriodModalVisible(false);
                            }}
                          />
                        </View>
                      </View>
                    </Modal>
                    <Text className="font-plus-jakarta-regular">
                      {checkOutTime ?? "-- Select --"}
                    </Text>
                    <Entypo
                      name="chevron-down"
                      size={16}
                      color={"darkgrey"}
                      className="absolute right-0 px-5"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.checkOutTime && (
              <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
                {errors.checkOutTime.message}
              </Text>
            )}
          </View>
        </View>

        <View>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value, onBlur } }) => {
              const formattedValue = value
                ? Number(value).toLocaleString() // Adds commas dynamically
                : "";

              return (
                <TextField
                  isSmallLabelVisible={true}
                  label="Price"
                  placeholder="150,000"
                  value={formattedValue}
                  onValueChange={(text: string) => {
                    // Remove non-numeric characters except for numbers
                    const rawValue = text.replace(/,/g, ""); // Remove commas before storing

                    // Ensure it's a valid number before updating the state
                    if (!isNaN(Number(rawValue))) {
                      onChange(Number(rawValue)); // Store raw number (without commas)
                    }
                  }}
                  style={formStyles.currencyInput}
                  onBlur={onBlur}
                  keyboardType={"numeric"}
                  isCurrency={true}
                  placeholderColor="darkgrey"
                />
              );
            }}
          />
          {errors.price && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.price.message}
            </Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="cautionFee"
            render={({ field: { onChange, value, onBlur } }) => {
              const formattedValue = value
                ? Number(value).toLocaleString() // Adds commas dynamically
                : "";

              return (
                <TextField
                  isSmallLabelVisible={true}
                  label="Caution Fee"
                  placeholder="150,000"
                  value={formattedValue}
                  onValueChange={(text: string) => {
                    // Remove non-numeric characters except for numbers
                    const rawValue = text.replace(/,/g, ""); // Remove commas before storing

                    // Ensure it's a valid number before updating the state
                    if (!isNaN(Number(rawValue))) {
                      onChange(Number(rawValue)); // Store raw number (without commas)
                    }
                  }}
                  style={formStyles.currencyInput}
                  onBlur={onBlur}
                  keyboardType={"numeric"}
                  isCurrency={true}
                  placeholderColor="darkgrey"
                />
              );
            }}
          />
          {errors.cautionFee && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.cautionFee.message}
            </Text>
          )}
        </View>

        <View className="flex-row items-center gap-2 ml-2">
          <FontAwesome name="warning" size={10} color={"gold"} />
          <Text className="text-xs font-plus-jakarta-xs text-gray-500">
            5% service fee will be deducted from price
          </Text>
        </View>
      </View>

      <View className="gap-5 bg-white rounded-2xl p-5">
        <View className="flex flex-row items-center justify-center bg-accent-100 rounded-full size-10 mb-2">
          <FontAwesome name="id-card" size={16} color={Colors.accent} />
        </View>
        <View>
          <Controller
            control={control}
            name="proofOfIdentity"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Proof of identity (ID Card, Passport, Driver's License etc.)
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => handleAddToList("proofOfIdentity")}
                    className="px-5"
                  >
                    <MaterialCommunityIcons
                      name="file-image-plus"
                      size={40}
                      color={"darkgrey"}
                    />
                  </TouchableOpacity>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row h-40"
                    contentContainerClassName="items-center"
                  >
                    {proofOfIdentity?.map((picture: any, index: any) => (
                      <View className="mr-5" key={index}>
                        <MiniGalleryItem
                          uri={picture}
                          isRemovable={true}
                          onPressRemoveBtn={() =>
                            handleRemoveFromList("proofOfIdentity", picture)
                          }
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          />
          {errors.proofOfIdentity && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.proofOfIdentity.message}
            </Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="proofOfOwnership"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Proof of ownership or Rent Permit (Deeds, legal documents
                  etc.)
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => handleAddToList("proofOfOwnership")}
                    className="px-5"
                  >
                    <MaterialCommunityIcons
                      name="file-image-plus"
                      size={40}
                      color={"darkgrey"}
                    />
                  </TouchableOpacity>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row h-40"
                    contentContainerClassName="items-center"
                  >
                    {proofOfOwnership?.map((picture: any, index: any) => (
                      <View className="mr-5" key={index}>
                        <MiniGalleryItem
                          uri={picture}
                          isRemovable={true}
                          onPressRemoveBtn={() =>
                            handleRemoveFromList("proofOfOwnership", picture)
                          }
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          />
          {errors.proofOfOwnership && (
            <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
              {errors.proofOfOwnership.message}
            </Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="txc"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="flex-row gap-5">
                <TouchableOpacity onPress={() => onChange(!txc)}>
                  <MaterialIcons
                    name={txc ? "check-box" : "check-box-outline-blank"}
                    size={20}
                    color={txc ? Colors.primary : "black"}
                  />
                </TouchableOpacity>
                <Text className="font-plus-jakarta-regular">
                  I have read and agree to the Terms and Conditions.
                </Text>
              </View>
            )}
          />
        </View>
        {errors.txc && (
          <Text className="font-plus-jakarta-regular text-red-500 text-xs self-end">
            {errors.txc.message}
          </Text>
        )}
      </View>

      <View className="justify-end py-10 px-5">
        <CustomButton
          label="Register"
          onPress={handleSubmit((data) => {
            handleOnSubmit(data);
          })}
          isDisabled={!isValid}
        />
      </View>
    </View>
  );
}
