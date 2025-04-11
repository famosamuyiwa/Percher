import { getR2PresignedUrl } from "@/api/api.service";
import * as FileSystem from "expo-file-system";

type UploadProgressCallback = (progress: number) => void;

export async function uploadToR2(
  fileUri: string,
  onProgress?: UploadProgressCallback
) {
  //generate a unique key
  const fileExt = fileUri.split(".").pop()?.toLowerCase() || "jpg";
  const key = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  // Step 1: Get presigned URL
  const { uploadUrl, fileUrl } = await getR2PresignedUrl(key);

  // Step 2: Create upload task
  const uploadTask = FileSystem.createUploadTask(
    uploadUrl,
    fileUri,
    {
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      httpMethod: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    },
    (progress) => {
      if (onProgress) {
        onProgress(
          (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100
        );
      }
    }
  );

  // Step 3: Start upload and wait for completion
  const uploadRes = await uploadTask.uploadAsync();

  if (!uploadRes) {
    throw new Error("Upload failed: No response received");
  }

  if (uploadRes.status === 200) {
    console.log("✅ Upload successful:", fileUrl);
    return fileUrl;
  } else {
    throw new Error(`❌ Upload failed: ${uploadRes.status}`);
  }
}
