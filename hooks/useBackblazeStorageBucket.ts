import axios from "axios";
import { useState } from "react";
import * as FileSystem from "expo-file-system";

const B2_KEY_ID = process.env.EXPO_PUBLIC_BACKBLAZE_KEY_ID!;
const B2_APPLICATION_KEY = process.env.EXPO_PUBLIC_BACKBLAZE_APPLICATION_KEY!;
const B2_BUCKET_ID = process.env.EXPO_PUBLIC_BACKBLAZE_BUCKET_ID!;
const B2_BUCKET_NAME =
  process.env.EXPO_PUBLIC_BACKBLAZE_BUCKET_NAME || "percher-multimedia";

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 seconds

const useStorageBucket = () => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  async function retryRequest(fn: () => Promise<any>, retries = MAX_RETRIES) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed:`, error);
        if (attempt < retries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * (attempt + 1))
          );
        } else {
          throw error;
        }
      }
    }
  }

  async function uploadMultimedia(
    files: any[],
    callback: (urls: string[]) => void
  ) {
    try {
      console.log("start upload");
      setError(null);
      const authResponse = await retryRequest(() =>
        axios.get("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
          auth: { username: B2_KEY_ID, password: B2_APPLICATION_KEY },
        })
      );

      const { apiUrl, authorizationToken, downloadUrl, recommendedPartSize } =
        authResponse.data;
      let uploadedUrls: string[] = [];

      await Promise.all(
        files.map(async (file) => {
          try {
            console.log(`Processing file: ${file.uri}`);
            const fileInfo = await FileSystem.getInfoAsync(file.uri);
            if (!fileInfo.exists || fileInfo.size === 0) {
              throw new Error(`File doesn't exist or is empty: ${file.uri}`);
            }

            const fileUrl =
              fileInfo.size > 5 * 1024 * 1024
                ? await multipartUpload(
                    apiUrl,
                    authorizationToken,
                    downloadUrl,
                    file,
                    recommendedPartSize
                  )
                : await simpleUpload(
                    apiUrl,
                    authorizationToken,
                    downloadUrl,
                    file
                  );

            uploadedUrls.push(fileUrl);
          } catch (error: any) {
            console.log(`Upload failed for ${file.uri}:`, error);
            throw new Error(`Media upload failed, please try again later.`);
          }
        })
      );

      if (uploadedUrls.length > 0) callback(uploadedUrls);
      else console.error("No files were successfully uploaded");
    } catch (error: any) {
      console.error("Bulk upload failed:", error);
      throw new Error(error.message);
    }
  }

  async function simpleUpload(
    apiUrl: string,
    authToken: string,
    downloadUrl: string,
    file: any
  ) {
    return retryRequest(async () => {
      const uploadUrlResponse = await axios.post(
        `${apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: B2_BUCKET_ID },
        { headers: { Authorization: authToken } }
      );
      const { uploadUrl, authorizationToken: uploadAuthToken } =
        uploadUrlResponse.data;

      const fileExt = getFileExtension(file.uri);
      const mimeType = getMimeType(fileExt);
      const fileName = `upload_${Date.now()}.${fileExt}`;

      const uploadResponse = await FileSystem.uploadAsync(uploadUrl, file.uri, {
        headers: {
          Authorization: uploadAuthToken,
          "X-Bz-File-Name": encodeURIComponent(fileName),
          "Content-Type": mimeType,
          "X-Bz-Content-Sha1": "do_not_verify",
        },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        httpMethod: "POST",
      });

      if (uploadResponse.status !== 200) {
        throw new Error(
          `Upload failed with status ${uploadResponse.status}: ${uploadResponse.body}`
        );
      }

      return `${downloadUrl}/file/${B2_BUCKET_NAME}/${encodeURIComponent(
        fileName
      )}`;
    });
  }

  async function multipartUpload(
    apiUrl: string,
    authToken: string,
    downloadUrl: string,
    file: any,
    partSize: number
  ) {
    return retryRequest(async () => {
      const startUploadResponse = await axios.post(
        `${apiUrl}/b2api/v2/b2_start_large_file`,
        { bucketId: B2_BUCKET_ID, fileName: `large_upload_${Date.now()}` },
        { headers: { Authorization: authToken } }
      );

      const { fileId } = startUploadResponse.data;
      const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
      if (!fileInfo.exists) throw new Error(`File doesn't exist: ${file.uri}`);
      const fileSize = (fileInfo as { size: number }).size ?? 0;
      if (fileSize === 0) throw new Error(`File is empty: ${file.uri}`);

      const totalParts = Math.ceil(fileInfo.size / partSize);
      await Promise.all(
        Array.from({ length: totalParts }).map(async (_, index) => {
          await retryRequest(async () => {
            const uploadPartUrlResponse = await axios.post(
              `${apiUrl}/b2api/v2/b2_get_upload_part_url`,
              { fileId },
              { headers: { Authorization: authToken } }
            );
            const { uploadUrl, authorizationToken: partAuthToken } =
              uploadPartUrlResponse.data;

            const start = index * partSize;
            const end = Math.min(start + partSize, fileInfo.size);
            const partUri = `${file.uri}#${start}-${end}`;

            await FileSystem.uploadAsync(uploadUrl, partUri, {
              headers: {
                Authorization: partAuthToken,
                "X-Bz-Part-Number": (index + 1).toString(),
                "X-Bz-Content-Sha1": "do_not_verify",
              },
              uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
              httpMethod: "POST",
            });
          });
        })
      );
      await axios.post(
        `${apiUrl}/b2api/v2/b2_finish_large_file`,
        { fileId, partSha1Array: [] },
        { headers: { Authorization: authToken } }
      );
      return `${downloadUrl}/file/${B2_BUCKET_NAME}/${fileId}`;
    });
  }

  const getFileExtension = (uri: string): string =>
    uri.split(".").pop()?.toLowerCase() || "jpg";
  const getMimeType = (extension: string): string =>
    ({ jpg: "image/jpeg", png: "image/png" }[extension] ||
    "application/octet-stream");

  return { uploadMultimedia, progress, error };
};

export default useStorageBucket;
