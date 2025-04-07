import { StateCreator } from "zustand";
import { MediaUploadType, MediaEntityType } from "@/constants/enums";

export interface FailedUpload {
  id: string;
  entityId: string;
  entityType: MediaEntityType;
  type: MediaUploadType;
  uri: string;
  error: string;
}

export interface UploadState {
  failedUploads: Record<string, FailedUpload[]>;
  addFailedUpload: (propertyId: string, upload: FailedUpload) => void;
  removeFailedUpload: (propertyId: string, uploadId: string) => void;
  clearFailedUploads: (propertyId: string) => void;
  clearAllFailedUploads: () => void;
}

export const createUploadSlice: StateCreator<
  UploadState,
  [],
  [],
  UploadState
> = (set, get, store) => ({
  failedUploads: {},

  addFailedUpload: (propertyId, upload) => {
    const { failedUploads } = get();
    const newFailedUploads = { ...failedUploads };

    if (!newFailedUploads[propertyId]) {
      newFailedUploads[propertyId] = [];
    }

    newFailedUploads[propertyId].push(upload);
    set({ failedUploads: newFailedUploads });
  },

  removeFailedUpload: (propertyId, uploadId) => {
    const { failedUploads } = get();
    const newFailedUploads = { ...failedUploads };

    if (!newFailedUploads[propertyId]) return;

    newFailedUploads[propertyId] = newFailedUploads[propertyId].filter(
      (upload) => upload.id !== uploadId
    );

    // Remove property if no failed uploads
    if (newFailedUploads[propertyId].length === 0) {
      delete newFailedUploads[propertyId];
    }

    set({ failedUploads: newFailedUploads });
  },

  clearFailedUploads: (propertyId) => {
    const { failedUploads } = get();
    const newFailedUploads = { ...failedUploads };

    delete newFailedUploads[propertyId];
    set({ failedUploads: newFailedUploads });
  },

  clearAllFailedUploads: () => {
    set({ failedUploads: {} });
  },
});
