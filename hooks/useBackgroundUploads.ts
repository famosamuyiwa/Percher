import { useState } from "react";
import useStorageBucket from "./useBackblazeStorageBucket";
import { useGlobalStore } from "@/store/store";
import { MediaUploadType, ToastType, MediaEntityType } from "@/constants/enums";
import { createMediaUpload } from "@/api/api.service";
import { useGlobalContext } from "@/lib/global-provider";
import { UploadTracker } from "@/interfaces";

const useBackgroundUploads = () => {
  const { uploadMultimedia } = useStorageBucket();
  // Track uploads by entity ID and type
  const [uploadingEntities, setUploadingEntities] = useState<
    Record<string, UploadTracker>
  >({});
  const { displayToast } = useGlobalContext();

  // Use Zustand store for failed uploads
  const {
    failedUploads,
    addFailedUpload,
    removeFailedUpload,
    clearFailedUploads,
    clearAllFailedUploads,
  } = useGlobalStore();

  // Generic function to upload media for any entity
  const uploadEntityMedia = async (
    entityId: string,
    entityType: MediaEntityType,
    mediaItems: { uri: string; type: MediaUploadType }[]
  ) => {
    // Set this entity as uploading
    setUploadingEntities((prev) => ({
      ...prev,
      [entityId]: { entityId, entityType, isUploading: true },
    }));

    try {
      for (const item of mediaItems) {
        try {
          let downloadUrl = "";
          await uploadMultimedia({ uri: item.uri }, (url: string) => {
            downloadUrl = url;
          });

          // Update the entity data with the new URL
          await updateEntityMediaUrl(
            entityId,
            entityType,
            item.type,
            downloadUrl
          );
        } catch (error: any) {
          console.error(`${item.type} upload failed for ${item.uri}:`, error);
          displayToast({
            type: ToastType.ERROR,
            description: "Upload failed. Try again later",
          });
          addFailedUpload(entityId, {
            id: `${item.type}_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            entityId: entityId,
            entityType: entityType,
            type: item.type,
            uri: item.uri,
            error: error.message || "Unknown error",
          });
        }
      }
      displayToast({
        type: ToastType.SUCCESS,
        description: "Media finished uploading successfully",
      });
    } catch (error) {
      console.error(
        `Error uploading media for ${entityType} ${entityId}:`,
        error
      );
    } finally {
      // Set this entity as no longer uploading
      setUploadingEntities((prev) => ({
        ...prev,
        [entityId]: { entityId, entityType, isUploading: false },
      }));
    }
  };

  // Retry a failed upload
  const retryUpload = async (entityId: string, uploadId: string) => {
    const entityFailedUploads = failedUploads[entityId] || [];
    const uploadToRetry = entityFailedUploads.find(
      (upload) => upload.id === uploadId
    );

    if (!uploadToRetry) return;

    // Set this entity as uploading during retry
    setUploadingEntities((prev) => ({
      ...prev,
      [entityId]: {
        entityId,
        entityType: prev[entityId]?.entityType || "unknown",
        isUploading: true,
      },
    }));

    try {
      let downloadUrl = "";
      await uploadMultimedia({ uri: uploadToRetry.uri }, (url: string) => {
        downloadUrl = url;
      });

      // Update the entity data with the new URL
      await updateEntityMediaUrl(
        entityId,
        uploadToRetry.entityType,
        uploadToRetry.type,
        downloadUrl
      );

      // Remove from failed uploads
      removeFailedUpload(entityId, uploadId);
    } catch (error: any) {
      console.error(`Retry upload failed for ${uploadToRetry.uri}:`, error);
      // Update the error message
      addFailedUpload(entityId, {
        ...uploadToRetry,
        error: error.message || "Unknown error",
      });
    } finally {
      // Set this entity as no longer uploading
      setUploadingEntities((prev) => ({
        ...prev,
        [entityId]: {
          entityId,
          entityType: prev[entityId]?.entityType || "unknown",
          isUploading: false,
        },
      }));
    }
  };

  // Update entity media URL in the database
  const updateEntityMediaUrl = async (
    entityId: string,
    entityType: MediaEntityType,
    type: MediaUploadType,
    url: string
  ) => {
    try {
      await createMediaUpload({
        mediaType: type,
        mediaEntityTypeId: Number(entityId),
        mediaUrl: url,
        mediaEntityType: entityType,
      });
      console.log(`Updated ${type} for entity ${entityId} with URL: ${url}`);
    } catch (error) {
      console.error(`Failed to update entity media URL:`, error);
      throw error; // Re-throw to be handled by the caller
    }
  };

  // Helper function to check if a specific entity is uploading
  const isEntityUploading = (entityId: string): boolean => {
    return !!uploadingEntities[entityId]?.isUploading;
  };

  // Helper function to get the entity type for a specific entity
  const getEntityType = (entityId: string): string => {
    return uploadingEntities[entityId]?.entityType || "unknown";
  };

  return {
    uploadEntityMedia,
    retryUpload,
    failedUploads,
    isEntityUploading,
    getEntityType,
    clearFailedUploads,
    clearAllFailedUploads,
  };
};

export default useBackgroundUploads;
