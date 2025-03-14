import {
  PerchRegistrationFormData,
  PerchRegistrationFormProps,
} from "@/interfaces";

export const Commafy = (value: number) => {
  if (!value) return;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (date: Date | "") => {
  if (date === "") return;
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short", // Monday
    day: "2-digit", // 03
    month: "short", // March
    year: "numeric", // 2025
  });
};

export const formatCurrency = (value: string) => {
  // Remove non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, "");

  // If the value is empty, return 0.00
  if (numericValue === "") return "0.00";

  // Convert to a number and divide by 100 to get the correct decimal place
  const floatValue = parseFloat(numericValue) / 100;

  // Format the number to always have 2 decimal places
  return floatValue.toFixed(2);
};

export const normalizeFormData = (data: PerchRegistrationFormData) => {
  const normalizedData = {
    propertyName: data.propertyName ?? "", // Default to empty string
    propertyType: data.propertyType ?? "", // Default to empty string
    beds: data.beds ?? 1, // Default to 1 bed
    bathrooms: data.bathrooms ?? 1, // Default to 1 bathroom
    description: data.description ?? "", // Default to empty string
    header: data.header ?? "", // Default to empty string
    location: data.location ?? "", // Default to empty string
    price: data.price ?? 0, // Default to 0
    cautionFee: data.cautionFee ?? 0, // Default to 0
    gallery: data.gallery ?? [], // Default to empty array
    proofOfOwnership: data.proofOfOwnership ?? [], // Default to empty array
    proofOfIdentity: data.proofOfIdentity ?? [], // Default to empty array
    txc: data.txc ?? false, // Default to false
    facilities: data.facilities ?? [], // Default to empty array
  };

  return normalizedData;
};

export const handleApiError = (error: any): never => {
  if (error.response) {
    const customMessage = error.response.data?.message || "Request failed!";
    console.log("error: ", customMessage);
    throw new Error(customMessage);
  } else if (error.request) {
    console.log("error: No response from server. Please try again later.");
    throw new Error("No response from server. Please try again later.");
  } else {
    console.log("error: An error occurred. Please try again.");
    throw new Error("An error occurred. Please try again.");
  }
};
