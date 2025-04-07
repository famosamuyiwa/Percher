import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalStore } from "@/store/store";
import { ToastType } from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";
import useBackgroundUploads from "@/hooks/useBackgroundUploads";

type UploadStatusProps = {
  propertyId: string;
};

const UploadStatus: React.FC<UploadStatusProps> = ({ propertyId }) => {
  const { failedUploads } = useGlobalStore();
  const { retryUpload } = useBackgroundUploads();
  const { displayToast } = useGlobalContext();

  const propertyFailedUploads = failedUploads[propertyId] || [];
  const failedCount = propertyFailedUploads.length;

  const handleRetry = (uploadId: string) => {
    retryUpload(propertyId, uploadId);
    displayToast({
      type: ToastType.SUCCESS,
      description: "Retrying upload...",
    });
  };

  if (failedCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Failed Uploads</Text>

      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Ionicons name="alert-circle-outline" size={20} color="#E74C3C" />
          <Text style={styles.statusText}>{failedCount} failed</Text>
        </View>
      </View>

      <View style={styles.failedContainer}>
        <ScrollView style={styles.failedList}>
          {propertyFailedUploads.map((item) => (
            <View key={item.id} style={styles.failedItem}>
              <View style={styles.failedItemInfo}>
                <Text style={styles.failedItemType}>{item.type}</Text>
                <Text style={styles.failedItemError} numberOfLines={1}>
                  {item.error || "Unknown error"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => handleRetry(item.id)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
  },
  failedContainer: {
    marginTop: 10,
  },
  failedList: {
    maxHeight: 150,
  },
  failedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  failedItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  failedItemType: {
    fontWeight: "500",
    textTransform: "capitalize",
  },
  failedItemError: {
    color: "#E74C3C",
    fontSize: 12,
  },
  retryButton: {
    backgroundColor: "#3498DB",
    padding: 8,
    borderRadius: 5,
    minWidth: 60,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default UploadStatus;
