import { useState } from "react";
import { useGlobalStore } from "@/store/store";
import {
  MediaUploadType,
  ToastType,
  MediaEntityType,
  MediaUploadStatus,
} from "@/constants/enums";
import { createMediaUpload } from "@/api/api.service";
import { useGlobalContext } from "@/lib/global-provider";
import { UploadTracker } from "@/interfaces";
import { uploadToR2 } from "@/hooks/useR2";

const useBackgroundUploads = () => {
  const { displayToast } = useGlobalContext();

  // Use Zustand store for uploads
  const {
    failedUploads,
    activeUploads,
    addFailedUpload,
    removeFailedUpload,
    clearFailedUploads,
    clearAllFailedUploads,
    addActiveUpload,
    updateActiveUpload,
    removeActiveUpload,
    clearActiveUploads,
    clearAllActiveUploads,
  } = useGlobalStore();

  // Track uploads by entity ID and type
  const [uploadingMedia, setUploadingMedia] = useState<
    Record<string, UploadTracker>
  >({});

  // Generic function to upload media for any entity
  const uploadEntityMedia = async (
    entityId: string,
    entityType: MediaEntityType,
    mediaItems: { uri: string; type: MediaUploadType }[]
  ) => {
    // Set this entity as uploading
    setUploadingMedia((prev) => ({
      ...prev,
      [entityId]: { entityId, entityType, isUploading: true },
    }));

    const uploadId = `${entityType}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Add to active uploads //might want to handle other uploads differently
    if (entityType === MediaEntityType.PROPERTY) {
      addActiveUpload(entityId, {
        id: uploadId,
        entityId,
        status: MediaUploadStatus.UPLOADING,
      });
    }

    try {
      for (const item of mediaItems) {
        try {
          let downloadUrl = "";
          downloadUrl = await uploadToR2(item.uri, (progress) => {
            console.log("progress", progress);
          });

          // Update the entity data with the new URL
          await updateEntityMediaUrl(
            entityId,
            entityType,
            item.type,
            downloadUrl
          );

          // Update status to completed
          updateActiveUpload(entityId, uploadId, {
            status: MediaUploadStatus.COMPLETED,
          });
        } catch (error: any) {
          console.error(`${item.type} upload failed for ${item.uri}:`, error);
          displayToast({
            type: ToastType.ERROR,
            description: "Upload failed. Try again later",
          });

          // Update status to failed
          updateActiveUpload(entityId, uploadId, {
            status: MediaUploadStatus.FAILED,
          });

          // Add to failed uploads
          addFailedUpload(entityId, {
            id: uploadId,
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
      setUploadingMedia((prev) => ({
        ...prev,
        [entityId]: { entityId, entityType, isUploading: false },
      }));
    }

    // Remove from active uploads after a short delay
    setTimeout(() => {
      clearAllActiveUploads();
    }, 1000);
  };

  // Retry a failed upload
  const retryUpload = async (entityId: string, uploadId: string) => {
    const entityFailedUploads = failedUploads[entityId] || [];
    const uploadToRetry = entityFailedUploads.find(
      (upload) => upload.id === uploadId
    );

    if (!uploadToRetry) return;

    // Set this entity as uploading during retry
    setUploadingMedia((prev) => ({
      ...prev,
      [entityId]: {
        entityId,
        entityType: prev[entityId]?.entityType || "unknown",
        isUploading: true,
      },
    }));

    try {
      let downloadUrl = "";
      downloadUrl = await uploadToR2(uploadToRetry.uri, (progress) => {
        console.log("progress", progress);
      });

      // Update the entity data with the new URL
      await updateEntityMediaUrl(
        entityId,
        uploadToRetry.entityType,
        uploadToRetry.type,
        downloadUrl
      );

      // Update status to completed
      updateActiveUpload(entityId, uploadId, {
        status: MediaUploadStatus.COMPLETED,
      });

      // Remove from failed uploads
      removeFailedUpload(entityId, uploadId);

      // Remove from active uploads after a short delay
      setTimeout(() => {
        removeActiveUpload(entityId, uploadId);
      }, 2000);
    } catch (error: any) {
      console.error(`Retry upload failed for ${uploadToRetry.uri}:`, error);

      // Update status to failed
      updateActiveUpload(entityId, uploadId, {
        status: MediaUploadStatus.FAILED,
      });

      // Update the error message
      addFailedUpload(entityId, {
        ...uploadToRetry,
        error: error.message || "Unknown error",
      });

      // Remove from active uploads after a short delay
      setTimeout(() => {
        removeActiveUpload(entityId, uploadId);
      }, 2000);
    } finally {
      // Set this entity as no longer uploading
      setUploadingMedia((prev) => ({
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

  // Helper function to check if a specific media is uploading
  const isMediaUploading = (entityId: string): boolean => {
    return !!uploadingMedia[entityId]?.isUploading;
  };

  // Helper function to get the entity type for a specific entity
  const getEntityType = (entityId: string): string => {
    return uploadingMedia[entityId]?.entityType || "unknown";
  };

  // Helper function to get the status of a specific property
  const getPropertyStatus = (
    propertyId: string
  ): MediaUploadStatus | undefined => {
    const isUploading = isMediaUploading(propertyId);
    const propertyFailedUploads = failedUploads[propertyId] || [];
    const failedUploadCount = propertyFailedUploads.length;

    let uploadingStat = undefined;
    if (isUploading) {
      uploadingStat = MediaUploadStatus.UPLOADING;
    } else if (failedUploadCount > 0) {
      uploadingStat = MediaUploadStatus.FAILED;
    } else {
      uploadingStat = undefined;
    }
    return uploadingStat;
  };

  return {
    uploadEntityMedia,
    retryUpload,
    failedUploads,
    activeUploads,
    isMediaUploading,
    getEntityType,
    getPropertyStatus,
    clearFailedUploads,
    clearAllFailedUploads,
    clearActiveUploads,
    clearAllActiveUploads,
  };
};

export default useBackgroundUploads;
