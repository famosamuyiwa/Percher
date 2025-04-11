import { StateCreator } from "zustand";
import {
  MediaUploadType,
  MediaEntityType,
  MediaUploadStatus,
} from "@/constants/enums";

export interface FailedUpload {
  id: string;
  entityId: string;
  entityType: MediaEntityType;
  type: MediaUploadType;
  uri: string;
  error: string;
}

export interface ActiveUpload {
  id: string;
  entityId: string;
  entityType?: MediaEntityType;
  type?: MediaUploadType;
  uri?: string;
  status?: MediaUploadStatus;
  progress?: number;
}

export interface UploadState {
  failedUploads: Record<string, FailedUpload[]>;
  activeUploads: Record<string, ActiveUpload[]>;
  addFailedUpload: (propertyId: string, upload: FailedUpload) => void;
  removeFailedUpload: (propertyId: string, uploadId: string) => void;
  clearFailedUploads: (propertyId: string) => void;
  clearAllFailedUploads: () => void;
  addActiveUpload: (entityId: string, upload: ActiveUpload) => void;
  updateActiveUpload: (
    entityId: string,
    uploadId: string,
    updates: Partial<ActiveUpload>
  ) => void;
  removeActiveUpload: (entityId: string, uploadId: string) => void;
  clearActiveUploads: (entityId: string) => void;
  clearAllActiveUploads: () => void;
}

export const createUploadSlice: StateCreator<
  UploadState,
  [],
  [],
  UploadState
> = (set, get, store) => ({
  failedUploads: {},
  activeUploads: {},

  addFailedUpload: (propertyId, upload) => {
    set((state) => ({
      failedUploads: {
        ...state.failedUploads,
        [propertyId]: [...(state.failedUploads[propertyId] || []), upload],
      },
    }));
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

  addActiveUpload: (entityId, upload) => {
    set((state) => ({
      activeUploads: {
        ...state.activeUploads,
        [entityId]: [...(state.activeUploads[entityId] || []), upload],
      },
    }));
  },

  updateActiveUpload: (entityId, uploadId, updates) => {
    const { activeUploads } = get();
    const newActiveUploads = { ...activeUploads };

    if (!newActiveUploads[entityId]) return;

    newActiveUploads[entityId] = newActiveUploads[entityId].map((upload) =>
      upload.id === uploadId ? { ...upload, ...updates } : upload
    );

    set({ activeUploads: newActiveUploads });
  },

  removeActiveUpload: (entityId, uploadId) => {
    const { activeUploads } = get();
    const newActiveUploads = { ...activeUploads };

    if (!newActiveUploads[entityId]) return;

    newActiveUploads[entityId] = newActiveUploads[entityId].filter(
      (upload) => upload.id !== uploadId
    );

    // Remove property if no active uploads
    if (newActiveUploads[entityId].length === 0) {
      delete newActiveUploads[entityId];
    }

    set({ activeUploads: newActiveUploads });
  },

  clearActiveUploads: (entityId) => {
    const { activeUploads } = get();
    const newActiveUploads = { ...activeUploads };

    delete newActiveUploads[entityId];
    set({ activeUploads: newActiveUploads });
  },

  clearAllActiveUploads: () => {
    set({ activeUploads: {} });
  },
});
